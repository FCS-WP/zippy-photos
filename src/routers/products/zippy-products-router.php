<?php

namespace Zippy_Addons\Src\Routers\Products;

use Zippy_Addons\Src\App\Models\Products\Zippy_Products_Model;

use Zippy_Addons\Src\Controllers\Products\Zippy_Products_Controller;


/**
 * Menu Router
 *
 *
 */

defined('ABSPATH') or die();

class Zippy_Products_Router
{
  protected static $_instance = null;

  /**
   * @return Zippy_Products_Router
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
    add_action('rest_api_init', array($this, 'zippy_products_init_api'));
  }

  public function zippy_products_init_api()
  {
    register_rest_route(ZIPPY_BOOKING_API_NAMESPACE, '/search-products', array(
      'methods' => 'GET',
      'callback' => [Zippy_Products_Controller::class, 'search_products'],
    ));

    register_rest_route(ZIPPY_BOOKING_API_NAMESPACE, '/search-categories', array(
      'methods' => 'GET',
      'callback' => [Zippy_Products_Controller::class, 'search_categories'],
    ));

    register_rest_route(ZIPPY_BOOKING_API_NAMESPACE, '/product-checking', array(
      'methods' => 'GET',
      'callback' => [Zippy_Products_Controller::class, 'product_checking'],
    ));
  }
}
