//displays the tour the new location is being added to on a maps
//user can double click on the map to generate a markers
//user then conferms a marker is in the right place which saves the coordinates and sends the user to new_street_view.html

function initMap()
{
  //initial map information
  var options = {
    zoom: 9,
    center: {lat: 42.3601, lng: -71.0589}
  };
  //initialize new map
  var map = new google.maps.Map(document.getElementById('map'), options);

  //Crete new Marker where user doubleclicks
  google.maps.event.addListener(map, 'dblclick', function(event)
  {
    //get lat and lng from where user doubleclicked
    obj = {
      "lat": event.latLng.lat(),
      "lng": event.latLng.lng()
    };
    //parse into json object for AJAX request
    dbParam = JSON.stringify(obj);

    //center map where user doubleclicked
    map.panTo(new google.maps.LatLng(obj.lat,obj.lng));

    //make new marker where user doubleclicked
    var marker = new google.maps.Marker(
    {
      position: event.latLng,
      map: map
    });

    var conf = confirm("Are you sure you this is where you would like your location??");
    if (conf == true) {
      window.open("new_street_view.html", "Choose Street View!");
    }
    else {
      window.location.reload(true);
    }
    //create infowindow that pops up with doubleclicked marker
    // var infowincontent = document.createElement('div');
    //
    // //in infowindow ask user if this is where they would like the locaiton
    // var strong = document.createElement('strong');
    // strong.textContent = "Is this where you would like your new location?";
    // infowincontent.appendChild(strong);
    // infowincontent.appendChild(document.createElement('br'));
    // infowincontent.appendChild(document.createElement('ul'));

    //create "yes" button for user to select if they want a new location at given marker
      //if clicked, send user to choose a street veiw for their new location
    // var li_1 = document.createElement("li");
    // var yes = document.createElement("a");
    // yes.href = "new_street_view.html";
    // var t = document.createTextNode("Yes");
    // yes.appendChild(t);
    // li_1.appendChild(yes);
    // infowincontent.appendChild(li_1);
    //
    // //create "no" button for user to select if they want a new location at given marker
    //   //if clicked, reload the page
    // var li_2 = document.createElement("li");
    // var no = document.createElement("a");
    // no.href = "map_new_location.js";
    // var t = document.createTextNode("No");
    // no.appendChild(t);
    // li_2.appendChild(no);
    // infowincontent.appendChild(li_2);
    //
    // //when marker is clicked open infowindow content
    // (function(marker, infowincontent){
    //   marker.addListener('click', function(){
    //   infoWindow.setContent(infowincontent);
    //   infoWindow.open(map, marker);
    //   });
    // })(marker, infowincontent);
    xmlhttp.open("POST", "save_coords.php", true);
    xmlhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xmlhttp.send("z=" + dbParam);
  });

  //initialize infowindow
  var infoWindow = new google.maps.InfoWindow;

  //make AJAX request to my_locations.php
    //get information on locations in tour
  xmlhttp = new XMLHttpRequest();
  xmlhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
      try{
      //when the AJAX request is completed parse the json object
      myObj = JSON.parse(this.responseText);

      //initialize count object to be 1
        //count will be the numbers in the markers
      var count = 1;

      //loop through locations returned by AJAX request
      for (i = 0; i < myObj.name.length; i++) {
        //latitude and logitude values of the current stop in the map
        var point = new google.maps.LatLng(
              parseFloat(myObj.latitude[i]),
              parseFloat(myObj.longitude[i]));


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
            //window.alert(myid);
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

        if (count == 1)
        {
          map.setCenter(point);
        }
        count = count + 1;

        (function(marker, infowincontent){
          marker.addListener('click', function(){
          infoWindow.setContent(infowincontent);
          infoWindow.open(map, marker);
          });
        })(marker, infowincontent);
      }
    }
    //catch if there are no locaitons in the tour
    catch{
      var aa = 0;
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
        return null;
      }
    }
    xmlhttp.open("POST", "location_id.php", true);
    xmlhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xmlhttp.send("z=" + dbParam);
  }
}
