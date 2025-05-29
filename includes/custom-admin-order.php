<?php

use Zippy_Addons\Utils\Zippy_DB_Helper;

add_action('woocommerce_admin_order_item_headers', function () {
    echo '<th class="paper-type">Customer Photo</th>';
}, 100);


add_action('woocommerce_admin_order_item_values', function ($product, $item, $item_id) {
    $photo_detail = Zippy_DB_Helper::get_photo_data($item->get_order_id(), $item->get_product_id());
    echo '<td class="paper-type">';

    if ($photo_detail) {
        echo '<div class="custom-img-col"><a target="_blank" href="' . esc_url($photo_detail->photo_url) . '"><img class="ordered-img" src="' . esc_url($photo_detail->photo_url) . '" alt="ordered-img"/></a></div>';
    } else {
        echo '-';
    }
}, 100, 3);
