<?php
//start session
session_start();

//create Location object
class Location
{
  public $latitude;
  public $longitude;
}

//initialize new location object
$location = new Location();

//save latitude and logitude values from session variable in new location object
$location->latitude = $_SESSION['new_lat'];
$location->longitude = $_SESSION['new_lng'];

//return location object
echo json_encode($location);
?>
