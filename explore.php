<?php
//configure MySQL database
require_once 'config.php';

//create Tour object
class Tour
{
  public $name = array();
  public $description = array();
  public $id = array();
  public $user = array();
}

//select all the tours in the database
$sql_tours = "SELECT * FROM tours";
$get_tours = $con->query($sql_tours);

//create new Tour object
$tour = new Tour();

//loop through each row returned by database
while($row = $get_tours->fetch_assoc()) {

    //push the info about tour into object
    array_push($tour->name, $row['name']);
    array_push($tour->description, $row['description']);
    array_push($tour->id, $row['id']);
    $user_id = $row['user_id'];

    //use user_id from each tour to return the user who made the tour
    $get_user = "SELECT username FROM users WHERE id='$user_id'";
    $user_query = mysqli_query($con, $get_user);
    $user = $user_query->fetch_assoc();

    //add admin username to tour object
    array_push($tour->user, $user['username']);
}

//return tours as json object
echo json_encode($tour);
$con->close();
?>
