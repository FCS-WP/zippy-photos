<?php

namespace Zippy_Addons\Src\Controllers\Products;

use Error;
use WP_REST_Request;
use Zippy_Addons\Src\App\Zippy_Response_Handler;
use Zippy_Addons\Src\App\Models\Zippy_Request_Validation;
use Zippy_Addons\Src\Helpers\Zippy_Request_Helper;

defined('ABSPATH') or die();

class Zippy_Products_Controller
{

  private static function validate_request($required_fields, WP_REST_Request $request)
  {
    $validate = Zippy_Request_Validation::validate_request($required_fields, $request);
    return empty($validate) ? null : Zippy_Response_Handler::error($validate, 400);
  }

  private static function sanitize_key_word($request)
  {
    return [
      'keyword' => sanitize_text_field($request['keyword']),
      'limit' => isset($request['limit']) ? max(1, min(100, intval($request['limit']))) : 10
    ];
  }

  private static function sanitize_product_checking($request)
  {
    return [
      'product_id' => sanitize_text_field($request['product_id']),
      'outlet_id' => sanitize_text_field($request['outlet_id']),
      'current_date' => sanitize_text_field($request['current_date']),
    ];
  }

  private static function check_outlet_exists($outlet_id)
  {
    global $wpdb;
    return (bool) $wpdb->get_var($wpdb->prepare("SELECT COUNT(ID) FROM {$wpdb->prefix}zippy_addons_outlet WHERE id = %d", $outlet_id));
  }


  private static function execute_db_transaction($query_fn)
  {
    global $wpdb;
    try {
      $wpdb->query('START TRANSACTION');
      $result = $query_fn();
      if ($result === false) {
        throw new \Exception("Database operation failed: " . $wpdb->last_error);
      }
      $wpdb->query('COMMIT');
      return $result;
    } catch (\Exception $e) {
      $wpdb->query('ROLLBACK');
      return $e->getMessage();
    }
  }


  private static function get_active_week_days($jsonString)
  {
    // Decode the JSON string into an array
    $data = json_decode($jsonString);

    if (!$data || !is_array($data) || !isset($data[0]->operating_hours)) {
      return [];
    }

    $operating_hours = $data[0]->operating_hours;
    $active_days = [];

    foreach ($operating_hours as $day) {
      if (!empty($day->open_at)) {
        $active_days[] = array(
          'weekday' => $day->week_day,
          'is_available' => 1
        );
      }
    }
    $response = array(
      'days_of_week' => $active_days,
      'closed_dates' => $data[0]->closed_dates
    );

    return $response;
  }

  private static function get_outlet_operating_date($outlet_id)
  {
    global $wpdb;

    $result = $wpdb->get_results($wpdb->prepare("SELECT operating_hours, closed_dates FROM {$wpdb->prefix}zippy_addons_outlet WHERE id = %s", $outlet_id));

    foreach ($result as $key => $value) {
      $unserialze_fields = [
        "operating_hours",
        "closed_dates",
      ];
      foreach ($unserialze_fields as $field) {
        $result[$key]->{$field} = maybe_unserialize($result[$key]->{$field});
      }
    }

    return json_encode($result);
  }

  private static function get_menus_product_belong_to($product_id, $current_date)
  {
    global $wpdb;

    // Check for overlapping time ranges
    $query = $wpdb->prepare(
      "SELECT m.name, m.start_date, m.end_date, m.days_of_week 
      FROM `{$wpdb->prefix}zippy_menu_products` as pm 
      LEFT JOIN {$wpdb->prefix}zippy_menus as m ON pm.id_menu = m.id 
      WHERE pm.id_product = %s AND (m.end_date >= %s OR m.end_date IS NULL)
      ORDER BY pm.id_menu",
      $product_id,
      $current_date
    );

    $menu = $wpdb->get_results($query);

    if (empty($menu)) return;
    // // Decode JSON field
    foreach ($menu as $menu_row) {
      $menu_row->days_of_week = !empty($menu_row->days_of_week) ? json_decode($menu_row->days_of_week, true) : [];
    }

    return $menu;
  }

  /**
   * SEARCH PRODUCTS
   */
  public static function search_products(WP_REST_Request $request)
  {
    global $wpdb;

    $rules = [
      'keyword' =>  ['type' => 'string', 'required' => false],
    ];

    $validation = Zippy_Request_Helper::validate_request($request->get_params(), $rules);

    if (is_wp_error($validation)) {
      return $validation;
    }

    // Sanitize Input
    $data = self::sanitize_key_word($request);

    // Execute Database Query
    $result = self::execute_db_transaction(function () use ($wpdb, $data) {
      return $wpdb->get_results(
        $wpdb->prepare("
          SELECT
              p.id,
              p.post_title AS name,
              t.term_id AS category_id,
              t.name AS category_name
          FROM {$wpdb->prefix}posts p
          LEFT JOIN {$wpdb->prefix}term_relationships tr ON p.ID = tr.object_id
          LEFT JOIN {$wpdb->prefix}term_taxonomy tt ON tr.term_taxonomy_id = tt.term_taxonomy_id
          LEFT JOIN {$wpdb->prefix}terms t ON tt.term_id = t.term_id
          WHERE p.post_title LIKE %s
          AND p.post_type = 'product'
          AND tt.taxonomy = 'product_cat'
          LIMIT %d
      ", '%' . $wpdb->esc_like($data['keyword']) . '%', $data['limit'])
      );
    });
    
    // Return Response
    return is_string($result)
      ? new Error($result, 500)
      : rest_ensure_response([
        'success' => true,
        'results' => $result,
        'message' => "Product retrive successfully!",
      ]);
  }

  /**
   *  PRODUCTS PLANNING
   */

  public static function product_checking(WP_REST_Request $request)
  {
    global $wpdb;

    // Validate Request
    if ($error = self::validate_request([
      "product_id" => ["data_type" => "number", "required" => true],
      "outlet_id" => ["data_type" => "string", "required" => true],
      "current_date" => ["data_type" => "date", "required" => true],
    ], $request)) {
      return $error;
    }

    $response = array();

    // Sanitize Input
    $data = self::sanitize_product_checking($request);

    if (!self::check_outlet_exists($data['outlet_id'])) {
      return Zippy_Response_Handler::error("Outlet not found.", 404);
    }

    //Step 1 : Check Date Include in Store Available Time or not

    $operation_time = self::get_outlet_operating_date($data['outlet_id']);

    $store_available = self::get_active_week_days($operation_time);

    //Step 2 : Product ID include Which Menu -> Active Time ?

    $menus = self::get_menus_product_belong_to($data['product_id'], $data['current_date']);

    $response = array(
      'store_operation' => $store_available,
      'menus_operation' => $menus
    );

    //Step 3: Return the time Available
    return empty($response)
      ? new Error($response, 500)
      : rest_ensure_response([
        'success' => true,
        'results' => $response,
        'message' => "Products retrive successfully!",
      ]);
  }
}
