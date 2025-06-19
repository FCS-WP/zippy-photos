<?php

/**
 * Bookings Admin Settings
 *
 *
 */

namespace Zippy_Addons\Src\Database;

defined('ABSPATH') or die();


class Zippy_Database
{
  protected static $_instance = null;

  /**
   * @return Zippy_Database
   */

  public static function get_instance()
  {
    if (is_null(self::$_instance)) {
      self::$_instance = new self();
    }
    return self::$_instance;
  }


  public function __construct()
  {
    /* Create Zippy API Token */
    register_activation_hook(ZIPPY_ADDONS_BASENAME, array($this, 'create_photo_detail_table'));
    register_activation_hook(ZIPPY_ADDONS_BASENAME, array($this, 'create_menus_table'));
    register_activation_hook(ZIPPY_ADDONS_BASENAME, array($this, 'create_menu_products_table'));
  }


  public function create_photo_detail_table()
  {
    global $wpdb;
    $table_name = $wpdb->prefix . 'photo_details';

    $charset_collate = $wpdb->get_charset_collate();

    $sql = "CREATE TABLE $table_name (
        id BIGINT(20) UNSIGNED NOT NULL AUTO_INCREMENT,
        user_id BIGINT(20) NOT NULL,
        order_id BIGINT(20) NOT NULL,
        product_id BIGINT(20) NOT NULL,
        item_id BIGINT(20) NOT NULL,
        photo_url TEXT NOT NULL,
        paper_type VARCHAR(20) NOT NULL,
        quantity INT NOT NULL,
        status VARCHAR(20) NULL,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        PRIMARY KEY (id)
    ) $charset_collate;";

    require_once(ABSPATH . 'wp-admin/includes/upgrade.php');
    dbDelta($sql);
  }

  public function create_menus_table()
  {
    global $wpdb;
    $table_name = $wpdb->prefix . 'zippy_menus';
    $charset_collate = $wpdb->get_charset_collate();

    $sql = "CREATE TABLE $table_name (
          id INT NOT NULL AUTO_INCREMENT,
          name VARCHAR(255) NOT NULL,
          address TEXT NOT NULL,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          PRIMARY KEY (id)
      ) $charset_collate;";

    require_once ABSPATH . 'wp-admin/includes/upgrade.php';
    dbDelta($sql);
  }

  public function create_menu_products_table()
  {
    global $wpdb;
    $table_name = $wpdb->prefix . 'zippy_menu_products';
    $menus_table = $wpdb->prefix . 'zippy_menus';
    $charset_collate = $wpdb->get_charset_collate();

    $sql = "CREATE TABLE $table_name (
          id INT NOT NULL AUTO_INCREMENT,
          id_menu INT NOT NULL,
          id_product INT NOT NULL,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          PRIMARY KEY (id),
          CONSTRAINT fk_menu FOREIGN KEY (id_menu) REFERENCES $menus_table(id) ON DELETE CASCADE ON UPDATE CASCADE
      ) $charset_collate;";

    require_once ABSPATH . 'wp-admin/includes/upgrade.php';
    dbDelta($sql);
  }
}
