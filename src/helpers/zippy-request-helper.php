<?php

namespace Zippy_Addons\Src\Helpers;

use Exception;
use WP_Error;

use Zippy_Addons\Src\Controllers\Web\Google_Drive_Controller;

class Zippy_Request_Helper
{
    /**
     * 
     * Validate usage:
     * 
     *  $rules = [
     *     'keyword' => 'string',
     *      'limit'   => 'int',
     *   ];
     * 
     *      if (is_wp_error($validation)) {
     *     return $validation;
     * }
     * return rest_ensure_response([
     *     'success' => true,
     *     'results' => $products,
     * ]);
     */

    // $validation = Shipping_Helper::validate_request_data($params, $rules);

    public static function validate_request($params, $rules = [])
    {
        $errors = [];

        foreach ($rules as $field => $options) {
            // Support simple string rule like 'string' or detailed rule like ['type' => 'string', 'required' => true]
            if (is_string($options)) {
                $type = $options;
                $required = true;
            } else {
                $type = $options['type'] ?? null;
                $required = $options['required'] ?? true;
            }

            $value = $params[$field] ?? null;
            $isEmpty = is_null($value) || (is_string($value) && trim($value) === '');

            // Skip validation if not required and not provided
            if (!$required && $isEmpty) {
                continue;
            }

            // If required and missing/empty
            if ($required && $isEmpty) {
                $errors[] = "Missing or empty parameter: {$field}";
                continue;
            }

            switch ($type) {
                case 'string':
                    if (!is_string($value)) {
                        $errors[] = "{$field} must be a string.";
                    }
                    break;

                case 'int':
                case 'integer':
                    if (!filter_var($value, FILTER_VALIDATE_INT)) {
                        $errors[] = "{$field} must be an integer.";
                    }
                    break;

                case 'float':
                case 'decimal':
                    if (!filter_var($value, FILTER_VALIDATE_FLOAT)) {
                        $errors[] = "{$field} must be a float.";
                    }
                    break;

                case 'bool':
                case 'boolean':
                    if (!is_bool($value) && !in_array($value, ['true', 'false', '1', '0', 1, 0], true)) {
                        $errors[] = "{$field} must be a boolean.";
                    }
                    break;

                case 'email':
                    if (!filter_var($value, FILTER_VALIDATE_EMAIL)) {
                        $errors[] = "{$field} must be a valid email.";
                    }
                    break;

                case 'array':
                    if (!is_array($value)) {
                        $errors[] = "{$field} must be an array.";
                    }
                    break;

                default:
                    $errors[] = "Unknown validation rule for field: {$field}";
            }
        }

        return empty($errors) ? true : new WP_Error('invalid_request', implode('; ', $errors), ['status' => 400]);
    }

    public static function add_to_cart_photos($data = [])
    {
        if (!WC()->cart) {
            wc_load_cart();
        }

        try {
            foreach ($data as $item) {
                $product_id = intval($item['product_id']);
                $quantity   = intval($item['quantity']);

                $cart_item_data = [
                    'photo_url' => esc_url_raw($item['photo_url']),
                    'paper_type' => $item['paper_type'],
                    'user_id' => intval($item['user_id']),
                    'unique_key' => md5(uniqid(rand(), true)),
                ];

                WC()->cart->add_to_cart($product_id, $quantity, 0, [], $cart_item_data);
            }
            return true;
        } catch (Exception $e) {
            return new WP_Error($e, 400);
        }
    }

    public static function add_to_cart_photo_id($product_id, $variation_id, $quantity, $photo_id_url, $country = null)
    {
        if (!WC()->cart) {
            wc_load_cart();
        }

        try {
            $cart_item_data = [
                'photo_id_url' => esc_url_raw($photo_id_url),
                'unique_key' => md5(uniqid(rand(), true)),
            ];
            if ($country) {
                $cart_item_data['country'] = $country;
            }

            $variation = wc_get_product($variation_id);
            $attributes = $variation->get_attributes();

            if (!WC()->cart) {
                wc_load_cart();
            }

            WC()->cart->add_to_cart($product_id, $quantity, $variation_id,  $attributes, $cart_item_data);
            return true;
        } catch (Exception $e) {
            return new WP_Error($e, 400);
        }
    }

    public static function get_full_product_variation_name($product_id, $variation_id)
    {
        $product = wc_get_product($product_id);
        $variation = wc_get_product($variation_id);

        if (!$product || !$variation || !$variation->is_type('variation')) {
            return '';
        }

        $product_name = $product->get_name();
        $attributes = $variation->get_attributes();
        $variation_parts = [];

        foreach ($attributes as $taxonomy => $term_slug) {
            if (taxonomy_exists($taxonomy)) {
                $term = get_term_by('slug', $term_slug, $taxonomy);
                $label = wc_attribute_label($taxonomy);
                $value = $term ? $term->name : $term_slug;
                $variation_parts[] = "{$label}: {$value}";
            } else {
                // Custom attribute (e.g., text input)
                $label = wc_attribute_label($taxonomy);
                $variation_parts[] = "{$label}: {$term_slug}";
            }
        }

        $variation_string = implode(', ', $variation_parts);
        return $product_name . ' - ' . $variation_string;
    }

    public static function get_wc_order_key($key)
    {
        if (strpos($key, 'wc_order_') === 0) {
            return substr($key, strlen('wc_order_'));
        }
        return null;
    }
}
