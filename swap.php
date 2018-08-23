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
while($row = $myNames->fetch_assoc()) {
    //echo "Name: " . $row["name"]. " Description: " . $row["description"]. "<br>";
    //echo $obj_1->swap1;
    $count = $count + 1;
    if ($count == $obj_1->swap1 OR $count == $obj_1->swap2){
      //echo $count;
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
//$swap_1 = "UPDATE locations SET name = '$location->name[0]', latitude = '$location->latitude[0]', longitude = '$location->longitude[0]', description = '$location->description[0]' WHERE id='$location->id[1]'";
//$swap_2 = "UPDATE locations SET name = '$location->name[1]', latitude = '$location->latitude[1]', longitude = '$location->longitude[1]', description = '$location->description[1]' WHERE id='$location->id[0]'";

$name1 = $location->name[0];
//echo $name1;
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

$swap_1 = "UPDATE locations SET name = '$name1', latitude = '$latitude1', longitude = '$longitude1', heading = '$heading1', pitch = '$pitch1', description = '$description1' WHERE id='$id2'";
$swap_2 = "UPDATE locations SET name = '$name2', latitude = '$latitude2', longitude = '$longitude2', heading = '$heading2', pitch = '$pitch2', description = '$description2' WHERE id='$id1'";


if($con->query($swap_1)){
  //echo $swap_1;
  $a=null;
}
else{
  $name1 = $con->real_escape_string($name1);
  $description1 = $con->real_escape_string($description1);
  $swap_1 = "UPDATE locations SET name = '$name1', latitude = '$latitude1', longitude = '$longitude1', heading = '$heading1', pitch = '$pitch1', description = '$description1' WHERE id='$id2'";
  $con->query($swap_1);
}
if($con->query($swap_2)){
  //echo $swap_2;
  $b=null;
}
else{
  $name2 = $con->real_escape_string($name2);
  $description2 = $con->real_escape_string($description2);
  $swap_2 = "UPDATE locations SET name = '$name2', latitude = '$latitude2', longitude = '$longitude2', heading = '$heading2', pitch = '$pitch2', description = '$description2' WHERE id='$id1'";
  $con->query($swap_2);
}

$source_swap = "UPDATE sources SET
    location_id =
      CASE
        WHEN location_id = '$id1' THEN '$id2'
        WHEN location_id = '$id2' THEN '$id1'
      END
    WHERE location_id IN ('$id1', '$id2')";

if($con->query($source_swap)){
  echo $source_swap;
}
else{echo "wat";}
$con->close();//$myLatitudes = mysqli_query($con, $sqlLatitudes);
//$myLongitudes = mysqli_query($con, $sqlLongitudes);

//$results = $myNames->fetch_assoc();
//$latitudes = mysqli_fetch_array($myLatitudes, MYSQLI_NUM);
//$longitudes = mysqli_fetch_array($myLongitudes, MYSQLI_NUM);


?>
