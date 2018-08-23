<?php
//start session
session_start();

//save json object from AJAX request into session variable
$_SESSION['file_add'] = json_decode($_POST["z"], false);
?>
