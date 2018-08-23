//The user can move and drag the street view pano.
/*They can keep moving it around until they find the street view they want
  at which point they can submit, and the given street view will be set
  for that location*/
//user will then be redirected to form to finish making new location

//street view object with lat, lng, heaing, pitch attributes
class StreetView {
  constructor() {
    this.latitude = null;
    this.longitude = null;
    this.heading = null;
    this.pitch = null;
  }
  //change lat
  newLat(lat) {
    this.latitude = lat;
  }
  //change lng
  newLng(lng) {
    this.longitude = lng;
  }
  //change heading
  newHeading(heading) {
    this.heading = heading;
  }
  //change pitch
  newPitch(pitch) {
    this.pitch = pitch;
  }
}

//gets street view information from database for locaiton
//Displays the street view of the current location (as seen in tour)
function initPano() {
  //makes AJAX call to change_street_view.php
  xmlhttp = new XMLHttpRequest();
  xmlhttp.onreadystatechange = function(){
    if (this.readyState == 4 && this.status == 200) {
      //when AJAX call is completed parse the json object
      myObj = JSON.parse(this.responseText);

      //initialize new streetView object
      var street_view = new StreetView();

      //create new street view panorama
      var panorama = new google.maps.StreetViewPanorama(
          //append panorama to div
          document.getElementById('pano'), {
            //position info gotten from json object
            //default new street view pov set
            position: {lat: Number(myObj.latitude), lng: Number(myObj.longitude)},
            pov: {
              heading: 160,
              pitch: 0
            },
            visible: true
      });

      //listener for when pano changes
      panorama.addListener('position_changed', function() {
          var positionCell = document.getElementById('position-cell');
          positionCell.firstChild.nodeValue = panorama.getPosition() + '';
          var pt = "" + panorama.getPosition();
          //calls parse_pt to get latitude and longitude from .getPosition()
          var point = parse_pt(pt);
          street_view.newLat(point.lat);
          street_view.newLng(point.lng);
      });

      //listener for when pano changes
      panorama.addListener('pov_changed', function() {
          var headingCell = document.getElementById('heading-cell');
          var pitchCell = document.getElementById('pitch-cell');
          headingCell.firstChild.nodeValue = panorama.getPov().heading + '';
          pitchCell.firstChild.nodeValue = panorama.getPov().pitch + '';

          street_view.newHeading(Number(panorama.getPov().heading));
          street_view.newPitch(Number(panorama.getPov().pitch));
      });

      //when user saves street view pass the street view object into save_location
      document.getElementById("select").addEventListener("click", function(){
          save_location(street_view);
        });
    }
  };
  xmlhttp.open("POST", "new_street_view.php", true);
  xmlhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
  xmlhttp.send(null);
}

//passes the street view object into street_view_info.php as a json object
  //street_view_info.php: parses json object and saves values into the session variable
function save_location(street_view)
{
  obj = {
    "latitude": street_view.latitude,
    "longitude": street_view.longitude,
    "heading": street_view.heading,
    "pitch": street_view.pitch
  };
  dbParam = JSON.stringify(obj);
  xmlhttp = new XMLHttpRequest();
  xmlhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
      return null;
    }
  }
  xmlhttp.open("POST", "save_street_view.php", true);
  xmlhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
  xmlhttp.send("z=" + dbParam);
}

/*I am struggling to find out how to access latitude and longitude
from the .getPosition() function. As a solution I am parsing the string manually*/
//input is a string containing the latLng info -> "(lat, lng)"
function parse_pt(point)
{
  var lat = 0;
  var lng = 0;
  var latitude = "";
  var longitude = "";
  for (i=0; i<(point.length - 1); i++) {
    //when lat == 1 the incoming values of point[i] will be part of the lat
    if (lat == 1) {
      latitude = latitude + point[i];
      if (point[i+1] === ",") {
        lat = 0;
      }
    }

    //when lng == 1 the incoming values of point[i] will be part of the lng
    if (lng == 1) {
      longitude = longitude + point[i];
    }

    if (point[i] === "(") {
      lat = 1;
    }

    if (point[i] === " ") {
      lng = 1;
    }
  }
  //return the point
  var pt = {lat: Number(latitude), lng:Number(longitude)};
  return pt;
}
