<?php
//start session
session_start();

//parse json object from AJAX request into session variable
$_SESSION['location_id'] = json_decode($_POST["z"], false);
?>
