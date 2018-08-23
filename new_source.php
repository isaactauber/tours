<?php
//start session
session_start();

//initialize mysql database
require_once 'config.php';

//make sure session has not expired and user is still logged in
if(!isset($_SESSION['username']) || empty($_SESSION['username'])){
  header("location: login.php");
  exit;}

//get directory of file user submitted
$target_dir = "uploads/";
$target_file = $target_dir . basename($_FILES["fileToUpload"]["name"]);

//initialize variable to be 1
$uploadOk = 1;
$imageFileType = strtolower(pathinfo($target_file,PATHINFO_EXTENSION));

//if file exists
$file_name = null;
if ($_FILES["fileToUpload"]["tmp_name"]){
  // Check if image file is a actual image or fake image
  if(isset($_POST["submit"])) {
      $check = getimagesize($_FILES["fileToUpload"]["tmp_name"]);
      if($check !== false) {
        $uploadOk = 1;
      } else {
          //if file is not image
          $uploadOk = 0;
      }
  }

  // Check if file already exists
  if (file_exists($target_file)) {
      //if this is the case then create a new, unique name for the file

      $uploadOk = 0;
      header("location: new_source.html");
      echo "Sorry, file with that name already exists. Please rename the File and re-upload it.";
  }

  // Check file size
  if ($_FILES["fileToUpload"]["size"] > 800000) {
      echo "Sorry, your file is too large.";
      $uploadOk = 0;
  }

  // Allow certain file formats
  if($imageFileType != "jpg" && $imageFileType != "png" && $imageFileType != "jpeg" ) {
      echo "Sorry, only JPG, JPEG, & PNG files are allowed.";
      $uploadOk = 0;
  }

  // Check if $uploadOk is set to 0 by an error
  if ($uploadOk == 0) {
      echo "Sorry, your file was not uploaded.";
  // if everything is ok, try to upload file
  }
  else {
      if (move_uploaded_file($_FILES["fileToUpload"]["tmp_name"], $target_file)) {
          $file_name = basename( $_FILES["fileToUpload"]["name"]);
          $sql = "INSERT INTO sources (filename) VALUES ('$file_name')";
          if ($con->query($sql) === TRUE)
        	{
            header("location: my_sources.html");
        	}
      } else {
          echo "Sorry, there was an error uploading your file.";
      }
  }
}

//no file
$des = $_REQUEST['description'];
$location_id = $_SESSION['location_id'];
$desc = $con->real_escape_string($des);
if ($file_name != null){
  $file_name = $con->real_escape_string($file_name);
  $sql = "INSERT INTO sources (location_id, description, filename) VALUES ('$location_id->location', '$desc', '$file_name')";
}
else{
  $sql = "INSERT INTO sources (location_id, description, filename) VALUES ('$location_id->location', '$desc', NULL)";
}
//execute sql query
if ($con->query($sql) == TRUE)
{
  header("location: my_sources.html");
}
else{
  echo $con->error;
}
?>
