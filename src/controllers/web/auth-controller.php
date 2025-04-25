<?php

/**
 * Admin Booking Controller
 *
 *
 */

namespace Zippy_Addons\Src\Controllers\Web;

use WP_REST_Response;
use WP_REST_Request;

defined('ABSPATH') or die();


class Auth_Controller
{

    public static function signin(WP_REST_Request $request)
    {
        $username = $request->get_param('username');
        $password = $request->get_param('password');

        if (empty($username) || empty($password)) {
            return new WP_REST_Response(["status" => "error", "message" => "Missing username or password"], 200);
        }

        $creds = array(
            'user_login'    => $username,
            'user_password' => $password,
            'remember'      => true,
        );

        $user = wp_signon($creds, false);

        $status = true;

        if (is_wp_error($user)) {
            $status = false;

            $response = [
                'status' => $status,
                'data'   => $user->get_error_message()
            ];

            return new WP_REST_Response([$response, "status" => "error", "message" => "successfully"], 200);
        }

        $response = [
            'status' => $status,
            'data'   => [
                'ID'        => $user->ID,
                'email'     => $user->user_email,
            ]
        ];

        return new WP_REST_Response([$response, "status" => "success", "message" => "successfully"], 200);
    }

    public static function register(WP_REST_Request $request)
    {
        $user_email = $request->get_param('email');
        $user_password = $request->get_param('password');
        $confirm_password = $request->get_param('confirm_password');
        $first_name = sanitize_text_field($request['first_name']);
        $last_name  = sanitize_text_field($request['last_name']);

        if (empty($user_email) || empty($user_password)) {
            return new WP_REST_Response(["status" => "error", "message" => "Email or password cannot be blank"], 400);
        }

        if ($confirm_password !== $user_password) {
            return new WP_REST_Response(["status" => "error", "message" => "Confirm password does not match!"], 400);
        }

        if (!is_email($user_email)) {
            return new WP_REST_Response(["status" => "error", "message" => "Invalid email."], 400);
        }

        if (email_exists($user_email)) {
            return new WP_REST_Response(["status" => "error", "message" => "Email already exists"], 400);
        }

        try {
            $user_login = $user_email;

            $user_id = wp_create_user($user_login, $user_password, $user_email);

            if (is_wp_error($user_id)) {
                return new WP_REST_Response(["status" => "error", "message" => $user_id->get_error_message()], 400);
            }
            $update = wp_update_user([
                'ID'         => $user_id,
                'first_name' => $first_name,
                'last_name'  => $last_name,
            ]);
            $user = get_userdata($user_id);

            $response = [
                'status' => true,
                'data'   => [
                    'email' => $user->user_email,
                    'id'    => $user->ID,
                ],
            ];

            return new WP_REST_Response([$response, "status" => "success", "message" => "successfully"], 200);
        } catch (Exception $e) {
            return new WP_REST_Response(["status" => "error", "message" => $e->getMessage()], 400);
        }
    }
}
