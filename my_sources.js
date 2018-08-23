//FIRST PART:
//calls my_sources.php and returns all of the sources for this location in the database
//parses sources object and puts the sources filenames into a list
//user can click any of the sources and will open the source file

//makes AJAX call to my_sources.php
xmlhttp = new XMLHttpRequest();
xmlhttp.onreadystatechange = function() {
  if (this.readyState == 4 && this.status == 200) {
    //when AJAX call is completed parse the json object
    myObj = JSON.parse(this.responseText);

    //creates a description button that will dispaly location description
    var description_button = document.getElementById("select");
    (function(description_button, myObj) {                    // For all major browsers, except IE 8 and earlier
      description_button.addEventListener("click",  function(){
        window.alert(myObj.location_description);
      });
    })(description_button, myObj);
    //location name dispalyed as header
    document.getElementById("header").append(document.createTextNode(myObj.location_name));

    //if there are no sources in the object returned
    //means user has not attatched any sources to the location
    if (myObj.id.length == 0) {
      //tell user they have not made any sources
      document.getElementById("sources").appendChild(document.createTextNode("NO SOURCES ATTATCHED YET"));
    }
    else {
      //loop through all the sources returned by the AJAX request
      for (i = 0; i < myObj.description.length; i++) {
        //create the list elements as buttons
        var li = document.createElement("li");
        var para = document.createElement("a");

        //make button text be the currnet filename
        var t = document.createTextNode(myObj.filename[i]);
        para.appendChild(t);

        //get id and description of current source
        var description = myObj.description[i];
        var myid = myObj.id[i];
        var filename = myObj.filename[i];

        //add event listener that puts up an alert of the description
          //uses the filename to open the corresponding file from the uploads directory
        (function(para, description, filename) {
          para.addEventListener("click",  function(){
            window.alert("DESCRIPTION:\n" + description);
            file_path = "/uploads/" + filename;
            window.open(file_path, "_self");
          });
        })(para, description, filename);

        //puts list element into list
        li.appendChild(para);
        document.getElementById("sources").appendChild(li);
      }
    }
  }
}
xmlhttp.open("POST", "my_sources.php", true);
xmlhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
xmlhttp.send(null);

////////////////////////////////////////////////////////////////////////////////

//SECOND PART:
//gets street view information from database for locaiton
//Displays the street view of the current location (as seen in tour)
function initPano() {
  //makes AJAX call to change_street_view.php
  xmlhttp = new XMLHttpRequest();
  xmlhttp.onreadystatechange = function(){
    if (this.readyState == 4 && this.status == 200) {
      //when AJAX call is completed parse the json object
      myObj = JSON.parse(this.responseText);

      //create new street view panorama
      var panorama = new google.maps.StreetViewPanorama(
          //append panorama to div
          document.getElementById('pano'), {
            //position and pov info gotten from json object
            position: {lat: Number(myObj.latitude), lng: Number(myObj.longitude)},
            pov: {
              heading: Number(myObj.heading),
              pitch: Number(myObj.pitch)
            },
            visible: true
      });
    }
  };
  xmlhttp.open("POST", "change_street_view.php", true);
  xmlhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
  xmlhttp.send(null);
}
