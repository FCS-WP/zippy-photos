<?php
/*
Plugin Name: Zippy Woocommerce Add-ons
Plugin URI: https://zippy.sg/
Description: Booking System, Manage Oder, Monthly Payment...
Version: 1.0 Author: Zippy SG
Author URI: https://zippy.sg/
License: GNU General Public
License v3.0 License
URI: https://zippy.sg/
Domain Path: /languages

Copyright 2024

*/

namespace Zippy_Addons;


defined('ABSPATH') or die('°_°’');

/* ------------------------------------------
 // Constants
 ------------------------------------------------------------------------ */
/* Set plugin version constant. */

if (!defined('ZIPPY_ADDONS_VERSION')) {
  define('ZIPPY_ADDONS_VERSION', '4.0');
}

/* Set plugin name. */

if (!defined('ZIPPY_ADDONS_NAME')) {
  define('ZIPPY_ADDONS_NAME', 'Zippy Addons');
}

if (!defined('ZIPPY_ADDONS_PREFIX')) {
  define('ZIPPY_ADDONS_PREFIX', 'zippy_addons');
}

if (!defined('ZIPPY_ADDONS_BASENAME')) {
  define('ZIPPY_ADDONS_BASENAME', plugin_basename(__FILE__));
}

/* Set constant path to the plugin directory. */

if (!defined('ZIPPY_ADDONS_DIR_PATH')) {
  define('ZIPPY_ADDONS_DIR_PATH', plugin_dir_path(__FILE__));
}

/* Set constant url to the plugin directory. */

if (!defined('ZIPPY_ADDONS_URL')) {
  define('ZIPPY_ADDONS_URL', plugin_dir_url(__FILE__));
}

/* Set constant enpoint to the plugin directory. */
if (!defined('ZIPPY_BOOKING_API_NAMESPACE')) {
  define('ZIPPY_BOOKING_API_NAMESPACE', 'zippy-addons/v1');
}


if (!defined('ZIPPY_BOOKING_API_TOKEN_NAME')) {
  define('ZIPPY_BOOKING_API_TOKEN_NAME', 'zippy_booking_api_token');
}

if (!defined('ZIPPY_BOOKING_API_TOKEN')) {
  define('ZIPPY_BOOKING_API_TOKEN', 'FEhI30q7ySHtMfzvSDo6RkxZUDVaQ1BBU3lBcGhYS3BrQStIUT09');
}
/* Default Timezone */
date_default_timezone_set("Asia/Singapore");



// ini_set('display_errors', 1);
// ini_set('display_startup_errors', 1);
// error_reporting(E_ALL);

/* ------------------------------------------
// Includes
 --------------------------- --------------------------------------------- */
require ZIPPY_ADDONS_DIR_PATH . '/includes/autoload.php';
require ZIPPY_ADDONS_DIR_PATH . '/includes/custom-admin-order.php';
require ZIPPY_ADDONS_DIR_PATH . '/includes/custom-order.php';
require ZIPPY_ADDONS_DIR_PATH . '/includes/custom-shipping-method.php';

use Zippy_Addons\Src\Admin\Zippy_Admin_Settings;
use Zippy_Addons\Src\Database\Zippy_Database;
use Zippy_Addons\Src\Routers\Zippy_Booking_Routers;
use Zippy_Addons\Src\Web\Zippy_Booking_Web;
use Zippy_Addons\Src\Woocommerce\Zippy_Woo_Photo;

/**
 *
 * Init Zippy Booking
 */

Zippy_Admin_Settings::get_instance();
Zippy_Booking_Web::get_instance();
Zippy_Database::get_instance();
Zippy_Booking_Routers::get_instance();
Zippy_Woo_Photo::get_instance();

