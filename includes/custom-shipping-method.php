<?php

use Zippy_Addons\Src\Helpers\Zippy_Menu_Products_Helper;

add_filter('woocommerce_checkout_fields', 'zippy_conditionally_hide_billing_fields');
function zippy_conditionally_hide_billing_fields($fields)
{
    $fields_to_hide = [
        'billing_address_1',
        'billing_address_2',
        'billing_city',
        'billing_postcode',
        'billing_company',
    ];

    foreach ($fields_to_hide as $field_key) {
        if (isset($fields['billing'][$field_key])) {
            $fields['billing'][$field_key]['class'][] = 'zippy-hide-when-pickup';
        }
    }
    
    $fields['billing']['billing_address_1']['required'] = false;
    $fields['billing']['billing_postcode']['required'] = false;

    return $fields;
}


add_filter('woocommerce_package_rates', 'inspect_shipping_rates', 10, 2);

function inspect_shipping_rates($rates, $package)
{

    $shipping_zone = wc_get_shipping_zone($package);
    $zone_name = $shipping_zone ? $shipping_zone->get_zone_name() : '';

    // Initialize flags
    $has_bag = false;

    // Check for shipping classes in cart
    if (empty($package['contents'])) return $rates;
    foreach ($package['contents'] as $item) {
        $product = $item['data'];
        $shipping_class = $product->get_shipping_class();

        if ($shipping_class === 'bags') $has_bag = true;
    }

    foreach ($rates as $rate) {
        if ($rate->get_method_id() === 'local_pickup') {
            $rate->set_label('Self-collection (2 days)');
        }
        if ($rate->get_method_id() === 'flat_rate') {
            $rate->set_label('Delivery');
        }
    }


    return $rates;
}

add_action('woocommerce_after_shipping_rate', 'custom_local_pickup_select_outlet', 10, 2);

function custom_local_pickup_select_outlet($method, $index)
{
    if (!is_checkout()) {
        return;
    }

    $cart_items = WC()->cart->get_cart();
    $product_ids = [];

    foreach ($cart_items as $cart_item) {
        $product_ids[] = $cart_item['product_id'];
    }

    if ($method->method_id === 'local_pickup') {
        $available_outlets = Zippy_Menu_Products_Helper::get_outlets_with_all_products_with_info($product_ids);

        $selected = WC()->session->get('collection_point');
        echo '<div class="pickup-outlet-select-wrapper" style="display:none;">';
        echo '<label class="shipping-method-label" for="collection_point">Collection Point</label><br>';
        echo '<select class="outlet-select" name="collection_point" id="collection_point" required>';

        foreach ($available_outlets as $outlet) {
            $is_selected = selected($selected, ($outlet['name'] . " - " . $outlet['address']), false);
            echo "<option value='{$outlet['name']} - {$outlet['address']}' {$is_selected}>{$outlet['name']} - {$outlet['address']}</option>";
        }
        echo '</select>';
        echo '</div>';


?>
        <script type="text/javascript">
            jQuery(function($) {
                function togglePickupOutlet() {
                    var isLocalPickup = $('input[name^="shipping_method"]:checked').val().includes('local_pickup');
                    $('.pickup-outlet-select-wrapper').toggle(isLocalPickup);
                    $('.zippy-hide-when-pickup').each(function() {
                        var $fieldRow = $(this).closest('.form-row');

                        if (isLocalPickup) {
                            $fieldRow.hide();
                            $(this).prop('required', false).removeClass('validate-required');
                        } else {
                            $fieldRow.show();
                            $(this).prop('required', true).addClass('validate-required');
                        }
                    });
                }


                togglePickupOutlet();

                $(document).on('change', 'input[name^="shipping_method"]', function() {
                    togglePickupOutlet();
                });
            });
        </script>
<?php
    }
}
// Save 
add_action('woocommerce_checkout_update_order_review', 'save_pickup_outlet_to_session');

function save_pickup_outlet_to_session($post_data)
{
    parse_str($post_data, $data);

    if (isset($data['collection_point'])) {
        WC()->session->set('collection_point', sanitize_text_field($data['collection_point']));
    }
}
// Save info in order meta
add_action('woocommerce_checkout_create_order', 'save_pickup_outlet_to_order', 10, 2);

function save_pickup_outlet_to_order($order, $data)
{
    $is_local_pickup = false;

    foreach ($order->get_shipping_methods() as $shipping_item) {
        if (strpos($shipping_item->get_method_id(), 'local_pickup') !== false) {
            $is_local_pickup = true;
            break;
        }
    }

    if ($is_local_pickup) {
        $collection_point = WC()->session->get('collection_point');

        if ($collection_point) {
            $order->update_meta_data('_collection_point', $collection_point);
            WC()->session->__unset('collection_point');
        }
    }
}

add_action('woocommerce_admin_order_data_after_shipping_address', 'display_pickup_outlet_in_admin', 10, 1);

function display_pickup_outlet_in_admin($order)
{
    $outlet = $order->get_meta('_collection_point');
    if ($outlet) {
        echo '<p><strong>Collection Point:</strong> ' . esc_html($outlet) . '</p>';
    }
}

add_filter('woocommerce_email_order_meta_fields', 'add_pickup_outlet_to_email', 10, 3);

function add_pickup_outlet_to_email($fields, $sent_to_admin, $order)
{
    $outlet = $order->get_meta('_collection_point');
    if ($outlet) {
        $fields['collection_point'] = [
            'label' => 'Collection Point',
            'value' => $outlet,
        ];
    }
    return $fields;
}
