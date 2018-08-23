<?php
//start session
session_start();
//configure sql database
require_once 'config.php';

//get current locaiton id from session variable
$loc = $_SESSION['location_id']->location;

//create Location object
class Location
{
  public $latitude;
  public $longitude;
  public $name;
  public $heading;
  public $pitch;
}

//get information about location from database
$loc_sql = "SELECT locations.name, locations.latitude, locations.longitude, locations.heading, locations.pitch FROM locations WHERE locations.id='$loc'";
$loc_query = mysqli_query($con, $loc_sql);

//create new Location object
$location = new Location();

//pass information from database into Location object
$row = $loc_query->fetch_assoc();
$location->latitude = $row['latitude'];
$location->longitude = $row['longitude'];
$location->name = $row['name'];
$location->heading = $row['heading'];
$location->pitch = $row['pitch'];

//return Location object(json)
echo json_encode($location);
$con->close;
?>
