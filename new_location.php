<?php
//start session
session_start();

//initialize sql database
require_once 'config.php';

//make sure session has not expired and user is still logged in
if(!isset($_SESSION['username']) || empty($_SESSION['username'])){
  header("location: login.php");
  exit;}


$obj = $_SESSION['tour_id'];
/*$sqlUsername = "SELECT ID FROM Users WHERE Username = '$usr'";
$idq = mysqli_query($con, $sqlUsername);
$id = mysqli_fetch_array($idq, MYSQLI_NUM);*/

// Define variables and initialize with empty values
$name = $description = "";
$username_err = $description_err = "";

// Processing form data when form is submitted
if($_SERVER["REQUEST_METHOD"] == "POST"){
    $lat = floatval(trim($_SESSION['new_lat']));
    $lng = floatval(trim($_SESSION['new_lng']));
    $heading = floatval(trim($_SESSION['new_heading']));
    $pitch = floatval(trim($_SESSION['new_pitch']));
    // Validate username
    if(empty(trim($_POST["name"])))
    {
        $username_err = "Please enter a name for your location.";
    }
    else
    {
        $name = mysqli_real_escape_string($con, trim($_POST['name']));
    }

    // Validate description
    if(empty(trim($_POST["description"])))
    {
      $description_err = "Please enter a description for your location.";
    }
    else
    {
        $description = mysqli_real_escape_string($con, trim($_POST['description']));
        $sql = "INSERT INTO locations (name, latitude, longitude, heading, pitch, description, tour_id) VALUES ('$name', '$lat', '$lng', '$heading', '$pitch', '$description', '$obj->tour')";
        if ($con->query($sql) === TRUE)
      	{
      		//echo "New record created successfully";
          header("location: map_tour.html");
      	}
      	else {
      		echo "Error: " . $sql . "<br>" . $con->error;
      	}
    }

	  $con->close();

}

?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>New Location</title>
    <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.css">
    <style type="text/css">
        body{ font: 14px sans-serif; }
        .wrapper{ width: 350px; padding: 20px; }
    </style>
</head>
<body>
    <div class="wrapper">
        <h2>New Location</h2>
        <p>Please fill in the information on your new location.</p>
        <form action="<?php echo htmlspecialchars($_SERVER["PHP_SELF"]); ?>" method="post" id="form1">
            <div class="form-group <?php echo (!empty($name)) ? 'has-error' : ''; ?>">
                <label>Name</label>
                <input type="text" name="name"class="form-control" value="<?php echo $name; ?>">
                <span class="help-block"><?php echo $username_err; ?></span>
            </div>
           <div class="form-group <?php echo (!empty($description)) ? 'has-error' : ''; ?>">
                <label>Description</label>
                <input type="text" name="description" class="form-control" value="<?php echo $description; ?>">
                <span class="help-block"><?php echo $description_err; ?></span>
            </div>
            <div class="form-group">
                <input type="submit" class="btn btn-success" value="Enter" onclick="location.href='map_tour.html';">
            </div>
            <p><a href="my_locations.html" class="btn btn-danger">Cancel</a></p>
        </form>
    </div>
</body>
</html>
