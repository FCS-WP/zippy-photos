<?php

namespace Zippy_Addons\Src\Controllers\Web;

use Exception;
use WP_REST_Request;
use WP_REST_Response;
use WP_Error;
use WP_Query;
use Google\Client;
use Google\Service\Drive;
use Google\Service\Drive\DriveFile;
use Zippy_Addons\Src\Helpers\Zippy_Request_Helper;

defined('ABSPATH') or die();

class Zippy_Photobook_Controller
{

    // BE

    public static function get_admin_config(WP_REST_Request $request)
    { 
        $folder_id = get_option('zippy_root_folder_id', '');
        $refresh_token = get_option('zippy_photobook_drive_refresh_token', '');
        $is_has_token = $refresh_token ? true : false;
        $result = [
            'folder_id' => $folder_id,
            'is_has_token' => $is_has_token,
        ];

        return new WP_REST_Response(["result" => $result ,"status" => "success", "message" => "Get Data Successfully"], 200);
    }

    public static function update_root_folder(WP_REST_Request $request)
    {
        $rules = [
            'folder_id' =>  ['type' => 'string', 'required' => true],
        ];

        $validation = Zippy_Request_Helper::validate_request($request->get_params(), $rules);

        if (is_wp_error($validation)) {
            return $validation;
        }

        $newFolderId = $request->get_param('folder_id');
        $update = update_option('zippy_root_folder_id', $newFolderId);

        return new WP_REST_Response(["status" => "success", "message" => "Update Successfully"], 200);
    }

    // FE

    public static function get_photobook_configs(WP_REST_Request $request)
    {
        try {
            $rules = [
                'product_id' =>  ['type' => 'int', 'required' => true],
                'variation_id' =>  ['type' => 'int', 'required' => false],
                'product_type' =>  ['type' => 'string', 'required' => true],
            ];

            $validation = Zippy_Request_Helper::validate_request($request->get_params(), $rules);

            if (is_wp_error($validation)) {
                return $validation;
            }

            $main_product_id = $request->get_param('product_id');
            $product_type = $request->get_param('product_type');
            $product = !empty($variation_id) ? wc_get_product($variation_id) : wc_get_product($main_product_id);
            if (!$product) {
                return new WP_Error('wc_product_error', 'Invalid Product', ['status' => 500]);
            }

            $is_photobook = self::check_is_photobook_category($product);

            if (!$is_photobook) {
                return new WP_REST_Response(["status" => "invalid", "message" => "Product is not photobook."], 200);
            }

            $result = self::get_data_photobook($product, $request->get_param('variation_id'));
            if (!$result) {
                return new WP_REST_Response(["status" => "failed", "message" => "Missing photobook config."], 200);
            }
            return new WP_REST_Response(["result" => $result, "status" => "success", "message" => "Get data successfully!"], 200);
        } catch (Exception $e) {
            return new WP_Error('product_fetch_error', $e->getMessage(), ['status' => 500]);
        }
    }

    public static function handle_uploaded_photo(WP_REST_Request $request)
    {
        try {
            $rules = [
                'folder_id' =>  ['type' => 'string', 'required' => true],
                'product_id' =>  ['type' => 'int', 'required' => true],
                'cart_item_key' =>  ['type' => 'string', 'required' => true],
                'last_photos' =>  ['type' => 'boolean', 'required' => true],
            ];

            $validation = Zippy_Request_Helper::validate_request($request->get_params(), $rules);

            if (is_wp_error($validation)) {
                return $validation;
            }

            // Handle here 
            $folderId = $request->get_param('folder_id');
            $productId = $request->get_param('product_id');
            $requestNo = $request->get_param('request_no', '');
            $cartItemKey = $request->get_param('cart_item_key');
            $folderUrl = 'https://drive.google.com/drive/folders/' . $folderId;
            $isLastUpload = boolval($request->get_param('last_photos'));
            $uploadPhotoToDrive = self::upload_photo_to_drive($_FILES, $folderId);

            if (!$uploadPhotoToDrive || $uploadPhotoToDrive['status'] == 'error') {
                wp_send_json_error(['message' => 'Failed to save photos']);
            }

            $result = [
                'status' => 'success',
                'massage' => 'Upload photos successfully!',
                'folder_link' => $folderUrl,
                'request_no' => $requestNo,
                'is_last_uploaded' => $isLastUpload
            ];
            return new WP_REST_Response($result, 200);
        } catch (Exception $e) {
            return new WP_Error('Upload photos to drive failed', $e->getMessage(), ['status' => 500]);
        }
    }

