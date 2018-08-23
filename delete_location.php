<?php
//start session
session_start();
//configure MySQL database
require_once 'config.php';

//make sure session did not expire and that user is still logged in
if(!isset($_SESSION['username']) || empty($_SESSION['username'])){
  header("location: login.php");
  exit;}

//decode object from delete_locaiton.js
$obj_1 = json_decode($_POST["z"], false);

//location object (only need to save id)
class Location
{
  public $id;
}

//get current tour id
$obj_2 = $_SESSION['tour_id'];

//get all locations from tour
$locations_sql ="SELECT locations.name, locations.latitude, locations.longitude, locations.description, locations.id FROM tours JOIN locations ON locations.tour_id=tours.id WHERE tours.id='$obj_2->tour'";
$locations_query = mysqli_query($con, $locations_sql);

if ($locations_query->num_rows > 0) {
    //initialize location object
    $location = new Location();
    //initailize count of locations in tour
    $count = 0;
    //get associative array of locations
    while($row = $locations_query->fetch_assoc()) {
        //incrament count by 1
        $count = $count + 1;
        //if statement will be true when the nth number of the tour is the same as the nth location selected by user
        if ($count == $obj_1->del){
          //saves location id
          $location->id = $row['id'];
        }


    }
    //get location id
    $id = $location->id[0];

    //delete from location at user id
    $delete = "DELETE FROM locations WHERE  id='$id'";
    $uu = $con->query($delete);
}
$con->close();
?>
