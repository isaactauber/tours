<?php
ini_set("log_errors", 1);
ini_set("error_log", "/tmp/php-error.log");
session_start();
require_once 'config.php';
//$parameter = json_decode($_POST["x"], false);   //passes the tour id to $parameter
//echo $paremeter;
if(!isset($_SESSION['username']) || empty($_SESSION['username'])){
  header("location: login.php");
  exit;}

//echo json_decode($_POST["w"], false);
$_SESSION['source_id'] = json_decode($_POST["w"], false);
//echo $_SESSION['source_id'];
$id = $_SESSION['source_id'];
$sql = "SELECT filename FROM sources WHERE id='$id->source'";
$myNames = mysqli_query($con, $sql);

class File
{
  public $file = "abc123";
}

//echo $var;
// output data of each row
$file = new File;
$row = $myNames->fetch_assoc();
//echo $row;
$file->file = $row['filename'];
//$count = $count + 0;
echo json_encode($file);
?>
