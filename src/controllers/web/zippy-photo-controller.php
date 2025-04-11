<?php
namespace Zippy_Addons\Src\Controllers\Web;

use WP_REST_Request;
use WP_REST_Response;

defined('ABSPATH') or die();

class Zippy_Photo_Controller
{
    public static function save_photos(WP_REST_Request $request)
    {
        if (empty($_FILES['file'])) {
            return new WP_REST_Response(['error' => 'No files uploaded.'], 400);
        }

        require_once ABSPATH . 'wp-admin/includes/image.php';
        require_once ABSPATH . 'wp-admin/includes/file.php';
        require_once ABSPATH . 'wp-admin/includes/media.php';

        $uploaded_files = self::restructure_files_array($_FILES['file']);
        $results = [];

        foreach ($uploaded_files as $file) {
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

                $attach_id = wp_insert_attachment($attachment, $movefile['file']);
                $attach_data = wp_generate_attachment_metadata($attach_id, $movefile['file']);
                wp_update_attachment_metadata($attach_id, $attach_data);

                $results[] = [
                    'id'  => $attach_id,
                    'url' => wp_get_attachment_url($attach_id),
                ];
            } else {
                $results[] = ['error' => $movefile['error'] ?? 'Unknown error'];
            }
        }

        return new WP_REST_Response($results, 200);
    }

    public static function restructure_files_array($files) 
    {
        $result = [];
        $file_count = count($files['name']);
        $file_keys = array_keys($files);
      
        for ($i = 0; $i < $file_count; $i++) {
          foreach ($file_keys as $key) {
            $result[$i][$key] = $files[$key][$i];
          }
        }
      
        return $result;
      }
}

