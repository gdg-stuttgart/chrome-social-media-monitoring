<?php
$apiKey = "ABQIAAAA262XGKpE7AH_he_c_NwvhBTGKx-cvzVP972eZqujeomI3RDpChT1ZVK_GoLqL7fyKCZhQOHgNmJSMQ";
$address = $_GET["loc"];
 
$url = "http://maps.google.com/maps/geo?q=".urlencode($address)."&amp;output=json&amp;sensor=false&amp;key=y".$apiKey;
 
$ch = curl_init();
 
curl_setopt($ch, CURLOPT_URL, $url);
curl_setopt($ch, CURLOPT_HEADER,0);
curl_setopt($ch, CURLOPT_USERAGENT, $_SERVER["HTTP_USER_AGENT"]);
curl_setopt($ch, CURLOPT_FOLLOWLOCATION, 1);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
 
$response = curl_exec($ch);
curl_close($ch);
 
echo $response;
?>
