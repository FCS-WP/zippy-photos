<?php

namespace Zippy_Addons\Src\Controllers\Web;

use WP_REST_Request;
use WP_REST_Response;
use WP_Query;

defined('ABSPATH') or die();

class Zippy_Photo_Controller
{
    public static function save_photos(WP_REST_Request $request)
    {
        global $wpdb;
        $table_name = $wpdb->prefix . 'photo_details';

        if (empty($_FILES['files'])) {
            return new WP_REST_Response(['error' => 'No files uploaded.'], 400);
        }

        require_once ABSPATH . 'wp-admin/includes/image.php';
        require_once ABSPATH . 'wp-admin/includes/file.php';
        require_once ABSPATH . 'wp-admin/includes/media.php';

        $uploaded_files = self::restructure_nested_files_array($_FILES['files']);

        $results = [];

        $created_order = self::create_photo_order($_POST['files']);
        $payment_url = $created_order->get_checkout_payment_url();
        foreach ($uploaded_files as $index => $file) {
            $upload_overrides = ['test_form' => false];
            $movefile = wp_handle_upload($file, $upload_overrides);

            if ($movefile && !isset($movefile['error'])) {
                $wp_filetype = wp_check_filetype($movefile['file'], null);
                $attachment = [
                    'post_mime_type' => $wp_filetype['type'],
                    'post_title'     => sanitize_file_name($file['name']),
                    'post_content'   => '',
                    'post_status'    => 'inherit',
                ];

                $order_id = $created_order->get_id();
                $detail_id = intval($_POST['files'][$index]['detail_id'] ?? 0);
                $quantity = intval($_POST['files'][$index]['quantity'] ?? 1);
                $temp_id = intval($_POST['files'][$index]['temp_id'] ?? 0);
                $user_id = intval($_POST['files'][$index]['user_id'] ?? 0);
                $product_id = intval($_POST['files'][$index]['product_id']);
                $paper_type = sanitize_text_field($_POST['files'][$index]['paper'] ?? 'Matte');
                $attach_id = null;
                $attach_id = wp_insert_attachment($attachment, $movefile['file']);
                $attach_data = wp_generate_attachment_metadata($attach_id, $movefile['file']);
                wp_update_attachment_metadata($attach_id, $attach_data);

                if (empty($detail_id) || $detail_id == 0) {
                    try {
                        $result = $wpdb->insert($table_name, [
                            'user_id'     => $user_id,
                            'order_id'    => $order_id,
                            'photo_url'   => esc_url_raw(wp_get_attachment_url($attach_id)),
                            'product_id'  => $product_id,
                            'paper_type'  => $paper_type,
                            'quantity'    => $quantity,
                            'status'      => 'pending',
                            'created_at'  => current_time('mysql'),
                        ]);
                        if ($result) {
                            $detail_id = $wpdb->insert_id;
                        }
                    } catch (\Throwable $th) {
                        throw $th;
                    }
                } else {
                    /* Remove old image */
                    if (wp_attachment_is_image($photo_id)) {
                        wp_delete_attachment($photo_id, true);
                    }

                    /* Update photo details */
                    $wpdb->update(
                        $table_name,
                        [
                            'order_id'    => $order_id,
                            'product_id'  => $product_id,
                            'paper_type'  => $paper_type,
                            'quantity'    => $quantity,
                            'status'      => 'pending',
                            'updated_at'  => current_time('mysql'),
                        ],
                        [
                            'id' => $detail_id,
                        ],
                        [
                            '%d',
                            '%d',
                            '%s',
                            '%d',
                            '%s',
                            '%s'
                        ],
                        [
                            '%d',
                        ]
                    );
                }

                $results[] = [
                    'user_id'       => $user_id,
                    'order_id'      => $created_order->get_id(),
                    'product_id'    => $product_id,
                    'photo_url'     => wp_get_attachment_url($attach_id),
                    'paper'         => $paper_type,
                    'quantity'      => $quantity,
                    'temp_id'       => $temp_id,
                ];
            } else {
                $results[] = ['error' => $movefile['error'] ?? 'Unknown error'];
            }
        }

        return new WP_REST_Response(['data' => $results, 'payment_url' => $payment_url, 'status' => 'success', 'message' => 'Save data successfully'], 200);
    }

    public static function restructure_nested_files_array($files)
    {
        $result = [];

        foreach ($files['name'] as $index => $nameArray) {
            foreach ($nameArray as $field => $name) {
                $result[$index] = [
                    'name'     => $files['name'][$index][$field],
                    'type'     => $files['type'][$index][$field],
                    'tmp_name' => $files['tmp_name'][$index][$field],
                    'error'    => $files['error'][$index][$field],
                    'size'     => $files['size'][$index][$field],
                ];
            }
        }

        return $result;
    }

    public static function get_photo_sizes(WP_REST_Request $request)
    {
        try {
            $args = [
                'post_type' => 'product',
                'posts_per_page' => -1,
                'post_status' => 'publish',
                'tax_query' => [
                    [
                        'taxonomy' => 'product_cat',
                        'field'    => 'slug',
                        'terms'    => 'photo-sizes',
                    ],
                ],
            ];

            $query = new WP_Query($args);
            $products = [];

            if ($query->have_posts()) {
                while ($query->have_posts()) {
                    $query->the_post();
                    $product = wc_get_product(get_the_ID());
                    $width_in = get_field('width_in', $product->get_id()) ?? "";
                    $heigth_in = get_field('height_in', $product->get_id()) ?? "";
                    if (!empty($width_in) && !empty($heigth_in)) {
                        $products[] = [
                            'id'       => $product->get_id(),
                            'name'     => $product->get_name(),
                            'price'    => number_format($product->get_price(), 2) . " " . get_woocommerce_currency(),
                            'width_in'   => (float)$width_in,
                            'height_in'  => (float)$heigth_in,
                        ];
                    }
                }
                wp_reset_postdata();
            }
            return new WP_REST_Response(["sizes" => $products, "status" => "success", "message" => "successfully"], 200);
        } catch (Exception $e) {
            return new WP_Error('product_fetch_error', $e->getMessage(), ['status' => 500]);
        }
    }

    public static function create_photo_order($data = [])
    {
        if (! class_exists('WC_Order')) {
            return new WP_Error('woocommerce_missing', 'WooCommerce not available');
        }

        $order = wc_create_order();

        foreach ($data as $item) {
            $product_id = intval($item['product_id']);
            $quantity   = intval($item['quantity']);

            $product = wc_get_product($product_id);
            if ($product && $quantity > 0) {
                $order->add_product($product, $quantity);
            }
            $order->set_customer_id(intval($item['user_id']));
            $order->calculate_totals();
            $order->update_meta_data('_order_type', 'photo');
            $order->save();
        }

        $order->calculate_totals();
        $order->save();
        return $order;
    }
}
