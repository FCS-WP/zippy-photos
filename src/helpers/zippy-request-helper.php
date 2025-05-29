<?php

namespace Zippy_Addons\Src\Helpers;

use Exception;
use WP_Error;

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
}
