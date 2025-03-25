<?php

namespace Zippy_Addons\Src\Routers;

/**
 * Bookings General Router
 *
 *
 */

defined('ABSPATH') or die();

use Zippy_Addons\Src\Routers\General\Zippy_General_Router;


class Zippy_Booking_Routers
{
  protected static $_instance = null;

  /**
   * @return Zippy_Booking_Routers
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
    Zippy_General_Router::get_instance();
  }
}
