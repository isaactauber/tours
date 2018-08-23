<?php
//start session
session_start();
//configure MySQL database
require_once 'config.php';

//make sure user is still logged in (would be logged out if session expired)
if(!isset($_SESSION['username']) || empty($_SESSION['username'])){
  header("location: login.php");
  exit;}

//get id of current tour from session variable
$obj = $_SESSION['tour_id'];

//create Location object
class Location
{
  public $name = array();
  public $latitude = array();
  public $longitude = array();
  public $description = array();
  public $id = array();
  public $tour;
}

//get tour name from databas
$get_tour = "SELECT tours.name FROM tours WHERE tours.id='$obj->tour'";
$query_tour = mysqli_query($con, $get_tour);
$line = $query_tour->fetch_assoc();
$tour = $line['name'];

//initialize new Locaiton object
$location = new Location();

//pass tour name into Location object
$location->tour = $tour;

//get all locations from database that are in this tour
$sqlNames = "SELECT locations.name, locations.latitude, locations.longitude, locations.description, locations.id FROM tours JOIN locations ON locations.tour_id=tours.id WHERE tours.id='$obj->tour'";
$myNames = mysqli_query($con, $sqlNames);
//if there are location(s) already in this tour
if ($myNames->num_rows > 0) {
    //loop through rows returned by database query
    while($row = $myNames->fetch_assoc()) {
        //push data from current row into Location object arrays
        array_push($location->name, $row['name']);
        array_push($location->latitude, $row['latitude']);
        array_push($location->longitude, $row['longitude']);
        array_push($location->description, $row['description']);
        array_push($location->id, $row['id']);
    }
}

//return location object
echo json_encode($location);
$con->close();
?>
