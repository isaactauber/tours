<?php
//start session
session_start();
//configure MySQL database
require_once 'config.php';

//make sure user is still logged in (would be logged out if session expired)
if(!isset($_SESSION['username']) || empty($_SESSION['username'])){
  header("location: login.php");
  exit;}

//get username and user id
$username = $_SESSION['username'];
$get_usr = "SELECT id FROM users WHERE username='$username'";
$usr = mysqli_fetch_object($con->query($get_usr));

//get name and description of tour from form
$name = $_REQUEST['name'];
$desc = $_REQUEST['description'];

//insert user id, name, and description into database
$sql = "INSERT INTO tours (user_id, name, description) VALUES ('$usr->id', '$name', '$desc')";
if ($con->query($sql) == TRUE)
{
  header("location: my_tours.html");
}
else{
  echo $con->error;
}
?>
