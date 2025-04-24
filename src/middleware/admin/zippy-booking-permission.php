<?php

/**
 * Bookings Router
 *
 *
 */

namespace Zippy_Addons\Src\Middleware\Admin;


defined('ABSPATH') or die();

use Zippy_Addons\Src\App\Zippy_Response_Handler;

class Zippy_Booking_Permission
{
    protected static $_instance = null;

    /**
     * @return Zippy_Booking_Permission
     */

    public static function get_instance()
    {
        if (is_null(self::$_instance)) {
            self::$_instance = new self();
        }
        return self::$_instance;
    }
    public static function zippy_permission_callback()
    {
        $headers = getallheaders();
        
        $uppercase_headers = [];
        foreach ($headers as $key => $value) {
            $uppercase_headers[ucfirst($key)] = $value;
        }
        
        $token = isset($uppercase_headers['Authorization']) ? trim(str_replace('Bearer', '', $uppercase_headers['Authorization'])) : '';
        $valid_token = (ZIPPY_BOOKING_API_TOKEN);

        // Valid Token
        return $token === $valid_token;
    }
}
