//calls my_tours.php and returns all of the tours for this user in the database
//parses tours object and puts the tour names into a list
//user can click any of the tours and will be taken to a list of the locations in that tour (my_locations.html)

//creates a div to put the list of tours in
var tours = document.createElement("div");

//makes AJAX call to my_tours.php
xmlhttp = new XMLHttpRequest();
xmlhttp.onreadystatechange = function() {
  if (this.readyState == 4 && this.status == 200) {
    //when AJAX call is completed parse the json object
    myObj = JSON.parse(this.responseText);

    //make header say "Weclome, (username)"
    document.getElementById("header").append(document.createTextNode("Welcome, " + myObj.user));

    //if there are no tous in the object returned
    //means user has not made any tours
    if (myObj.name.length == 0)
    {
      //tell user they have not made any tours
      document.getElementById("tours").appendChild(document.createTextNode("YOU HAVE NO TOURS YET!"));
    }
    else {
        //loop through all the tours returned by the AJAX request
        for (i = 0; i < myObj.name.length; i++) {
          //create the list elements as buttons
          var li = document.createElement("li");
          var para = document.createElement("a");

          //when a tour is clicked go to my_locations.html
          para.href = "my_locations.html";
          
          //make button text be the currnet tour name
          var t = document.createTextNode(myObj.name[i]);
          para.appendChild(t);

          //get id and description of current tour
          var myid = myObj.id[i];
          var description = "DESCRIPTION: " + myObj.description[i];

          //add event listener that puts up an alert of the description
            //calls save_tour and passes in the id of the current tour
          (function(para, myid, description) {
            para.addEventListener("click",  function(){
              window.alert(description);
              save_tour(myid);
            });
          })(para, myid, description);

          //puts list element into list
          li.appendChild(para);
          document.getElementById("tours").appendChild(li);
        }
      }
    }
  }
xmlhttp.open("POST", "my_tours.php", true);
xmlhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
xmlhttp.send(null);

//parses id into json object then tour_id.php saves it
function save_tour(id)
{
  obj = {
    "tour": id
  };
  dbParam = JSON.stringify(obj);
  xmlhttp = new XMLHttpRequest();
  xmlhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
      return null;
    }
  }
  xmlhttp.open("POST", "tour_id.php", true);
  xmlhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
  xmlhttp.send("y=" + dbParam);
}
