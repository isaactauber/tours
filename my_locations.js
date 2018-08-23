//calls my_locations.php and returns all of the locations for this tour in the database
//parses locations object and puts the location names into a list
//user can click any of the locations and will be taken to my_sources.html
    //my_sources displays locations' street view and sources

//makes AJAX call to my_locations.php
xmlhttp = new XMLHttpRequest();
xmlhttp.onreadystatechange = function() {
  if (this.readyState == 4 && this.status == 200) {
    //when AJAX call is completed parse the json object
    myObj = JSON.parse(this.responseText);

    //make header display the name of the tour
    document.getElementById("header").append(document.createTextNode(myObj.tour));

    //if there are no locations in the object returned
    //means the tour has no locations added yet
    if (myObj.name.length == 0)
    {
      //tell user they have not made any locations
      document.getElementById("locations").appendChild(document.createTextNode("NO LOCATIONS MADE YET"));
    }
    else {
      //loop through all the locations returned by the AJAX request
      for (i = 0; i < myObj.name.length; i++) {
        //create the list elements as buttons
        var li = document.createElement("li");
        var para = document.createElement("a");

        //when a location is clicked go to my_sources.html
        para.href = "my_sources.html";

        //make button text be the currnet location name
        var t = document.createTextNode(myObj.name[i]);
        para.appendChild(t);

        //get id and description of current location
        var myid = myObj.id[i];
        var description = "DESCRIPTION: " + myObj.description[i];

        //add event listener that puts up an alert of the description
          //calls save_location and passes in the id of the current location
        (function(para, myid, description) {
          para.addEventListener("click",  function(){
            window.alert(description);
            save_location(myid);
          });
        })(para, myid, description);

        //puts list element into list
        li.appendChild(para);
        document.getElementById("locations").appendChild(li);
      }
    }
  }
}
xmlhttp.open("POST", "my_locations.php", true);
xmlhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
xmlhttp.send(null/*"x=" + dbParam*/);

//parses id into json object then location_id.php saves it
function save_location(id)
{
  obj = {
    "location": id
  };
  dbParam = JSON.stringify(obj);
  xmlhttp = new XMLHttpRequest();
  xmlhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
      return null;
    }
  }
  xmlhttp.open("POST", "location_id.php", true);
  xmlhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
  xmlhttp.send("z=" + dbParam);
}
