<?php
//start session
session_start();

//configure mysql database
require_once 'config.php';

//create Source object
  //the sources variable in the location object holds an array of source objects
class Source
{
  public $id = array();
  public $filename = array();
  public $description = array();
}

//create Location object
class Location
{
  public $name = array();
  public $latitude = array();
  public $longitude = array();
  public $heading = array();
  public $pitch = array();
  public $id = array();
  public $description = array();
  public $sources = array();
}

//get tour id
$obj = $_SESSION['id'];

//get information on all locations in tour
$sqlNames = "SELECT locations.name, locations.latitude, locations.longitude, locations.heading, locations.pitch, locations.id, locations.description FROM tours JOIN locations ON locations.tour_id=tours.id WHERE tours.id='$obj'";
$myNames = mysqli_query($con, $sqlNames);

//initaize new Location object
$location = new Location();

//loop through information from mysqli query, put information in location object-
while($row = $myNames->fetch_assoc()) {
  array_push($location->name, $row['name']);
  array_push($location->latitude, $row['latitude']);
  array_push($location->longitude, $row['longitude']);
  array_push($location->heading, $row['heading']);
  array_push($location->pitch, $row['pitch']);
  array_push($location->id, $row['id']);
  array_push($location->description, $row['description']);
}

//counter
$count = 0;

//loop through locations in location object
////get sources for each location
while ($count != count($location->id)) {
  //get sources for location matching id
  $myid = $location->id[$count];
  $src = "SELECT sources.id, sources.filename, sources.description FROM sources WHERE sources.location_id='$myid'";
  $srcs = mysqli_query($con, $src);

  //initialize new source object
  $newSource = new Source;

  // output data of each row
  while($row = $srcs->fetch_assoc()) {
    //fill source objcet
    array_push($newSource->id, $row['id']);
    array_push($newSource->filename, $row['filename']);
    array_push($newSource->description, $row['description']);
    //$count = $count + 0;
  }
  //push sources object into the sources array of the location object
  array_push($location->sources, $newSource);

  //iterate counter
  $count = $count + 1;
}

//return json object
echo json_encode($location);
$con->close();
?>
