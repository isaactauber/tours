<?php
//start session
session_start();
//configure sql database
require_once 'config.php';

//make sure user is still logged in (would be logged out if session expired)
if(!isset($_SESSION['username']) || empty($_SESSION['username'])){
  header("location: login.php");
  exit;}

//get id of current location from session variable
$obj = $_SESSION['location_id'];

//parse json data from AJAX request
  //new information for current location
$info = json_decode($_POST["z"], false);

//update database with new information on current location
$insert_sql = "UPDATE locations SET latitude='$info->latitude', longitude='$info->longitude', heading='$info->heading', pitch='$info->pitch' WHERE id='$obj->location'";
$query = mysqli_query($con, $insert_sql);
$con->close();
?>
