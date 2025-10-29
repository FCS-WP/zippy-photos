<?php

/**
 * Bookings FontEnd Form
 *
 *
 */

namespace Zippy_Addons\Src\Web;

defined('ABSPATH') or die();

use DateTime;

class Zippy_Booking_Web
{
  protected static $_instance = null;

  /**
   * @return Zippy_Booking_Web
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
    /* Set timezone SG */
    date_default_timezone_set('Asia/Singapore');

    /* Init Function */
    add_shortcode('zippy_photo_editor', array($this, 'zippy_photo_editor'));
    add_action('wp_enqueue_scripts', array($this, 'booking_assets'));
  }

  public function function_init()
  {
    return;
  }


  public function booking_assets()
  {
    if (is_admin() || is_front_page()) return;
    $version = time();

    $current_user_id = get_current_user_id();
    $user_info = get_userdata($current_user_id);
    // Form Assets
    wp_enqueue_script('booking-js', ZIPPY_ADDONS_URL . '/assets/dist/js/web.min.js', [], $version, true);
    wp_enqueue_style('booking-css', ZIPPY_ADDONS_URL . '/assets/dist/css/web.min.css', [], $version);
    // Enqueue external Google APIs
    wp_enqueue_script('google-api', 'https://apis.google.com/js/api.js', [], null, true);
    wp_enqueue_script('google-identity', 'https://accounts.google.com/gsi/client', [], null, true);

    wp_localize_script('booking-js', 'admin_data', array(
      'userID' => $current_user_id,
      'user_email' => $user_info ? $user_info->user_email : ''
    ));
  }

  public function zippy_photo_editor($atts)
  {
    return '<div id="zippy_photo_editor"></div>';
  }
}
