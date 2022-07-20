<?php
require_once(__DIR__ . "/api_server.php");
$data = json_decode(file_get_contents('php://input'), true);
//echo var_dump($data);
$command = json_encode($data);
$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, $api_url);
curl_setopt($ch, CURLOPT_POST, 1);
curl_setopt($ch, CURLOPT_POSTFIELDS, $command);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);

$response = curl_exec($ch);
curl_close($ch);
echo $response;
?>