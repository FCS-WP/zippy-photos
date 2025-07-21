<?php

namespace Zippy_Addons\Src\Routers\Menu;

use Zippy_Addons\Src\Controllers\Menu\Zippy_Menu_Controller;

use Zippy_Addons\Src\Controllers\Menu\Zippy_Menu_Products_Controller;


/**
 * Menu Router
 *
 *
 */

defined('ABSPATH') or die();

class Zippy_Menu_Router
{
  protected static $_instance = null;

  /**
   * @return Zippy_Menu_Router
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
    add_action('rest_api_init', array($this, 'zippy_menu_init_api'));
  }

  public function zippy_menu_init_api()
  {
    register_rest_route(ZIPPY_BOOKING_API_NAMESPACE, '/menus', array(
      'methods' => 'GET',
      'callback' => [Zippy_Menu_Controller::class, 'get_menus'],
    ));

    register_rest_route(ZIPPY_BOOKING_API_NAMESPACE, '/menus', array(
      'methods' => 'POST',
      'callback' => [Zippy_Menu_Controller::class, 'set_menu'],
    ));

    register_rest_route(ZIPPY_BOOKING_API_NAMESPACE, '/menus', array(
      'methods' => 'PUT',
      'callback' => [Zippy_Menu_Controller::class, 'update_menu'],
    ));

    register_rest_route(ZIPPY_BOOKING_API_NAMESPACE, '/menus', array(
      'methods' => 'DELETE',
      'callback' => [Zippy_Menu_Controller::class, 'delete_items'],
    ));

    register_rest_route(ZIPPY_BOOKING_API_NAMESPACE, '/products-menu', array(
      'methods' => 'GET',
      'callback' => [Zippy_Menu_Products_Controller::class, 'get_products_in_menu'],
    ));

    register_rest_route(ZIPPY_BOOKING_API_NAMESPACE, '/products-menu', array(
      'methods' => 'POST',
      'callback' => [Zippy_Menu_Products_Controller::class, 'add_products_to_menu'],
    ));

     register_rest_route(ZIPPY_BOOKING_API_NAMESPACE, '/products-by-categories', array(
      'methods' => 'POST',
      'callback' => [Zippy_Menu_Products_Controller::class, 'add_products_by_categories'],
    ));

    register_rest_route(ZIPPY_BOOKING_API_NAMESPACE, '/products-menu', array(
      'methods' => 'DELETE',
      'callback' => [Zippy_Menu_Products_Controller::class, 'remove_products_from_menu'],
    ));

  }
}
