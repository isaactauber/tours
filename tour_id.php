<?php
//start session
session_start();
//save json object containing tour id in session variable
$_SESSION['tour_id'] = json_decode($_POST["y"], false);
?>
