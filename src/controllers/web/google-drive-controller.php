<?php

/**
 * Google Drive Controller
 *
 *
 */

namespace Zippy_Addons\Src\Controllers\Web;

use Exception;
use Google\Client;
use Google\Service\Drive;
use WP_REST_Response;
use WP_REST_Request;

class Google_Drive_Controller
{
    public static function get_google_token()
    {

        $home_url = home_url();

        $client_id = ZIPPY_OAUTH_CLIENT_ID;
        $redirect_uri = $home_url . '/wp-json/zippy-addons/v1/oauth/callback';
        $scope = 'https://www.googleapis.com/auth/drive.readonly';

        $url = 'https://accounts.google.com/o/oauth2/v2/auth?' . http_build_query([
            'client_id' => $client_id,
            'redirect_uri' => $redirect_uri,
            'response_type' => 'code',
            'scope' => $scope,
            'access_type' => 'offline',
            'prompt' => 'consent',
            'state' => 'frontend-callback', // optional
        ]);

        wp_redirect($url);
        exit;
    }

    public static function handle_google_callback(WP_REST_Request $request)
    {
        $code = $request->get_param('code');

        if (!$code) {
            return new WP_REST_Response(['status' => 'error', 'message' => 'Missing code'], 400);
        }

        $home_url = home_url();

        $client = new \Google\Client();
        $client->setClientId(ZIPPY_OAUTH_CLIENT_ID);
        $client->setClientSecret(ZIPPY_OAUTH_CLIENT_SECRET);
        $client->setRedirectUri($home_url . '/wp-json/zippy-addons/v1/oauth/callback');
        $client->setAccessType('offline');
        $client->setPrompt('consent');
        $client->setScopes(['https://www.googleapis.com/auth/drive.readonly']);

        $token = $client->fetchAccessTokenWithAuthCode($code);

        if (isset($token['error'])) {
            return new WP_REST_Response(['status' => 'error', 'message' => $token['error_description']], 400);
        }

        // Get refresh_token only on first login, and store it
        if (isset($token['refresh_token'])) {
            update_option('zippy_google_drive_refresh_token', $token['refresh_token']);
        }

        $refresh_token = get_option('zippy_google_drive_refresh_token');
        if (!$refresh_token) {
            return new WP_REST_Response(['status' => 'error', 'message' => 'No refresh token found'], 400);
        }

        $client->fetchAccessTokenWithRefreshToken($refresh_token);
        $access_token = $client->getAccessToken();

        $redirectToApp = $home_url . '/google-auth-complete?token=' . urlencode(json_encode($access_token));

        wp_redirect($redirectToApp);
        exit;
    }

    public static function get_photobook_token()
    {
        $redirect_uri = home_url('/wp-json/zippy-addons/v1/oauth/callback2');
        $client = new Client();
        $client->setClientId(ZIPPY_OAUTH_CLIENT_ID);
        $client->setClientSecret(ZIPPY_OAUTH_CLIENT_SECRET);
        $client->setRedirectUri($redirect_uri);
        $client->addScope(Drive::DRIVE);
        $client->setAccessType('offline');
        $client->setPrompt('consent');

        $authUrl = $client->createAuthUrl();
        header('Location: ' . filter_var($authUrl, FILTER_SANITIZE_URL));
        exit;
    }

    public static function handle_photobook_callback()
    {
        $client = new Client();
        $client->setClientId(ZIPPY_OAUTH_CLIENT_ID);
        $client->setClientSecret(ZIPPY_OAUTH_CLIENT_SECRET);
        $client->setRedirectUri(home_url('/wp-json/zippy-addons/v1/oauth/callback2'));
        $client->addScope('https://www.googleapis.com/auth/drive.file');

        if (isset($_GET['code'])) {
            $token = $client->fetchAccessTokenWithAuthCode($_GET['code']);
            if (isset($token['refresh_token'])) {
                update_option('zippy_photobook_drive_refresh_token', $token['refresh_token']);
            }
            update_option('zippy_photobook_drive_access_token', $token);
        }

        $redirectToApp = home_url('/wp-admin');

        wp_redirect($redirectToApp);
        exit;
    }
}
