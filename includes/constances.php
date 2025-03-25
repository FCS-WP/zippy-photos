<?php

/* Set constant url to the plugin directory. */

if (!defined('ZIPPY_ADDONS_URL')) {
  define('ZIPPY_ADDONS_URL', plugin_dir_url(__FILE__));
}

/* Set constant enpoint to the plugin directory. */
if (!defined('ZIPPY_BOOKING_API_NAMESPACE')) {
  define('ZIPPY_BOOKING_API_NAMESPACE', 'zippy-addons/v1');
}
