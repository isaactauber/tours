<?php
//start session
session_start();
//configure MySQL database
require_once 'config.php';

//make sure user is still logged in (would be logged out if session expired)
if(!isset($_SESSION['username']) || empty($_SESSION['username'])){
  header("location: login.php");
  exit;}

//create Tour object
class Tour
{
  public $name = array();
  public $description = array();
  public $id = array();
  public $user;
}

//get username and user id
$usr = $_SESSION['username'];
$sqlUsername = "SELECT id FROM users WHERE username = '$usr'";
$idq = mysqli_query($con, $sqlUsername);
$id = mysqli_fetch_array($idq, MYSQLI_NUM);

//initialize new tour
$tour = new Tour();

//set user to be the id of logged in user
$tour->user = $usr;

//get information on tours (from this user) from database
$sqlNames = "SELECT tours.id, tours.name, tours.description FROM users JOIN tours ON tours.user_id=users.id WHERE users.id='$id[0]'";
$myNames = $con->query($sqlNames);

//if this user has created any tours
if ($myNames->num_rows > 0) {
    //loop through rows returned by database query
    while($row = $myNames->fetch_assoc()) {
        //push data from current row into Tour object arrays
        array_push($tour->name, $row['name']);
        array_push($tour->description, $row['description']);
        array_push($tour->id, $row['id']);
    }
}

//return tour object
echo json_encode($tour);
$con->close();
?>
