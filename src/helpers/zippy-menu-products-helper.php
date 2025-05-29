<?php

namespace Zippy_Addons\Src\Helpers;


class Zippy_Menu_Products_Helper 
{
    private static function get_product_outlets($ids)
    {
      global $wpdb;
      if (empty($ids)) {
        return [];
      }
      $ids = array_map('intval', $ids);
      $ids_placeholder = implode(',', array_fill(0, count($ids), '%d'));
  
      $menu_product_table = $wpdb->prefix . 'zippy_menu_products';
  
      $query = $wpdb->prepare(
        "SELECT id_product, id_menu
           FROM $menu_product_table
           WHERE id_product IN ($ids_placeholder)",
        ...$ids
      );
  
      $results = $wpdb->get_results($query);
  
      $grouped = [];
  
      foreach ($results as $row) {
        $product_id = (int) $row->id_product;
        $menu_id = (int) $row->id_menu;
  
        if (!isset($grouped[$product_id])) {
          $grouped[$product_id] = [
            'product_id' => $product_id,
            'include_outlet' => [],
          ];
        }
  
        // Avoid duplicates
        if (!in_array($menu_id, $grouped[$product_id]['include_outlet'], true)) {
          $grouped[$product_id]['include_outlet'][] = $menu_id;
        }
      }
      return $grouped;
    }
  
    public static function get_outlets_with_all_products_with_info($ids = [])
    {
      global $wpdb;
  
      if (empty($ids)) {
        return [];
      }
  
      $grouped = self::get_product_outlets($ids);
  
      if (empty($grouped)) {
        return [];
      }
  
      $outlet_sets = array_map(function ($item) {
        return array_unique($item['include_outlet']);
      }, $grouped);
  
      $common_outlet_ids = array_shift($outlet_sets);
      foreach ($outlet_sets as $outlet_ids) {
        $common_outlet_ids = array_intersect($common_outlet_ids, $outlet_ids);
      }
  
      if (empty($common_outlet_ids)) {
        return [];
      }
  
      $common_outlet_ids = array_map('intval', $common_outlet_ids);
      $placeholders = implode(',', array_fill(0, count($common_outlet_ids), '%d'));
  
      $query = $wpdb->prepare(
        "SELECT id, name, address
           FROM {$wpdb->prefix}zippy_menus
           WHERE id IN ($placeholders)",
        ...$common_outlet_ids
      );
  
      $outlets = $wpdb->get_results($query, ARRAY_A);
  
      return $outlets;
    }
}
