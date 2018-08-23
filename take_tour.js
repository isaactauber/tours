//This is the javascript file that will help build the ui for when someone wants to take a tour
//The tour will be made with a doubly linked list object
    //the doubly linked list object was chosen because it can easily access the list nodes before and after the current node
      //this is useful because I want the user to be easily able to jump back and forth between stops on the tour


//doubly linked list object:
  //has head(for inital street view),
  //has tail(for appending new nodes)
  //has to be initailized with a node
class LinkedList {
  constructor(value) {
    this.tail = new Node(value, null, null);
    this.head = new Node(value, null, null);
    this.length = 1;
  }
  //node to append to end of List
  //node becomes new tail
  addNode(value) {
    var newNode = new Node(value, null, this.tail);
    //if node is second
    if (this.length == 1){
      this.head.next = newNode;
    }
    this.tail.next = newNode;
    // newNode.next = null;
    // newNode.previous = this.tail;
    this.tail = newNode;
    this.length++;
    return this;
  }
}

//node of doubly linked list
  //this.next and this.previous point to the next/previous node in the list
  //this.value is Stop object
class Node {
  constructor(value, next, previous) {
    this.value = value;
    this.next = next;
    this.previous = previous;
  }
  //returns true if node is head
  isHead() {
    if (this.previous == null) {
      return true;
    }
    return false;
  }
  //returns true if node is tail
  isTail() {
    if (this.next == null) {
      return true;
    }
    return false;
  }
}

//Stop objext, which will be what "value" in the node class is set to
  //contains information about the location
class Stop {
  constructor(point, heading, pitch, name, sources, description, count) {
    this.point = point;
    this.heading = heading;
    this.pitch = pitch;
    this.name = name;
    this.count = count;
    this.sources = sources;
    this.description = description;
  }
}

//Source Object will contain atributes of a source from the database
class Source {
  constructor(id, filename, description) {
    this.id = id;
    this.filename = filename;
    this.description = description;
  }
}

//initalizes a map (over beatuiful Boston)
//then loads tour data from take_tour.php
//displays the street view of the first location
  //has attributes for the user to explore the tour and related sources
function initMap()
{
  //map settings
  var options = {
    zoom: 13,
    center: {lat: 42.3601, lng: -71.0589}
  };
  //new map
  var map = new google.maps.Map(document.getElementById('map'), options);

  //AJAX request to take_tour.php
    //will return an object with information about tour stops
  xmlhttp = new XMLHttpRequest();
  xmlhttp.onreadystatechange = function(){
    if (this.readyState == 4 && this.status == 200) {
      //when AJAX call is completed parse the json object
      myObj = JSON.parse(this.responseText);

      //if there are no locations in the object returned
      //means the tour has no locations added yet
      if (myObj.name.length == 0) {
        //tell user they have not made any locations
        document.getElementById("header").innerHTML = "This Tour Is Currently Empty :("
      }
      else {
        //pass json object to street_views function
        //function returns a linked list containing the tour
          //saved in variable myList
        var myList = street_views(myObj);

        //start tour by making the current node the head of the list
          //the head will be the first stop on the tour
        var current_node = myList.head;
        //pass the current node into the next_stop function
          //next stop function will display the node given(tour stop) on the map div
        next_stop(current_node);
        //call get_sources on the current nodes sources
          //get sources will display this stops sources as buttons that can be clicked to open each source
        get_sources(current_node.value.sources);

        //listener for when the user clicks the previous button (tries to go to the previous tour stop)
        document.getElementById("previous").addEventListener("click", function(){
            //check if the current node is not the head
              //otherwise there are no previous stops on the tour and nothing should happen
            if (!current_node.isHead()) {
              //remove source buttons from previous tour stop
              var src = document.getElementById("sources");
              while (src.firstChild) {
                src.removeChild(src.firstChild);
              }

              //currnet node is changed to the node before the current node
              current_node = current_node.previous;
              //pass the current node into the next_stop function
                //next stop function will display the node given(tour stop) on the map div
              next_stop(current_node);
              //call get_sources on the current nodes sources
                //get sources will display this stops sources as buttons that can be clicked to open each source
              get_sources(current_node.value.sources);
            }
            //nothing happens if current node is head
          });

        //listener for when the user clicks the next button (tries to go to the next tour stop)
        document.getElementById("next").addEventListener("click", function(){
          //check if the current node is not the tail
            //otherwise there are no more stops on the tour and nothing should happen
          if (!current_node.isTail()) {
            //remove source buttons from previous tour stop
            var src = document.getElementById("sources");
            while (src.firstChild) {
              src.removeChild(src.firstChild);
            }

            //currnet node is changed to the node after the current node
            current_node = current_node.next;
            //pass the current node into the next_stop function
              //next stop function will display the node given(tour stop) on the map div
            next_stop(current_node);
            //call get_sources on the current nodes sources
              //get sources will display this stops sources as buttons that can be clicked to open each source
            get_sources(current_node.value.sources);
          }
        });
      }
    }
  };
  xmlhttp.open("POST", "take_tour.php", true);
  xmlhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
  xmlhttp.send(null);
}

