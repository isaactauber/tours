//displays all the tours in the database and saves the info of the one that gets chosen
//TO BE ADDED LATER: advanced searching through tours
    //EX: sort by most popular
    //EX: sort by tours close to users current location or location user chooses

//create a div to hold the list of tours
var tours = document.createElement("div");
xmlhttp = new XMLHttpRequest();
xmlhttp.onreadystatechange = function() {
  if (this.readyState == 4 && this.status == 200) {
    //parse json object from explore.php
    myObj = JSON.parse(this.responseText);

    //loop through json object and display tourname with username
    for (i = 0; i < myObj.name.length; i++) {
      var li = document.createElement("li");
      var para = document.createElement("a");
      var t = document.createTextNode(myObj.name[i] + " created by " + myObj.user[i]);
      para.appendChild(t);
      var id = myObj.id[i];
      var name = myObj.name[i];
      var description = myObj.description[i];

      //when the user clicks a tour it will call save_tour()
      (function(para, name, description, id) {
        para.addEventListener("click",  function(){
          save_tour(description, name, id);
        });
      })(para, name, description, id);

      //sends user to explore_tour.html page
      para.href = "explore_tour.html";

      //append to div and list
      li.appendChild(para);
      document.getElementById("tours").appendChild(li);
      }
    }
  }
xmlhttp.open("POST", "explore.php", true);
xmlhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
xmlhttp.send(null);

//INPUT: description, name, and id of clicked on tour
//will send a json object with input values to save_tour.php
  //save_tour.php will save these values in the session variable
function save_tour(description, name, id)
{
  obj = {
    "description": description,
    "name": name,
    "id": id
  };
  dbParam = JSON.stringify(obj);
  xmlhttp = new XMLHttpRequest();
  xmlhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
      return null;
    }
  }
  xmlhttp.open("POST", "save_tour.php", true);
  xmlhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
  xmlhttp.send("y=" + dbParam);
}