    public static function check_is_photobook_category($product)
    {
        $categories = get_the_terms($product->get_id(), 'product_cat');
        $result = false;
        if (!empty($categories) && !is_wp_error($categories)) {
            $slugs = wp_list_pluck($categories, 'slug');
            if (in_array('photobook', $slugs)) {
                $result = true;
            }
        }
        return $result;
    }

    public static function get_data_photobook($product, $variation_id = null)
    {
        $product_id = $product->get_id();
        if ($product->get_type() == 'variable') {
            $minPhotos = get_post_meta($variation_id, '_photo_min', true);
            $maxPhotos = get_post_meta($variation_id, '_photo_max', true);
            if (!$minPhotos || !$maxPhotos) {
                return false;
            }
            $result = [
                'product_id' => $variation_id,
                'min_photos' => $minPhotos,
                'max_photos' => $maxPhotos,
            ];
            return $result;
        }

        $min_photos = get_field('min_no_photobook', $product_id);
        $max_photos = get_field('max_no_photobook', $product_id);

        if (!$min_photos || !$max_photos) {
            return false;
        }

        $result = [
            'product_id' => $product_id,
            'min_photos' => $min_photos,
            'max_photos' => $max_photos,
        ];
    }

    // public static function upload_photobook_data_to_drive($files)
    // {
    //     try {
    //         $refresh_token = get_option('zippy_server_drive_refresh_token', '');

    //         $client = new Client();
    //         $client->useApplicationDefaultCredentials();
    //         $client->addScope(Drive::DRIVE);
    //         $driveService = new Drive($client);
    //         $fileMetadata = new Drive\DriveFile(array(
    //             'name' => 'photo.jpg'
    //         ));

    //         $content = file_get_contents($files[0]);
    //         $file = $driveService->files->create($fileMetadata, array(
    //             'data' => $content,
    //             'mimeType' => 'image/jpeg',
    //             'uploadType' => 'multipart',
    //             'fields' => 'id'
    //         ));

    //         return $file->id;
    //     } catch (Exception $e) {
    //         echo "Error Message: " . $e;
    //     }
    // }

    public static function check_folder_exists($service, $parentId, $folderName)
    {
        $query = sprintf(
            "name = '%s' and mimeType = 'application/vnd.google-apps.folder' and '%s' in parents and trashed = false",
            addslashes($folderName),
            $parentId
        );

        $response = $service->files->listFiles([
            'q' => $query,
            'fields' => 'files(id, name)'
        ]);

        $folders = $response->getFiles();

        if (count($folders) > 0) {
            $folderLink = 'https://drive.google.com/drive/folders/' . $folders[0]->getId();
            return [
                'folder_id' => $folders[0]->getId(),
                'folder_name' => $folders[0]->getName(),
                'folder_link' => $folderLink,
                'exists' => true,
                'status' => 'old-folder'
            ];
        } else {
            return [
                'exists' => false
            ];
        }
    }

    public static function create_folder_with_path($folderPath)
    {
        $service = self::get_drive_service_with_service_account();
        $folderNames = explode('/', trim($folderPath, '/'));
        $rootID = '1rawMUoQoCM8OJOg44Vcj3ZUfrifbbQKJ';
        $folderData = [];
        try {
            foreach ($folderNames as $key => $folderName) {
                $isFolderExist = self::check_folder_exists($service, $rootID, $folderName);
                if ($isFolderExist['exists'] == true) {
                    $folderData[] = $isFolderExist;
                } else {
                    $newFolder = self::create_new_folder($service, $folderName, $key == 0 ? $rootID : $folderData[$key - 1]['folder_id']);
                    if (!$newFolder) {
                        return  ['status' => 'error', 'message' => 'failed to create new folder'];
                    }
                    $folderData[] = $newFolder;
                }
            }

            return end($folderData);
        } catch (Exception $e) {
            return null;
        }
    }

