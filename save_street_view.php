<?php
//start session
session_start();

//parse json object from AJAX request
$obj = json_decode($_POST["z"], false);

//save information from json object into session variable
$_SESSION['new_lat'] = $obj->latitude;
$_SESSION['new_lng'] = $obj->longitude;
$_SESSION['new_heading'] = $obj->heading;
$_SESSION['new_pitch'] = $obj->pitch;
?>
