<?php

add_filter('woocommerce_checkout_fields', 'zippy_remove_billing_fields');
function zippy_remove_billing_fields($fields) {
    // Unset fields you want to remove
    unset($fields['billing']['billing_company']);
    unset($fields['billing']['billing_address_2']);
    unset($fields['billing']['billing_address_1']);
    unset($fields['billing']['billing_city']);
    unset($fields['billing']['billing_postcode']);
    return $fields;
}

add_filter('woocommerce_checkout_fields', 'zippy_add_store_selector_field');

function zippy_add_store_selector_field($fields) {
    $fields['billing']['billing_store_selector'] = [
        'type'        => 'select',
        'label'       => __('Collection Point', 'your-textdomain'),
        'required'    => true,
        'class'       => ['form-row-wide'],
        'input_class' => ['w-100'],
        'priority'    => 120,
        'options'     => [
            ''            => __('Choose a store', 'your-textdomain'),
            'store_a'     => __('Store A - Main Street', 'your-textdomain'),
            'store_b'     => __('Store B - River Mall', 'your-textdomain'),
            'store_c'     => __('Store C - Hilltop Center', 'your-textdomain'),
        ],
    ];

    return $fields;
}

// Save order meta
add_action('woocommerce_checkout_update_order_meta', 'zippy_save_store_selector_field');
function zippy_save_store_selector_field($order_id) {
    if (!empty($_POST['billing_store_selector'])) {
        update_post_meta($order_id, '_billing_store_selector', sanitize_text_field($_POST['billing_store_selector']));
    }
}

// Show Store Info
add_action('woocommerce_admin_order_data_after_billing_address', 'zippy_show_store_selector_in_admin', 10, 1);
function zippy_show_store_selector_in_admin($order) {
    $store = get_post_meta($order->get_id(), '_billing_store_selector', true);
    if ($store) {
        echo '<p><strong>' . __('Selected Store') . ':</strong> ' . esc_html($store) . '</p>';
    }
}