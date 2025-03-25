<?php

/**
 * API ResponHandler
 *
 * @package Shin
 */

namespace Zippy_Booking\Src\Controllers\Web\Supports;

use WP_REST_Request;
use WP_Query;

use Zippy_Booking\Src\App\Zippy_Response_Handler;

defined('ABSPATH') or die();

class Zippy_Booking_Support_Controller
{

    public static function handle_support_booking_product(WP_REST_Request $request)
    {
        global $wpdb;


        $items_id = $request->get_param('items_id');
        $mapping_type = $request["request"]['mapping_type'];
        if (empty($items_id)) {
            return Zippy_Response_Handler::error('Items ID is required.');
        }

        $table_name = $wpdb->prefix . 'products_booking';

        $exists = $wpdb->get_var($wpdb->prepare(
            "SELECT COUNT(*) FROM {$table_name} WHERE items_id = %d AND mapping_status = %s",
            $items_id,
            'include'
        ));

        if ($exists > 0) {
            return Zippy_Response_Handler::error('Items ID already exists.');
        }

        $product = wc_get_product($items_id);

        if (!$product) {
            return Zippy_Response_Handler::error('Product not found.');
        }

        $product_name = $product->get_name();
        $product_price = $product->get_price();

        $result = $wpdb->insert(
            $table_name,
            array(
                'items_id' => $items_id,
                'mapping_type' => $mapping_type,
                'mapping_status' => 'include',
            ),
            array(
                '%d',
                '%s',
                '%s',
            )
        );

        if ($result === false) {
            return Zippy_Response_Handler::error('Error inserting data into the database.');
        }

        // $meta_key = 'product_booking_mapping';
        // $meta_value = array(
        //     'items_id' => $items_id,
        //     'mapping_type' => $mapping_type,
        //     'product_name' => $product_name,
        //     'product_price' => $product_price
        // );

        // $update_meta = update_post_meta($items_id, $meta_key, $meta_value);

        // if (!$update_meta) {
        //     return Zippy_Response_Handler::error('Failed to add meta to the product.');
        // }

        $added_item = array(
            'items_id' => $items_id,
            'mapping_type' => $mapping_type,
            'product_name' => $product_name,
            'product_price' => $product_price,
            // 'meta_key' => $meta_key,
        );

        return Zippy_Response_Handler::success($added_item, 'Product booking mapping created successfully.');
    }
}
