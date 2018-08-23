//gets all locations from tour with a checkbox next to each one
//when a checkbox is clicked there will be a warning message to confirm the correct selection was made
//IF the user confirms, the corresponding location will be deleted from the database and the page will be reloaded
//ELSE the checkbox will be unclicked

//call my_locations.php to get all locations from the tour
xmlhttp = new XMLHttpRequest();
xmlhttp.onreadystatechange = function() {
  if (this.readyState == 4 && this.status == 200) {
    //parse json data from my_locations.php
    myObj = JSON.parse(this.responseText);

    //get the div "container" and put every location name in with a checkbox next to it
    var containter = document.getElementById("container");
    for (i = 0; i < myObj.name.length; i++) {
      //get name and current list count and append
      var count = i + 1;
      container.appendChild(document.createTextNode(count + ". " + myObj.name[i]));

      //create texbox and append
      var input = document.createElement("input");
      input.type = "checkbox";
      input.name = myObj.name[i];
      //when checkbox is clicked del() will be called
      input.onclick = del;
      container.appendChild(input);

      // Append a line break
      container.appendChild(document.createElement("br"));
    }
  }
}
xmlhttp.open("POST", "my_locations.php", true);
xmlhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
xmlhttp.send(null/*"x=" + dbParam*/);

//called when a checkbox is clicked
//will confirm with user if this is the location they want to delete
  //then will either delete or unckeck box
function del() {
  //confermation window
  var conf = confirm("Are you sure you wouldlike to delete this Stop??");

  //get all children of the container
    //important to note that this includes text boxes
  var children = document.getElementById("container").children;

  //loop through children
  for (i=0; i < children.length; i++){
    if (children[i].checked){
      //when we get to the checked box
      if (conf == true){
        //this will be the index of the checked object in the list of the tour locations
        var del = (i)*(.5)+1;
        //put del into a json object to pass into delete_location.php
        obj = {
          "del": del,
        };
        dbParam = JSON.stringify(obj);
        xmlhttp = new XMLHttpRequest();
        xmlhttp.onreadystatechange = function() {
          if (this.readyState == 4 && this.status == 200) {
            //when AJAX request completed reload the page
            window.location.reload(true);
            //deleted location will be gone
          }
        }
        xmlhttp.open("POST", "delete_location.php", true);
        xmlhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        xmlhttp.send("z=" + dbParam);
      }
      else{
        //uncheck the checkbox if the user cancels request
        children[i].checked = false;
      }
    }
  }
}
