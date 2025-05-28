<?php
// Add a new tab
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

function zippy_check_minimum_order_amount() {
    // Get the custom minimum order value from settings
    $min_order = get_option('custom_order_min_value', 0);

    // Get the current cart total
    $cart_total = WC()->cart->get_total('edit'); // float value without formatting

    // Compare and show error if below minimum
    if ($cart_total < floatval($min_order)) {
        wc_add_notice(sprintf(
            __('The minimum order amount is %s. Your current total is %s.', 'your-textdomain'),
            wc_price($min_order),
            wc_price($cart_total)
        ), 'error');
    }
}

add_action('woocommerce_before_cart_totals', 'zippy_show_minimum_order_notice_cart');
function zippy_show_minimum_order_notice_cart() {
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