<?php
//start session
session_start();

//parse json object from AJAX request
$obj = json_decode($_POST["z"], false);

//save information from json object in session variable
$_SESSION['new_lat'] = $obj->lat;
$_SESSION['new_lng'] = $obj->lng;
?>
