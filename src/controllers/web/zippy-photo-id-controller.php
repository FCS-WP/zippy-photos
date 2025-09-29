<?php

namespace Zippy_Addons\Src\Controllers\Web;

use Exception;
use WP_REST_Request;
use WP_REST_Response;
use WP_Error;
use WP_Query;
use Google\Client;
use WC_Order_Item_Product;
use Zippy_Addons\Src\Helpers\Zippy_Request_Helper;

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
                    'price' => $product->get_regular_price(),
                    'sale' => $product->get_sale_price(),
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

    public static function get_product_data_v1(WP_REST_Request $request)
    {
        try {
            $rules = [
                'product_id' =>  ['type' => 'int', 'required' => true],
                'variation_id' =>  ['type' => 'int', 'required' => true],
            ];

            $validation = Zippy_Request_Helper::validate_request($request->get_params(), $rules);

            if (is_wp_error($validation)) {
                return $validation;
            }

            $product_id = $request->get_param('product_id');
            $variation_id = $request->get_param('variation_id');
            $product = wc_get_product($product_id);

            if (!$product) {
                return new WP_Error('no_product', 'Product not found', array('status' => 404));
            }

            $data = [
                'id'           => $product->get_id(),
                'name'         => $product->get_name(),
                'slug'         => $product->get_slug(),
                'link'         => $product->get_permalink(),
                'description'  => $product->get_description(),
                'variation_data'   => [],
            ];

            $variation_product = wc_get_product($variation_id);
            $attrs = $variation_product->get_attributes();

            if ($product->is_type('variable')) {
                $variation_type = strtolower($attrs['document-type']) === 'visa' ? 'visa' : 'passport';
                $photo_id_data = get_field($variation_type, $product_id);

                $width_field = $variation_type . '_photo_width';
                $height_field = $variation_type . '_photo_height';
                $template_field = $variation_type . '_template';

                $variation_data = [
                    'id' => intval($variation_id),
                    'width' => floatval($photo_id_data[$width_field]) ?? 0,
                    'height' => floatval($photo_id_data[$height_field]) ?? 0,
                    'template' => $photo_id_data[$template_field]['url'] ?? null,
                ];
                $data['variation_data'] = $variation_data;
            }

            return new WP_REST_Response(["result" => $data, "status" => "success", "message" => "Get Data Successfully"], 200);
        } catch (\Exception $e) {
            return new WP_Error('product_fetch_error', $e->getMessage(), ['status' => 500]);
        }
    }

    public static function get_product_data_v2(WP_REST_Request $request)
    {
        try {
            $rules = [
                'product_id' =>  ['type' => 'int', 'required' => true],
            ];

            $validation = Zippy_Request_Helper::validate_request($request->get_params(), $rules);

            if (is_wp_error($validation)) {
                return $validation;
            }

            $product_id = $request->get_param('product_id');
            $product = wc_get_product($product_id);

            if (!$product) {
                return new WP_Error('no_product', 'Product not found', array('status' => 404));
            }

            $template = get_field('template_default', $product_id) ?? '';
            $width_default = get_field('width_default', $product_id) ?? 40;
            $height_default = get_field('height_default', $product_id) ?? 60;
            $template_url = $template ? $template['url'] : '';

            $product_data = array(
                'id'    => $product->get_id(),
                'name'  => $product->get_name(),
                'price' => $product->get_regular_price(),
                'sale' => $product->get_sale_price(),
                'slug'         => $product->get_slug(),
                'link'  => get_permalink($product->get_id()),
                'image' => wp_get_attachment_url($product->get_image_id()),
                'type'  => $product->get_type(),
                'description'  => $product->get_description(),
                'variations'   => [],
                'template' => ["url" => $template_url, "width" => intval($width_default), "height" => intval($height_default)],
            );

            if ($product->is_type('variable')) {
                $variations = array();
                $default_attributes = $product->get_default_attributes(); 
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
                            'attrs'    => $variation->get_attributes(),
                            'description'  => $variation->get_description(),
                            'image'    => wp_get_attachment_url($variation->get_image_id()),
                        );
                    }
                }
                $product_data['variations'] = $variations;
                $product_data['default_attributes'] = $default_attributes;
            }

            return new WP_REST_Response(["result" => $product_data, "status" => "success", "message" => "Get Data Successfully"], 200);
        } catch (\Exception $e) {
            return new WP_Error('product_fetch_error', $e->getMessage(), ['status' => 500]);
        }
    }

    public static function handle_photo_id(WP_REST_Request $request)
    {
        $rules = [
            'product' =>  ['type' => 'array', 'required' => true],
            'user_id' =>  ['type' => 'string', 'required' => true],
        ];

        $validation = Zippy_Request_Helper::validate_request($request->get_params(), $rules);

        if (is_wp_error($validation)) {
            return $validation;
        }

        try {
            $user_id = $request->get_param('user_id');
            $product_data = $request->get_param('product');
            $file = $_FILES['file'];
            if (!$file) {
                return new WP_Error('add_to_cart_error', 'Invalid File', ['status' => 500]);
            }
            $drive_folder = Zippy_Photobook_Controller::create_folder_with_path(sanitize_text_field('PhotoID/user_id_' . $user_id), false);

            if (!$drive_folder) {
                return wp_send_json_error(['message' => 'Upload to drive failed!']);
            }

            // $add_custom_item_metadata =
            $service = Zippy_Photobook_Controller::get_storage_drive_service();
            $upload_file = Zippy_Photobook_Controller::upload_single_file_to_drive($service, $file['name'], $file['tmp_name'], $drive_folder['folder_id']);
            // Link : upload_file['web_link']
            if (!$upload_file) {
                return new WP_Error('save_file_error', 'Can not save file to drive', ['status' => 500]);
            }
            $result = [
                "photo_id_url" => $upload_file['web_link'],
            ];

            return new WP_REST_Response(["result" => $result, "status" => "success", "message" => "Add to Cart Successfully"], 200);
        } catch (\Exception $e) {
            return new WP_Error('product_fetch_error', $e->getMessage(), ['status' => 500]);
        }
    }

    public static function add_variation_to_cart($product_data, $photo_url)
    {
        $custom_meta = array(
            'photo_url' => $photo_url,
        );
        $variation = wc_get_product($product_data['variation']);
        $attributes = $variation->get_attributes();

        if (!WC()->cart) {
            wc_load_cart();
        }

        $added = WC()->cart->add_to_cart(
            $product_data['id'],
            $product_data['qty'],
            $product_data['variation'],
            $attributes,
            $custom_meta
        );

        if ($added) {
            wc_add_notice('Variation added to cart successfully!');
            return $added;
        } else {
            wc_add_notice('Failed to add variation to cart', 'error');
            return false;
        }
    }
}
