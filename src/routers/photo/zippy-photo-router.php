<?php

namespace Zippy_Addons\Src\Routers\Photo;

use Zippy_Addons\Src\Controllers\Web\Zippy_Photo_Controller;
use Zippy_Addons\Src\Controllers\Web\Zippy_Photobook_Controller;
use Zippy_Addons\Src\Middleware\Admin\Zippy_Booking_Permission;

/**
 * Photo Editor Router
 * 
 */

defined('ABSPATH') or die();

class Zippy_Photo_Router
{
    protected static $_instance = null;

    public static function get_instance()
    {
        if (is_null(self::$_instance)) {
            self::$_instance = new self();
        }
        return self::$_instance;
    }

    public function __construct()
    {
        add_action('rest_api_init', array($this, 'photo_editor_init_api'));
    }

    public function photo_editor_init_api()
    {
        register_rest_route(ZIPPY_BOOKING_API_NAMESPACE, '/photos', array(
            'methods' => 'POST',
            'callback' => [Zippy_Photo_Controller::class, 'save_photos'],
            'permission_callback' => array(Zippy_Booking_Permission::class, 'zippy_permission_callback'),
        ));

        register_rest_route(ZIPPY_BOOKING_API_NAMESPACE, '/photo-sizes', array(
            'methods' => 'GET',
            'callback' => [Zippy_Photo_Controller::class, 'get_photo_sizes'],
            'permission_callback' => array(Zippy_Booking_Permission::class, 'zippy_permission_callback'),
        ));

        register_rest_route(ZIPPY_BOOKING_API_NAMESPACE, '/photobook', array(
            'methods' => 'GET',
            'callback' => [Zippy_Photobook_Controller::class, 'get_photobook_configs'],
            'permission_callback' => array(Zippy_Booking_Permission::class, 'zippy_permission_callback'),
        ));

        register_rest_route(ZIPPY_BOOKING_API_NAMESPACE, '/photobook', array(
            'methods' => 'POST',
            'callback' => [Zippy_Photo_Controller::class, 'save_photobook_images'],
            'permission_callback' => array(Zippy_Booking_Permission::class, 'zippy_permission_callback'),
        ));

        register_rest_route(ZIPPY_BOOKING_API_NAMESPACE, '/photobook-uploader', array(
            'methods' => 'POST',
            'callback' => [Zippy_Photobook_Controller::class, 'handle_uploaded_photo'],
            'permission_callback' => array(Zippy_Booking_Permission::class, 'zippy_permission_callback'),
        ));

        register_rest_route(ZIPPY_BOOKING_API_NAMESPACE, '/photobook-delete', array(
            'methods' => 'DELETE',
            'callback' => [Zippy_Photobook_Controller::class, 'handle_delete_files_and_folders'],
            'permission_callback' => array(Zippy_Booking_Permission::class, 'zippy_permission_callback'),
        ));
    }
}
