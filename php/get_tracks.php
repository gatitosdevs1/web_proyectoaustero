<?php

ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

// Include the auth script
include('spotify_auth.php');

// Spotify Band Artist ID (Replace with the actual band ID)
$artist_id = '3BKSXPjZx4LSMToAoqQGEK';

// Fetch access token
$access_token = getAccessToken();

if (!$access_token) {
    echo json_encode(['error' => 'Unable to fetch Spotify access token']);
    exit;
}

// Spotify API Request for Top Tracks
$url = "https://api.spotify.com/v1/artists/$artist_id/top-tracks?market=US";
$options = [
    'http' => [
        'header' => "Authorization: Bearer $access_token",
        'method' => 'GET'
    ]
];
$context = stream_context_create($options);
$response = file_get_contents($url, false, $context);

if ($response === FALSE) {
    echo json_encode(['error' => 'Unable to fetch data from Spotify API']);
    exit;
}

// Ensure you send valid JSON as the output
header('Content-Type: application/json');
echo $response;
?>