//pass json object to street_views function
//function returns a linked list containing the tour
function street_views(myObj)
{
  //get the length of the arrays in the input object
  var input_length = myObj.name.length;

  //latitude and logitude values of the first stop in the map
  var point1 = new google.maps.LatLng(
        parseFloat(myObj.latitude[0]),
        parseFloat(myObj.longitude[0])
      );
  //heading, pitch, name, and description of the first stop in the map
  var head1 = myObj.heading[0];
  var pitch1 = myObj.pitch[0];
  var name1 = myObj.name[0];
  var description1 = myObj.description[0];
  //an array of all of the sources(and relevant information) from the first stop in the map
  var src1 = new Array();
  var cur = myObj.sources[0];
  for (j=0; j<cur.id.length; j++) {
    var src_id = cur.id[j];
    var src_filename = cur.filename[j];
    var src_description = cur.description[j];
    var source = new Source(src_id, src_filename, src_description);
    src1.push(source);
  }
  //make the first stop in the tour with the Stop object and the variables created above
  var first = new Stop(point1, head1, pitch1, name1, src1, description1, 0);

  //initailize the linked list that will contain the whole tour
      //initialize by passing in the first stop on the tour
  var myList = new LinkedList(first);

  //check to make sure that the tour (input object) has more than one locations
  if (input_length > 0){
    //loop through the locations in the tour
    for (i=1; i<input_length; i++){
      //heading, pitch, name, and description of the current stop in the map
      var point = new google.maps.LatLng(
            parseFloat(myObj.latitude[i]),
            parseFloat(myObj.longitude[i]));
      //heading, pitch, name, and description of the first stop in the map
      var heading = myObj.heading[i];
      var pitch = myObj.pitch[i];
      var name = myObj.name[i];
      var description = myObj.description[i];
      //an array of all of the sources(and relevant information) from the first stop in the map
      var sources = new Array();
      var cur = myObj.sources[i];
      for (j=0; j<cur.id.length; j++) {
        var src_id = cur.id[j];
        var src_filename = cur.filename[j];
        var src_description = cur.description[j];
        var source = new Source(src_id, src_filename, src_description);
        sources.push(source);
      }
      //make stop in the tour with the Stop object and the variables created above
      var value = new Stop(point, heading, pitch, name, sources, description, i);
      //append ^ stop to linked list by calling the lists addNode method
      myList.addNode(value);
    }
  }
  //return the doubly linked list
  return myList;
}

//pass the current node into the next_stop function
  //next stop function will display the node given(tour stop) on the map div
function next_stop(current_node) {
  //make street view panorama with position and pov information from the current list node
  var panorama = new google.maps.StreetViewPanorama(
  document.getElementById('map'), {
    position: current_node.value.point,
    pov: {
      heading: Number(current_node.value.heading),
      pitch: Number(current_node.value.pitch)
    },
    motionTrackingControlOptions: {
      position: google.maps.ControlPosition.LEFT_BOTTOM
    },
    visible: true
  });

  //make pano visibility: false, when previous or next buttons clicked
    //hopefully prevents tours with many stops from taking longer to load
  var prev_bttn = document.getElementById("previous");
  var next_bttn = document.getElementById("next");
  (function(panorama, prev_bttn, next_bttn) {
    prev_bttn.addEventListener("click",  function(){
      panorama.visible = false;
    });
    next_bttn.addEventListener("click",  function(){
      panorama.visible = false;
    });
  })(panorama, prev_bttn, next_bttn);

  //make page header the name of the current stop with its relative number in the tour next to it
  //subheader will be description of location
  var h = current_node.value.count + 1;
  var header = document.getElementById("header");
  header.innerHTML = h + ". " + current_node.value.name;
  var sub = document.createElement("sub");
  var txt = document.createTextNode(current_node.value.description);
  sub.append(document.createElement("br"));
  sub.append(txt);
  header.append(sub);
}

//call get_sources on the current nodes sources
  //get sources will display this stops sources as buttons that can be clicked to open each source
function get_sources(sources) {
  //if there are no sources then do nothing
  if (sources[0] == null){
    null;
  }
  else {
    //loop throug sources
    for (i=0; i<sources.length; i++) {
      //for source create button
      var button = document.createElement("button");
      //botton says on it "source " + the current source number
      var ii = i + 1;
      var txt = document.createTextNode("Source " + ii);
      button.append(txt);

      //create url be appending the source filename to the uploads directory
      var url = "/uploads/" + sources[i].filename;

      //when this source button is clicked call a funciton that displays this soucre in popup window(aka modal)
      (function(url, sources, i) {
        button.addEventListener("click", function(){
          display_source(url, sources[i].description);
        });
      })(url, sources, i);
      //append new lines and new source button
      document.getElementById("sources").append(document.createElement("br"));
      document.getElementById("sources").append(button);
      document.getElementById("sources").append(document.createElement("br"));
    }
  }
}

//display selected soucre in popup window(aka modal)
function display_source(url, description){
  //create modal - aka the popup window that displays the file associated with the current source
  var myModal = document.getElementById("myModal");
  var modal_content = document.createElement("div");
  modal_content.class = "modal-content";

  //content of modal_content div
  var span = document.createElement("span");
  span.class = "close";
  span.onclick = function() {
      myModal.style.display = "none";
  }

  //set image in popup to be the given filename(url)
  //set image subscript/caption to be source description
  var img = document.createElement("img");
  img.src = url;
  img.style = "width:100%;max-width:300px";
  var div = document.createElement("div");
  div.id = "caption";
  div.innerHTML = description

  //append content to modal
  modal_content.append(span);
  modal_content.append(img);
  modal_content.append(div)
  myModal.append(modal_content);

  // When the user clicks the button, open the modal
  myModal.style.display = "block";

  // When the user clicks anywhere outside of the modal, close it
  window.onclick = function(event) {
      if (event.target == myModal) {
          myModal.style.display = "none";
          myModal.removeChild(modal_content);
      }
  }
}
