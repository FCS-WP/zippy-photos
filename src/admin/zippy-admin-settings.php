<?php

/**
 * Bookings Admin Settings
 *
 *
 */

namespace Zippy_Addons\Src\Admin;

defined('ABSPATH') or die();

use Zippy_Addons\Src\Controllers\Web\Google_Drive_Controller;
use Zippy_Addons\Utils\Zippy_Utils_Core;

class Zippy_Admin_Settings
{
  protected static $_instance = null;

  /**
   * @return Zippy_Admin_Settings
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

    /* Register Menu Admin Part */
    add_action('admin_menu',  array($this, 'admin_page'));
    add_action('admin_enqueue_scripts', array($this, 'remove_default_stylesheets'));
    /* Register Assets Admin Part */
    add_action('admin_enqueue_scripts', array($this, 'admin_assets'));
    add_action('admin_init', array($this, 'handle_photobook_get_token'));
    /* Create Zippy API Token */
    // register_activation_hook(ZIPPY_ADDONS_BASENAME, array($this, 'create_one_map_credentials'));
  }

  public function admin_assets()
  {
    $version = time();
    $current_user_id = get_current_user_id();
    // Pass the user ID to the script
    wp_enqueue_script('admin-booking-js', ZIPPY_ADDONS_URL . '/assets/dist/js/admin.min.js', [], $version, true);
    wp_enqueue_style('booking-css', ZIPPY_ADDONS_URL . '/assets/dist/css/admin.min.css', [], $version);
    wp_localize_script('booking-js-current-id', 'admin_id', array(
      'userID' => $current_user_id,
    ));
  }

  public function handle_photobook_get_token () 
  {
    if (isset($_GET['get-photobook-token'])) {
        Google_Drive_Controller::get_photobook_token();
        exit;
    }
  }

  public function admin_page()
  {
    add_menu_page('Zippy Photos', 'Zippy Photos', 'manage_options', 'zippy-photos', array($this, 'dashboard_render'), 'dashicons-list-view', 6);
    // SubPage
    // add_submenu_page('zippy-bookings', 'Settings', 'Settings', 'manage_options', 'settings', array($this, 'settings_render'));
    add_submenu_page('zippy-photos', 'Menus', 'Menus', 'manage_options', 'menus', array($this, 'menus_render'));
  }

  public function menus_render()
  {
    echo Zippy_Utils_Core::get_template('menus.php', [], dirname(__FILE__), '/templates');
  }

  public function render()
  {
    echo Zippy_Utils_Core::get_template('booking-dashboard.php', [], dirname(__FILE__), '/templates');
  }
  public function settings_render()
  {
    echo Zippy_Utils_Core::get_template('settings.php', [], dirname(__FILE__), '/templates');
  }

  public function dashboard_render()
  {
    echo Zippy_Utils_Core::get_template('index.php', [], dirname(__FILE__), '/templates');
  }

  public function remove_default_stylesheets($handle)
  {
    $apply_urls = [
      'toplevel_page_zippy-addons',
      'zippy-add-ons_page_menus'
    ];

    if (in_array($handle, $apply_urls)) {
      // Deregister the 'forms' stylesheet
      wp_deregister_style('forms');

      add_action('admin_head', function () {
        $admin_url = get_admin_url();
        $styles_to_load = [
          'dashicons',
          'admin-bar',
          'common',
          'admin-menu',
          'dashboard',
          'list-tables',
          'edit',
          'revisions',
          'media',
          'themes',
          'about',
          'nav-menus',
          'wp-pointer',
          'widgets',
          'site-icon',
          'l10n',
          'buttons',
          'wp-auth-check'
        ];

        $wp_version = get_bloginfo('version');

        // Generate the styles URL
        $styles_url = $admin_url . '/load-styles.php?c=0&dir=ltr&load=' . implode(',', $styles_to_load) . '&ver=' . $wp_version;

        // Enqueue the stylesheet
        echo '<link rel="stylesheet" href="' . esc_url($styles_url) . '" media="all">';
      });
    }
  }
}
