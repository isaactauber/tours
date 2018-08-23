<?php
//start session
session_start();
//configure mysql database
require_once 'config.php';

//make sure user is still logged in and session has not expired
if(!isset($_SESSION['username']) || empty($_SESSION['username'])){
  header("location: login.php");
  exit;}

//save json object passed in by the AJAX request into the session variable
$_SESSION['source_id'] = json_decode($_POST["w"], false);

//get filename from database of source matching id passed in by AJAX request
$id = $_SESSION['source_id'];
$sql = "SELECT filename FROM sources WHERE id='$id->source'";
$myNames = mysqli_query($con, $sql);

//create File object
class File
{
  public $file;
}

//initialze new File object
$file = new File;

//save filename returned my mysql query into File object
$row = $myNames->fetch_assoc();
$file->file = $row['filename'];

//return file object as json object
echo json_encode($file);
?>
