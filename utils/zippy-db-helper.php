<?php

namespace Zippy_Addons\Utils;

defined( 'ABSPATH' ) || exit;

class Zippy_DB_Helper {
    public static function get_photo_data( $order_id, $product_id ) {
        global $wpdb;

        $table_name = $wpdb->prefix . 'photo_details';

        $query = $wpdb->prepare(
            "SELECT * FROM {$table_name} WHERE order_id = %d AND product_id = %d LIMIT 1",
            $order_id,
            $product_id
        );

        return $wpdb->get_row( $query );
    }
}