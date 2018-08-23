<?php
//start session
session_start();
//configure MySQL database
require_once 'config.php';

//make sure user is still logged in (would be logged out if session expired)
if(!isset($_SESSION['username']) || empty($_SESSION['username'])){
  header("location: login.php");
  exit;}

//create Source object
class Source
{
  public $id = array();
  public $filename = array();
  public $description = array();
  public $location_description;
  public $location_name;
}

//get id of current location from session variable
$obj = $_SESSION['location_id'];

//get location name and description from database
$get_location = "SELECT locations.name, locations.description FROM locations WHERE locations.id='$obj->location'";
$query_location = mysqli_query($con, $get_location);
$line = $query_location->fetch_assoc();

//initialize new Source
$source = new Source();

//pass location name and description into Source object
$source->location_description = $line['description'];
$source->location_name = $line['name'];

//get all sources from database that is associated with this location
$sqlNames = "SELECT sources.id, sources.filename, sources.description FROM locations JOIN sources ON sources.location_id=locations.id WHERE locations.id='$obj->location'";
$myNames = mysqli_query($con, $sqlNames);
//if there are source(s) already assocaited with this location
if ($myNames->num_rows > 0) {
    //loop through rows returned by database query
    while($row = $myNames->fetch_assoc()) {
        //push data from current row into Location object arrays
        array_push($source->id, $row['id']);
        array_push($source->filename, $row['filename']);
        array_push($source->description, $row['description']);
    }
}

//return Source object
echo json_encode($source);
$con->close();
?>
