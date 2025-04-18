<?php

namespace Zippy_Addons\Src\Controllers\Web;

use WP_REST_Request;
use WP_REST_Response;

defined('ABSPATH') or die();

class Zippy_Photo_Controller
{
    public static function save_photos(WP_REST_Request $request)
    {
        global $wpdb;
        $table_name = $wpdb->prefix . 'photo_details';
        $current_user_id = get_current_user_id();

        if (empty($_FILES['files'])) {
            return new WP_REST_Response(['error' => 'No files uploaded.'], 400);
        }

        require_once ABSPATH . 'wp-admin/includes/image.php';
        require_once ABSPATH . 'wp-admin/includes/file.php';
        require_once ABSPATH . 'wp-admin/includes/media.php';

        $uploaded_files = self::restructure_nested_files_array($_FILES['files']);

        $results = [];
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

                $photo_id = intval($_POST['files'][$index]['id'] ?? 0);
                $quantity = intval($_POST['files'][$index]['quantity'] ?? 1);
                $temp_id = intval($_POST['files'][$index]['temp_id'] ?? 0);
                $paper_type = sanitize_text_field($_POST['files'][$index]['paper'] ?? 'Matte');
                $photo_size = json_encode($_POST['files'][$index]['size'] ?? '{}');
                $attach_id = null;
                if (empty($photo_id) || $photo_id == 0) {
                    $attach_id = wp_insert_attachment($attachment, $movefile['file']);
                    $attach_data = wp_generate_attachment_metadata($attach_id, $movefile['file']);
                    wp_update_attachment_metadata($attach_id, $attach_data);

                    try {
                        $wpdb->insert($table_name, [
                            'user_id'     => $current_user_id,
                            'photo_id'    => $attach_id,
                            'url'         => esc_url_raw(wp_get_attachment_url($attach_id)),
                            'photo_size'  => $photo_size,
                            'paper_type'  => $paper_type,
                            'quantity'    => $quantity,
                            'status'      => 'pending',
                            'created_at'  => current_time('mysql'),
                        ]);
                    } catch (\Throwable $th) {
                        throw $th;
                    }
                } else {
                    $attach_id = $photo_id;
                    $wpdb->update(
                        $table_name,
                        [
                            'photo_size'  => $photo_size,
                            'paper_type'  => $paper_type,
                            'quantity'    => $quantity,
                            'status'      => 'pending',
                            'updated_at'  => current_time('mysql'),
                        ],
                        [
                            'photo_id' => $attach_id,
                        ],
                        [
                            '%s',
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
                    'photo_id'   => $attach_id,
                    'url'        => wp_get_attachment_url($attach_id),
                    'size'       => $photo_size,
                    'paper'      => $paper_type,
                    'quantity'   => $quantity,
                    'temp_id'    => $temp_id,
                ];
            } else {
                $results[] = ['error' => $movefile['error'] ?? 'Unknown error'];
            }
        }

        return new WP_REST_Response($results, 200);
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
}
