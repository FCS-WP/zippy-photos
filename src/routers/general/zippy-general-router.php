<?php

namespace Zippy_Addons\Src\Routers\General;

/**
 * Bookings General Router
 *
 *
 */

defined('ABSPATH') or die();

use Zippy_Addons\Src\Middleware\Admin\Zippy_Booking_Permission;
use Zippy_Addons\Src\Controllers\Web\Auth_Controller;
use Zippy_Addons\Src\Controllers\Web\Google_Drive_Controller;

class Zippy_General_Router
{

  protected static $_instance = null;

  /**
   * @return Zippy_General_Router
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
    add_action('rest_api_init', array($this, 'zippy_photo_route_init'));
  }

  public function zippy_photo_route_init()
  {
    register_rest_route(ZIPPY_BOOKING_API_NAMESPACE, '/zippy-signin', array(
      'methods' => 'POST',
      'callback' => [Auth_Controller::class, 'signin'],
      'permission_callback' => array(Zippy_Booking_Permission::class, 'zippy_permission_callback'),

    ));

    register_rest_route(ZIPPY_BOOKING_API_NAMESPACE, '/zippy-register', array(
      'methods' => 'POST',
      'callback' => [Auth_Controller::class, 'register'],
      'permission_callback' => array(Zippy_Booking_Permission::class, 'zippy_permission_callback'),
    ));

    register_rest_route(ZIPPY_BOOKING_API_NAMESPACE, '/get-google-token', array(
      'methods' => 'GET',
      'callback' => [Google_Drive_Controller::class, 'get_google_token'],
    ));

    register_rest_route(ZIPPY_BOOKING_API_NAMESPACE, '/oauth/callback', array(
      'methods' => 'GET',
      'callback' => [Google_Drive_Controller::class, 'handle_google_callback'],
    ));
  }
}
