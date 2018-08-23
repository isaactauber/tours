//this page asks the user to confirm that this is the tour that they would like to take

//make AJAX request to explore_tour.php
xmlhttp = new XMLHttpRequest();
xmlhttp.onreadystatechange = function() {
  if (this.readyState == 4 && this.status == 200) {
    //when AJAX call is completed parse the json object
    newObj = JSON.parse(this.responseText);

    //displays name and description of tour for user
    var name = newObj.name;
    var description = newObj.description;
    document.getElementById("header").append(document.createTextNode(name));
    document.getElementById("header").append(document.createElement("br"));
    var sub = document.createElement("sub");
    sub.append(document.createTextNode(description));
    document.getElementById("header").append(sub);
  }
}
xmlhttp.open("POST", "explore_tour.php", true);
xmlhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
xmlhttp.send(null);
