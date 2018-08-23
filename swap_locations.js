//gets all locations from tour with a checkbox next to each one
//when a checkbox is clicked code checks to see if two checkboxes are clicked
//IF there are two checkboxes checked the relative index(within the tour) of the two checked locations are saved
  //make call to php program that switches two locations in database

//make AJAX request to my_locations.php to get all locations from the tour
xmlhttp = new XMLHttpRequest();
xmlhttp.onreadystatechange = function() {
  if (this.readyState == 4 && this.status == 200) {
    //parse json data on completion of AJAX request
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
      //when checkbox is clicked keepCount() will be called
      input.onclick = keepCount;
      container.appendChild(input);

      // Append a line break
      container.appendChild(document.createElement("br"));                      // Append <p> to <body>
    }
  }
}
xmlhttp.open("POST", "my_locations.php", true);
xmlhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
xmlhttp.send(null/*"x=" + dbParam*/);

//called when a checkbox is clicked
//will check if two checkboxes are clicked
function keepCount() {
  //initialize empty array to hold indexes of checked locations
  var swap_arr = new Array();

  //counter that keeps track of how many checked boxes there are
  var amountClicked = 0;

  //get all children of the container
    //important to note that this includes text boxes
  var children = document.getElementById("container").children;

  //loop through children
  for (i=0; i < children.length; i++){
    if (children[i].checked){
      //push relative index of the checked object into the swap_arr
      swap_arr.push((i)*(.5)+1);

      //if there has been a box checked before this one (means there are now two boxes checked)
      if (amountClicked == 1){
        //push relative index of the checked object into the swap_arr
        swap_arr.push((i)*(.5)+1);

        //put contents of swap_arr into a json object
          //json object will get passed to swap.php
        obj = {
          swap1: swap_arr[0],
          swap2: swap_arr[1]
        };
        dbParam = JSON.stringify(obj);

        //AJAX request to swap.php
        xmlhttp = new XMLHttpRequest();
        xmlhttp.onreadystatechange = function() {
          if (this.readyState == 4 && this.status == 200) {
            //after AJAX request completed, reload the page
            window.location.reload(true);
          }
        }
        xmlhttp.open("POST", "swap.php", true);
        xmlhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        xmlhttp.send("z=" + dbParam);

      }
      //add one to amountClicked
      amountClicked = amountClicked + 1;
    }
  }
}
