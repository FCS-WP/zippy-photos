<?php

/**
 * Woocommece Booking Settings
 *
 *
 */

namespace Zippy_Addons\Src\Woocommerce;

use WC_AJAX;
use Zippy_Addons\Src\Controllers\Web\Zippy_Photobook_Controller;

defined('ABSPATH') or die();


class Zippy_Woo_Photo
{
  protected static $_instance = null;

  /**
   * @return Zippy_Woo_Photo
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
    if (!function_exists('is_plugin_active')) {

      include_once(ABSPATH . 'wp-admin/includes/plugin.php');
    }
    if (!is_plugin_active('woocommerce/woocommerce.php')) return;

    $this->set_hooks();

    /* Update Checkout After Applied Coupon */
    add_action('woocommerce_applied_coupon', array($this, 'after_apply_coupon_action'));
    add_action('woocommerce_before_add_to_cart_button', array($this, 'custom_div_before_add_to_cart'));
    add_action('woocommerce_product_options_pricing', array($this, 'add_custom_price_field_to_product'));
    add_action('woocommerce_variation_options', array($this, 'add_custom_photo_limits_fields'), 10, 3);
    add_action('woocommerce_save_product_variation', array($this, 'save_custom_photo_limits_fields'), 10, 2);
    add_action('wp_ajax_nopriv_photobook', array($this, 'wc_photobook'));
    add_action('wp_ajax_photobook', array($this, 'wc_photobook'));
    add_filter('woocommerce_add_cart_item_data', array($this, 'add_unique_cart_item_key'), 10, 3);
  }

  function custom_div_before_add_to_cart()
  {
    if (!is_product()) {
      return;
    }
    global $product;
    $isPhotobook = Zippy_Photobook_Controller::check_is_photobook_category($product);
    if ($isPhotobook) {
      $type = $product->get_type();
      echo '<div id="zippy_photobook" data-product_type="' . $type . '"></div>';
    }
  }

  function after_apply_coupon_action($coupon_code)
  {
    echo '<script>jQuery( "body" ).trigger( "update_checkout" ); </script>';
  }

  protected function set_hooks()
  {
    add_filter('wc_get_template_part', array($this, 'override_woocommerce_template_part'), 1000, 3);
    add_filter('woocommerce_locate_template', array($this, 'override_woocommerce_template'), 1000, 3);
  }

  /**
   * Template Part's
   *
   * @param  string $template Default template file path.
   * @param  string $slug     Template file slug.
   * @param  string $name     Template file name.
   * @return string           Return the template part from plugin.
   */
  public function override_woocommerce_template_part($template, $slug, $name)
  {

    $template_directory = untrailingslashit(plugin_dir_path(__FILE__)) . "/templates/";
    if ($name) {
      $path = $template_directory . "{$slug}-{$name}.php";
    } else {
      $path = $template_directory . "{$slug}.php";
    }
    return file_exists($path) ? $path : $template;
  }
  /**
   * Template File
   *
   * @param  string $template      Default template file  path.
   * @param  string $template_name Template file name.
   * @param  string $template_path Template file directory file path.
   * @return string                Return the template file from plugin.
   */
  public function override_woocommerce_template($template, $template_name, $template_path)
  {

    $template_directory = untrailingslashit(plugin_dir_path(__FILE__)) . "/templates/";

    $path = $template_directory . $template_name;
    // echo 'template: ' . $path . '<br/>';

    return file_exists($path) ? $path : $template;
  }

  public function add_custom_price_field_to_product()
  {
    woocommerce_wp_text_input(array(
      'id' => '_extra_price',
      'label' => __('Extra price ($)', 'woocommerce'),
      'description' => __('Enter an price by hour for this product.', 'woocommerce'),
      'desc_tip' => 'true',
      'type' => 'number',
      'custom_attributes' => array(
        'step' => '0.1',
        'min' => '0'
      )
    ));
  }

  function add_custom_photo_limits_fields($loop, $variation_data, $variation)
  {
    echo '<div class="custom-variation-section">';
    echo '<h4 style="margin:15px 0 5px;">📷 Photo Upload Limits</h4>';

    // Min field
    woocommerce_wp_text_input(array(
      'id'    => '_photo_min[' . $loop . ']',
      'label' => __('Min Photos', 'woocommerce'),
      'type'  => 'number',
      'wrapper_class' => 'form-row form-row-first',
      'value' => get_post_meta($variation->ID, '_photo_min', true),
      'custom_attributes' => array(
        'min'  => '0',
        'step' => '1',
      ),
    ));

    // Max field
    woocommerce_wp_text_input(array(
      'id'    => '_photo_max[' . $loop . ']',
      'label' => __('Max Photos', 'woocommerce'),
      'type'  => 'number',
      'wrapper_class' => 'form-row form-row-last',
      'value' => get_post_meta($variation->ID, '_photo_max', true),
      'custom_attributes' => array(
        'min'  => '0',
        'step' => '1',
      ),
    ));

    echo '</div>';
  }

  function save_custom_photo_limits_fields($variation_id, $i)
  {
    if (isset($_POST['_photo_min'][$i])) {
      update_post_meta($variation_id, '_photo_min', absint($_POST['_photo_min'][$i]));
    }

    if (isset($_POST['_photo_max'][$i])) {
      update_post_meta($variation_id, '_photo_max', absint($_POST['_photo_max'][$i]));
    }
  }

  function wc_photobook()
  {
    $product_id = absint($_POST['product_id']);
    $quantity = absint($_POST['quantity']);
    $photobook_note = $_POST['note'];

    $variation_id = absint($_POST['variation_id']);
    $variation = [];

    foreach ($_POST as $key => $value) {
      if (strpos($key, 'attribute_') === 0) {
        $variation[$key] = sanitize_text_field($value);
      }
    }

    // I want to handle save files to google drive here
    $session_cart_id = WC()->session->get('custom_cart_id');
    if (! $session_cart_id) {
      $session_cart_id = wp_generate_uuid4();
      WC()->session->set('custom_cart_id', $session_cart_id);
    }

    // Add item to cart
    $cart_item_key = WC()->cart->add_to_cart($product_id, $quantity, $variation_id, $variation);
    // Create folder
    $drive_folder = Zippy_Photobook_Controller::create_folder_with_path(sanitize_text_field($session_cart_id . '/' . $cart_item_key));
    if (!$drive_folder) {
      return wp_send_json_error(['message' => 'Upload to drive failed!']);
    }
    if ($cart_item_key) {
      self::add_custom_photobook_metadata($cart_item_key, $drive_folder, $photobook_note);
      $message = wc_add_to_cart_message($product_id, true);
      wc_add_notice($message, 'success');

      $response = [
        'message' => 'Added to cart',
        'folder' => $drive_folder,
        'cart_item_key' => $cart_item_key,
        'product_url' => get_permalink($product_id),
      ];

      wp_send_json_success($response);
    } else {
      wc_add_notice('Failed to add product to cart. Please try again later!', 'error');
      wp_send_json_error(['message' => 'Failed to add product to cart']);
    }

    wp_die();
  }

  function add_unique_cart_item_key($cart_item_data, $product_id, $variation_id)
  {
    if (!empty($_POST['force_new_item']) && $_POST['force_new_item'] === 'yes') {
      $cart_item_data['unique_key'] = md5(microtime() . rand());
    }
    return $cart_item_data;
  }

  public static function add_custom_photobook_metadata($cart_item_key, $data, $note)
  {
    $cart = WC()->cart->get_cart();
    $cart[$cart_item_key]['folder_id'] = $data['folder_id'];
    $cart[$cart_item_key]['folder_link'] = $data['folder_link'];
    $cart[$cart_item_key]['note'] = $note;
    WC()->cart->set_cart_contents($cart);
    WC()->cart->calculate_totals();
  }
}