    public static function create_new_folder($service, $folderName, $parentId)
    {
        if (!$service) {
            $service = self::get_drive_service_with_service_account();
        }
        $fileMetadata = new DriveFile([
            'name' => $folderName,
            'mimeType' => 'application/vnd.google-apps.folder',
            'parents' => [$parentId],
        ]);

        try {
            $file = $service->files->create($fileMetadata, ['fields' => 'id']);
            $folderId = $file->id;
            $folderLink = 'https://drive.google.com/drive/folders/' . $folderId;
            $permission = new \Google\Service\Drive\Permission([
                'type' => 'anyone',
                'role' => 'writer',
            ]);
            $service->permissions->create($folderId, $permission, ['fields' => 'id']);

            $result = [
                'folder_id' => $folderId,
                'folder_link' => $folderLink,
                'folder_name' => $folderName,
                'exists' => true,
                'status' => 'new-folder'
            ];

            return $result;
        } catch (Exception $e) {
            return false;
        }
    }

    public static function get_drive_service_with_service_account()
    {
        $base_path = plugin_dir_path(__FILE__);
        $src_path = dirname($base_path, 2);
        $client = new Client();
        $client->setAuthConfig($src_path . '/helpers/drive/photobook-auth.json');
        $client->addScope(Drive::DRIVE);

        $service = new Drive($client);
        return $service;
    }

    public static function upload_photo_to_drive($files, $parent_folder_id)
    {
        try {
            $access_token = get_option('zippy_photobook_drive_access_token', null);
            if (!$access_token) {
                Google_Drive_Controller::get_photobook_token();
                $access_token = get_option('zippy_photobook_drive_access_token', null);
                if (!$access_token) {
                    var_dump("Error when fetch token");
                    return false;
                }
            }

            $client = new Client();
            $client->setClientId(ZIPPY_OAUTH_CLIENT_ID);
            $client->setClientSecret(ZIPPY_OAUTH_CLIENT_SECRET);
            $client->setAccessToken($access_token);

            if ($client->isAccessTokenExpired()) {
                $refresh_token = get_option('zippy_photobook_drive_refresh_token');
                if ($refresh_token) {
                    $client->fetchAccessTokenWithRefreshToken($refresh_token);
                    update_option('zippy_photobook_drive_access_token', $client->getAccessToken());
                }
            }
            $client->addScope(Drive::DRIVE_FILE);
            $drive_service = new Drive($client);

            $uploaded_files = [];
            $failed_files = [];
            $files = $_FILES['files'];
            foreach ($files['tmp_name'] as $index => $fileGroup) {
                foreach ($fileGroup as $key => $fileTmpPath) {
                    if (!empty($fileTmpPath) && file_exists($fileTmpPath)) {
                        // You can access all details like this:
                        $tmp_name = $files['tmp_name'][$index][$key];
                        $file_name = $files['name'][$index][$key];
                        $file_type = $files['type'][$index][$key];

                        // Process upload
                        $uploaded_files[] = self::upload_single_file_to_drive($drive_service, $file_name, $tmp_name, $parent_folder_id);
                    } else {
                        $failed_files[] = $files['name'][$index][$key];
                        die;
                    }
                }
            }

            return [
                'status' => 'success',
                'uploaded_files' => $uploaded_files
            ];
        } catch (Exception $e) {
            return [
                'status' => 'error',
                'message' => $e->message()
            ];
        }
    }

    private static function upload_single_file_to_drive($service, $filename, $file_tmp, $parent_folder_id)
    {
        $file_metadata = new DriveFile([
            'name' => $filename,
            'parents' => [$parent_folder_id]
        ]);

        $content = file_get_contents($file_tmp);

        try {
            $file = $service->files->create($file_metadata, [
                'data' => $content,
                'mimeType' => mime_content_type($file_tmp),
                'uploadType' => 'multipart',
                'fields' => 'id',
            ]);

            return [
                'file_id' => $file->id,
                'web_link' => $file->webViewLink,
                'file_name' => $filename
            ];
        } catch (Exception $e) {
            return [
                'status' => 'error',
                'file_name' => $filename,
                'message' => $e->getMessage()
            ];
        }
    }
}
