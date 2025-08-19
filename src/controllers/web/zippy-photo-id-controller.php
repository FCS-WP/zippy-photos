<?php

namespace Zippy_Addons\Src\Controllers\Web;

use Exception;
use WP_REST_Request;
use WP_REST_Response;
use WP_Error;
use WP_Query;
use Google\Client;
use WC_Order_Item_Product;

defined('ABSPATH') or die();

class Zippy_Photo_Id_Controller
{

    public static function get_photo_id_products(WP_REST_Request $request)
    {
        try {
            $args = array(
                'status'   => 'publish',
                'limit'    => -1,
                'category' => ['passport'],
            );

            $products = wc_get_products($args);

            $data = array();

            foreach ($products as $product) {
                $product_data = array(
                    'id'    => $product->get_id(),
                    'name'  => $product->get_name(),
                    'price' => $product->get_price(),
                    'link'  => get_permalink($product->get_id()),
                    'image' => wp_get_attachment_url($product->get_image_id()),
                    'type'  => $product->get_type(),
                );

                if ($product->is_type('variable')) {
                    $variations = array();
                    foreach ($product->get_children() as $child_id) {
                        $variation = wc_get_product($child_id);
                        if ($variation) {
                            $variations[] = array(
                                'id'       => $variation->get_id(),
                                'sku'      => $variation->get_sku(),
                                'price'    => $variation->get_price(),
                                'regular'  => $variation->get_regular_price(),
                                'sale'     => $variation->get_sale_price(),
                                'stock'    => $variation->get_stock_quantity(),
                                'attrs'    => $variation->get_attributes(), // size, color, etc
                                'image'    => wp_get_attachment_url($variation->get_image_id()),
                            );
                        }
                    }
                    $product_data['variations'] = $variations;
                }

                $data[] = $product_data;
            }

            return new WP_REST_Response(["result" => $data, "status" => "success", "message" => "Get Data Successfully"], 200);
        } catch (\Exception $e) {
            return new WP_Error('product_fetch_error', $e->getMessage(), ['status' => 500]);
        }
    }
}
