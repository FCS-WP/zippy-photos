<?php

/**
 * API Args Handler
 *
 * @package Shin
 */

namespace Zippy_Booking\Src\App\Models;

defined('ABSPATH') or die();

use WP_REST_Response;
use Zippy_Booking\App\Models\Zippy_Request_Validation;

class Zippy_Api_Booking_Model
{
  public static function get_booking_args()
  {
    return array(
      'booking_id' => array(
        'required' => false,
        'validate_callback' => function ($param) {
          return is_numeric($param);
        }
      ),
      'email' => array(
        'required' => false,
        'validate_callback' => function ($param) {
          return is_email($param);
        }
      ),
      'product_id' => array(
        'required' => false,
        'validate_callback' => function ($param) {
          return is_numeric($param);
        }
      ),
    );
  }

}
