<?php
// Add a new tab

use Zippy_Addons\Src\Helpers\Zippy_Request_Helper;

add_filter('woocommerce_settings_tabs_array', 'zippy_add_custom_config', 50);
function zippy_add_custom_config($tabs)
{
    $tabs['custom_order'] = __('Custom Shipping Fees', '');
    return $tabs;
}

// Display the settings
add_action('woocommerce_settings_tabs_custom_order', 'zippy_custom_order_settings_tab_content');
function zippy_custom_order_settings_tab_content()
{
    woocommerce_admin_fields(zippy_get_custom_order_settings());
}

// Save the settings
add_action('woocommerce_update_options_custom_order', 'zippy_save_custom_order_settings');
function zippy_save_custom_order_settings()
{
    woocommerce_update_options(zippy_get_custom_order_settings());
}

// Define settings fields
function zippy_get_custom_order_settings()
{
    return [
        [
            'name'     => __('Custom Order ', 'your-textdomain'),
            'type'     => 'title',
            'desc'     => '',
            'id'       => 'custom_order_settings_title'
        ],
        [
            'name'     => __('Minimum order Value', 'your-textdomain'),
            'id'       => 'custom_order_min_value',
            'type'     => 'number',
            'custom_attributes' => [
                'step' => '0.01',
                'min' => '0'
            ],
            'desc_tip' => true,
            'description' => __('Min cost to free shipping', ''),
        ],
        [
            'type' => 'sectionend',
            'id'   => 'custom_order_settings_end'
        ]
    ];
}
// Usage: get_option('custom_order_min_value', '');

// Validate minimum order amount during checkout
add_action('woocommerce_checkout_process', 'zippy_check_minimum_order_amount');

function zippy_check_minimum_order_amount()
{
    // Get the custom minimum order value from settings
    $min_order = get_option('custom_order_min_value', 0);

    // Get the subtotal (excluding shipping, taxes, etc.)
    $cart_subtotal = WC()->cart->get_subtotal();

    // Compare and show error if below minimum
    if ($cart_subtotal < floatval($min_order)) {
        wc_add_notice(sprintf(
            __('The minimum order amount is %s. Your current subtotal is %s.', 'your-textdomain'),
            wc_price($min_order),
            wc_price($cart_subtotal)
        ), 'error');
    }
}

add_action('woocommerce_before_cart_totals', 'zippy_show_minimum_order_notice_cart');
function zippy_show_minimum_order_notice_cart()
{
    $min_order = get_option('custom_order_min_value', 0);
    $cart_total = WC()->cart->get_total('edit');

    if ($min_order > 0 && $cart_total < floatval($min_order)) {
        wc_print_notice(sprintf(
            __('You need to spend at least %s to proceed to checkout. You currently have %s in your cart.', 'your-textdomain'),
            wc_price($min_order),
            wc_price($cart_total)
        ), 'notice');
    }
}
// Hide photo-sizes category
add_action('pre_get_posts', 'hide_photo_sizes_in_shop_page');

function hide_photo_sizes_in_shop_page($query)
{
    if (is_admin() || !$query->is_main_query()) {
        return;
    }

    // Only on the main WooCommerce Shop page
    if (is_shop()) {
        $tax_query = $query->get('tax_query') ?: [];

        $tax_query[] = [
            'taxonomy' => 'product_cat',
            'field'    => 'slug',
            'terms'    => ['photo-sizes'],
            'operator' => 'NOT IN',
        ];

        $query->set('tax_query', $tax_query);
    }
}

add_action('wp_ajax_custom_add_to_cart', 'custom_add_to_cart_handler');
add_action('wp_ajax_nopriv_custom_add_to_cart', 'custom_add_to_cart_handler');

function custom_add_to_cart_handler()
{
    if (!isset($_POST['items'])) {
        wp_send_json_error('Missing items');
    }

    $action_add_to_cart = Zippy_Request_Helper::add_to_cart_photos($_POST['items']);

    if (is_wp_error($action_add_to_cart)) {
        wp_send_json_error($action_add_to_cart);
    } else {
        wp_send_json_success('Product added');
    }
}

add_action('woocommerce_checkout_create_order_line_item', 'store_photo_url_to_line_item_meta', 10, 4);

function store_photo_url_to_line_item_meta($item, $cart_item_key, $values, $order)
{
    if (!empty($values['photo_url'])) {
        $item->add_meta_data('photo_url', $values['photo_url']);
    }

    if (!empty($values['paper_type'])) {
        $item->add_meta_data('paper_type', $values['paper_type']);
    }
}

// Create Order with Photos Products
add_action('woocommerce_checkout_order_created', 'save_photo_details_to_custom_table', 20, 1);

function save_photo_details_to_custom_table($order)
{
    global $wpdb;
    $order_id = $order->get_id();
    $user_id = $order->get_user_id();
    $photo_flag = false;
    foreach ($order->get_items() as $item) {
        $photo_url  = $item->get_meta('photo_url');
        $paper_type = $item->get_meta('paper_type');
        $product_id = $item->get_product_id();
        $quantity   = $item->get_quantity();

        if ($photo_url) {
            $photo_flag = true;
            $wpdb->insert(
                $wpdb->prefix . 'photo_details',
                [
                    'order_id'    => $order_id,
                    'item_id'    => $item->get_id(),
                    'product_id'  => $product_id,
                    'user_id'     => $user_id,
                    'quantity'    => $quantity,
                    'paper_type'  => $paper_type,
                    'photo_url'   => esc_url_raw($photo_url),
                    'created_at'  => current_time('mysql', 1),
                ],
                ['%d', '%d', '%d', '%d', '%s', '%s', '%s']
            );
        }
    }
    if ($photo_flag) {
        $order->update_meta_data('_order_type', 'photo');
        $order->save();
    }
}

add_filter('woocommerce_cart_item_thumbnail', 'custom_cart_product_image', 10, 3);

function custom_cart_product_image($thumbnail, $cart_item, $cart_item_key) {
    // Get custom image from cart item meta if available
    if (!empty($cart_item['photo_url'])) {
        $image_url = esc_url($cart_item['photo_url']);
        return '<img src="' . $image_url . '" alt="Custom Photo">';
    }

    return $thumbnail;
}

add_filter('woocommerce_cart_item_name', 'custom_cart_item_name_photo_label', 10, 3);

function custom_cart_item_name_photo_label($product_name, $cart_item, $cart_item_key) {
    if (!empty($cart_item['photo_url'])) {
        return '📸 Photo Print';
    }
    return $product_name;
}

add_action('woocommerce_checkout_create_order_line_item', function($item, $cart_item_key, $values, $order){
    if (!empty($values['folder_id'])) {
        $item->add_meta_data('Photobook Folder ID', $values['folder_id'], true);
    }
    if (!empty($values['folder_link'])) {
        $item->add_meta_data('Photobook Folder Link', $values['folder_link'], true);
    }
    if (!empty($values['note'])) {
        $item->add_meta_data('Photobook Note', $values['note'], true);
    }
}, 10, 4);
