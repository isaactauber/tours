//displays the locations of the selected tour as markers on a google map
//user can click on a marker and click "Open" to see more about that location

function initMap()
{
  //initial map information
  var options = {
    zoom: 11,
    center: {lat: 42.3601, lng: -71.0589}
  };
  //initialize new map
  var map = new google.maps.Map(document.getElementById('map'), options);

  //initialize new infowindow
  var infoWindow = new google.maps.InfoWindow;

  //make AJAX request to my_locations.php
    //get information on locations in tour
  xmlhttp = new XMLHttpRequest();
  xmlhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
      //when the AJAX request is completed parse the json object
      myObj = JSON.parse(this.responseText);

      //make header display the tour name
      document.getElementById("header").append(document.createTextNode(myObj.tour));

      //initialize count object to be 1
        //count will be the numbers in the markers
      var count = 1;

      //loop through locations returned by AJAX request
      for (i = 0; i < myObj.name.length; i++) {
        //latitude and logitude values of the current stop in the map
        var point = new google.maps.LatLng(
              parseFloat(myObj.latitude[i]),
              parseFloat(myObj.longitude[i]));

        //set the center of the map to be the coordinates of the first location
        if (count == 1)
        {
          map.setCenter(point);
        }

        //create infowindow that pops up when marker is clicked
        var infowincontent = document.createElement('div')

        //display name of location in infowindow
        var strong = document.createElement('strong');
        strong.textContent = myObj.name[i]
        infowincontent.appendChild(strong);
        infowincontent.appendChild(document.createElement('br'));
        var text = document.createElement('text');

        //in ifowindow create "Open" button
          //when clicked button takes you to the page of that location
        var para = document.createElement("a");
        para.href = "my_sources.html";
        var t = document.createTextNode("Open");
        para.appendChild(t);
        para.appendChild(document.createElement('br'));
        infowincontent.appendChild(para);

        //saves the information of the location that gets opened
          //done in save_tour
        var myid = myObj.id[i];
        (function(para, myid) {
          para.addEventListener("click",  function(){
            save_tour(myid);
          });
        })(para, myid);

        //create marker
        var marker = new google.maps.Marker(
        {
          position: point,
          map: map,
          label: "" + count
        });
        count = count + 1;

        (function(marker, infowincontent){
          marker.addListener('click', function(){
          infoWindow.setContent(infowincontent);
          infoWindow.open(map, marker);
          });
        })(marker, infowincontent);
      }
    }
  };
  xmlhttp.open("POST", "my_locations.php", true);
  xmlhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
  xmlhttp.send(null);

  //INPUT: id of a given location on tour
  function save_tour(id)
  {
    //create json object that get used in AJAX request
    obj = {
      "location": id
    };
    dbParam = JSON.stringify(obj);

    //AJAX request to location_id.php
      //saves given locaiton id to the session variable in php
    xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function() {
      if (this.readyState == 4 && this.status == 200) {
        null;
      }
    }
    xmlhttp.open("POST", "location_id.php", true);
    xmlhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xmlhttp.send("z=" + dbParam);
  }
}
