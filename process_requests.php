<?php
// $command = '';
// if (isset($_POST) && $_POST != '') {
//     $command = $_POST;
// }
// else {
//     $command = "turn_on";
// }

// $send = $command;
// $data = json_encode($send);
// echo var_dump($data);
// echo "<br>";
$data = json_decode(file_get_contents('php://input'), true);
//echo var_dump($data);
$command = json_encode($data);
$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, "http://192.168.1.117:8090/json-rpc");
curl_setopt($ch, CURLOPT_POST, 1);
curl_setopt($ch, CURLOPT_POSTFIELDS, $command);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);

$response = curl_exec($ch);
curl_close($ch);
echo var_dump(json_decode($response));
?>