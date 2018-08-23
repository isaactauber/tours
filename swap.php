<?php
//start session
session_start();

//configure mysql database
require_once 'config.php';

//check if user is still logged (if not session expired)
if(!isset($_SESSION['username']) || empty($_SESSION['username'])){
  header("location: login.php");
  exit;}

//parse json object from AJAX request
$obj_1 = json_decode($_POST["z"], false);

//Location object
class Location
{
  public $name = [0,0];
  public $latitude = [0,0];
  public $longitude = [0,0];
  public $heading = [0,0];
  public $pitch = [0,0];
  public $description = [0,0];
  public $id = [0,0];
}

//get id of current tour
$obj_2 = $_SESSION['tour_id'];

//get locations from current tour
$sqlNames = "SELECT locations.name, locations.latitude, locations.longitude, locations.heading, locations.pitch, locations.description, locations.id FROM tours JOIN locations ON locations.tour_id=tours.id WHERE tours.id='$obj_2->tour'";
$myNames = mysqli_query($con, $sqlNames);

//initialize new Location object
$location = new Location();

//counter
$count = 0;

//counter to keep track of location
$location_index = 0;

//loop through rows of data returned my mysql query
while($row = $myNames->fetch_assoc()) {
    //iterate counter
    $count = $count + 1;

    //if current row count matches the count of the two locations passed in through the AJAX request
      //the values for swap1 and swap2 will both be the relative index of the user selected locations within the locations on the tour
    if ($count == $obj_1->swap1 OR $count == $obj_1->swap2){
      //fill location object
      $location->name[$location_index] = $row['name'];
      $location->latitude[$location_index] = $row['latitude'];
      $location->longitude[$location_index] = $row['longitude'];
      $location->heading[$location_index] = $row['heading'];
      $location->pitch[$location_index] = $row['pitch'];
      $location->description[$location_index] = $row['description'];
      $location->id[$location_index] = $row['id'];
      $location_index = $location_index + 1;
    }


}

//get data from location object
$name1 = $location->name[0];
$name2 = $location->name[1];
$latitude1 = $location->latitude[0];
$latitude2 = $location->latitude[1];
$heading1 = $location->heading[0];
$heading2 = $location->heading[1];
$pitch1 = $location->pitch[0];
$pitch2 = $location->pitch[1];
$longitude1 = $location->longitude[0];
$longitude2 = $location->longitude[1];
$description1 = $location->description[0];
$description2 = $location->description[1];
$id1 = $location->id[0];
$id2 = $location->id[1];

//sql requests that will swap the id of the two locatoions in the database
$swap_1 = "UPDATE locations SET name = '$name1', latitude = '$latitude1', longitude = '$longitude1', heading = '$heading1', pitch = '$pitch1', description = '$description1' WHERE id='$id2'";
$swap_2 = "UPDATE locations SET name = '$name2', latitude = '$latitude2', longitude = '$longitude2', heading = '$heading2', pitch = '$pitch2', description = '$description2' WHERE id='$id1'";
//handles the possibility of the name and description of the locations having characters that might cause an error
if($con->query($swap_1)){
  $a=null;
}
else{
  $name1 = $con->real_escape_string($name1);
  $description1 = $con->real_escape_string($description1);
  $swap_1 = "UPDATE locations SET name = '$name1', latitude = '$latitude1', longitude = '$longitude1', heading = '$heading1', pitch = '$pitch1', description = '$description1' WHERE id='$id2'";
  $con->query($swap_1);
}
if($con->query($swap_2)){
  $b=null;
}
else{
  $name2 = $con->real_escape_string($name2);
  $description2 = $con->real_escape_string($description2);
  $swap_2 = "UPDATE locations SET name = '$name2', latitude = '$latitude2', longitude = '$longitude2', heading = '$heading2', pitch = '$pitch2', description = '$description2' WHERE id='$id1'";
  $con->query($swap_2);
}

//updates the location_id of the sources related to the swapped locations
$source_swap = "UPDATE sources SET
    location_id =
      CASE
        WHEN location_id = '$id1' THEN '$id2'
        WHEN location_id = '$id2' THEN '$id1'
      END
    WHERE location_id IN ('$id1', '$id2')";
$con->query($source_swap);
$con->close();
?>
