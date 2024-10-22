<?php

// Spotify API credentials
$client_id = 'your_spotify_client_id';  // Replace with your Spotify client ID
$client_secret = 'your_spotify_client_secret';  // Replace with your Spotify client secret

// Function to get Spotify access token
function getSpotifyAccessToken($client_id, $client_secret) {
    $url = 'https://accounts.spotify.com/api/token';
    $headers = [
        'Authorization: Basic ' . base64_encode($client_id . ':' . $client_secret),
    ];
    $data = [
        'grant_type' => 'client_credentials',
    ];

    // Use cURL to get the token
    $ch = curl_init($url);
    curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);
    curl_setopt($ch, CURLOPT_POSTFIELDS, http_build_query($data));
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    $response = curl_exec($ch);
    curl_close($ch);

    $result = json_decode($response, true);
    return $result['access_token'];
}

// Function to get top tracks of Proyecto Austero
function getTopTracks($access_token) {
    $artist_id = '3BKSXPjZx4LSMToAoqQGEK'; // Proyecto Austero's Spotify artist ID
    $url = "https://api.spotify.com/v1/artists/$artist_id/top-tracks?market=US";
    $headers = [
        'Authorization: Bearer ' . $access_token,
    ];

    // Use cURL to get the top tracks
    $ch = curl_init($url);
    curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    $response = curl_exec($ch);
    curl_close($ch);

    return json_decode($response, true);
}

// Get Spotify access token
$access_token = getSpotifyAccessToken($client_id, $client_secret);

// Get top tracks
$top_tracks = getTopTracks($access_token);

?>