<?php
//start session
session_start();

//create tour object
class Tour
{
  public $name;
  public $description;
  public $id;
}

//creates new tour and puts variables saved in the session variable into the tour
$myTour = new Tour();
$myTour->name = $_SESSION['name'];
$myTour->description = $_SESSION['description'];
$myTour->id = $_SESSION['id'];

//returns tour as json object to be used by explore_tour.js
echo json_encode($myTour);
?>
