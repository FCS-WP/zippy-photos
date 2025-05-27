<?php

namespace Zippy_Addons\Src\Controllers\Menu;

use Exception;
use WP_REST_Request;
use WP_Error;
use Zippy_Addons\Src\App\Zippy_Response_Handler;
use Zippy_Addons\Src\App\Models\Zippy_Request_Validation;
use Zippy_Addons\Src\App\Models\Zippy_Log_Action;
use Zippy_Addons\Src\Helpers\Zippy_Request_Helper;

defined('ABSPATH') or die();

class Zippy_Menu_Controller
{

  private static function check_menu_exists($menu_id)
  {
    global $wpdb;
    return (bool) $wpdb->get_var($wpdb->prepare("SELECT COUNT(*) FROM {$wpdb->prefix}zippy_menus WHERE id = %d", $menu_id));
  }

  private static function sanitize_menu_data($request)
  {
    return [
      'id' => intval($request['id']),
      'name' => sanitize_text_field($request['name']),
      'address' => sanitize_text_field($request['address']),
    ];
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

  private static function check_overlap_menu_time_ranges($data)
  {
    global $wpdb;

    // Check for overlapping time ranges
    $overlap_query = $wpdb->prepare(
      "SELECT COUNT(*) FROM {$wpdb->prefix}zippy_menus 
          WHERE (id <> %d) AND (%s BETWEEN start_date AND end_date OR %s BETWEEN start_date AND end_date OR 
                 start_date BETWEEN %s AND %s OR end_date BETWEEN %s AND %s)",
      $data['id'],
      $data['start_date'],
      $data['end_date'],
      $data['start_date'],
      $data['end_date'],
      $data['start_date'],
      $data['end_date']
    );

    return $wpdb->get_var($overlap_query);
  }

  public static function set_menu(WP_REST_Request $request)
  {
    global $wpdb;
    $params = $request->get_params();
    $rules = [
      'name' =>  ['type' => 'string', 'required' => true],
      'address' =>  ['type' => 'string', 'required' => true],
    ];

    $validation = Zippy_Request_Helper::validate_request($params, $rules);

    if (is_wp_error($validation)) {
      return $validation;
    }

    $result = self::execute_db_transaction(function () use ($wpdb, $params) {
      return $wpdb->insert(
        "{$wpdb->prefix}zippy_menus",
        array_merge($params, ['created_at' => current_time('mysql')]),
        ['%s', '%s', '%s']
      );
    });

    return is_string($result)
      ? new WP_Error($result, 500)
      : rest_ensure_response([
        'success' => true,
        'message' => "Menu created successfully.",
      ]);
  }

  public static function get_menus(WP_REST_Request $request)
  {
    global $wpdb;
    $params = $request->get_params();
    $rules = [
      'id' =>  ['type' => 'int', 'required' => false],
    ];

    $validation = Zippy_Request_Helper::validate_request($params, $rules);

    if (is_wp_error($validation)) {
      return $validation;
    }

    $menu_id = (int) $params['id'];
    $query = $menu_id
      ? $wpdb->prepare("SELECT * FROM {$wpdb->prefix}zippy_menus WHERE id = %d", $menu_id)
      : "SELECT * FROM {$wpdb->prefix}zippy_menus";

    $menus = $wpdb->get_results($query);

    return !$menus
      ? new WP_Error("Menu not found", 500)
      : rest_ensure_response([
        'success' => true,
        'results' => $menus,
      ]);
  }

  public static function update_menu(WP_REST_Request $request)
  {
    global $wpdb;

    $rules = [
      'id' =>  ['type' => 'int', 'required' => true],
      "name" => ["type" => "string", "required" => true],
      "address" => ["type" => "string", "required" => true],
    ];

    $validation = Zippy_Request_Helper::validate_request($request->get_params(), $rules);

    if (is_wp_error($validation)) {
      return $validation;
    }

    $id = intval($request['id']);
    if (!self::check_menu_exists($id)) {
      return new WP_Error("Menu not found.", 404);
    }

    $data = self::sanitize_menu_data($request);

    if ($wpdb->get_var($wpdb->prepare("SELECT COUNT(*) FROM {$wpdb->prefix}zippy_menus WHERE name = %s AND id != %d", $data['name'], $id))) {
      return new WP_Error("The menu name '{$data['name']}' already exists.", 400);
    }

    $result = self::execute_db_transaction(function () use ($wpdb, $data, $id) {
      return $wpdb->update(
        "{$wpdb->prefix}zippy_menus",
        array_merge($data, ['updated_at' => current_time('mysql')]),
        ['id' => $id],
        ['%s', '%s', '%s'],
        ['%d']
      );
    });

    return is_string($result)
    ? new WP_Error("Menu not found", 500)
    : rest_ensure_response([
      'success' => true,
      'results' => $result,
      'message' => 'Update menu successfully!'
    ]);
  }

  public static function delete_items(WP_REST_Request $request)
  {
    global $wpdb;
    $table_name = $wpdb->prefix . 'zippy_menus';

    $rules = [
      "ids" => ["required" => true, "type" => "array"],
    ];

    $validation = Zippy_Request_Helper::validate_request($request->get_params(), $rules);

    if (is_wp_error($validation)) {
      return $validation;
    }

    try {
      $ids = array_map('intval', $request->get_param('ids'));
      $ids_placeholder = implode(',', array_fill(0, count($ids), '%d'));

      $query = $wpdb->prepare("DELETE FROM $table_name WHERE id IN ($ids_placeholder)", ...$ids);

      $result = self::execute_db_transaction(fn() => $wpdb->query($query));

      return is_string($result)
        ? new WP_Error($result, 500)
        : rest_ensure_response([
          'success' => true,
          'message' => "Delete successfully!",
        ]);
    } catch (\Exception $e) {
      $error_message = $e->getMessage();
      return new WP_Error($error_message, 500);
    }
  }
}
