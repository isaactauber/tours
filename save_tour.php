<?php
//start session
session_start();

//decode json object sent by explore.js
$obj = json_decode($_POST["y"], false);

//put elements of json object into the session variable
$_SESSION['name'] = $obj->name;
$_SESSION['description'] = $obj->description;
$_SESSION['id'] = $obj->id;
?>
