# tours
Hidden History Tours

Admin:

login.php:
  Takes login credentials from a form and checks it against database
  
register.php:
  Takes credentials from form and inserts it into database
  Saves password as a hash in database for security purposes

my_tours.html:
  Queries database for tours associated with user

new_tour.html:
  Form for user to submit name and description of a new tour
  Information gets saved to database

my_locations.html:
  Queries database for locations associated with tour

map_tour.html:
  Queries database for locations associated with tour
  Displays locations as ordered markers on a map

my_sources.html:
  Queries database for streetview information and sources associated with location
  Displays information in side by side displays

change_street_view.html:
  Queries database for street view information and displays it alongside street view
  As user changes streetview information it updates in the window
  When user submits desired streetview the relevant information is updated in the database
  Street view information includes 
    Latitude
    Longitude
    Heading 
    Pitch

new_source.html:
  Form for user to submit file (image) and description of new source
  File gets added to a directory and filename and description get saved to database
  Filename in database points to file in directory
  Does not submit if a file with same filename already exists in the directory

map_new_location.html:
  Displays map with locations from current tour as markers on map
  When user double clicks on map and confirms location user gets redirected to new_street_view.html with street view from     selected location displayed

new_street_view.html:
  Displays street view and street view information (similar to change_street_view.html)
  When user confirms street view relevant data is saved to database

new_location.php:
  For for user to submit name and description for new location
  Name and description is saved to database

swap_locations.html:
  User clicks checkboxes of locations they would like to swap order of in tour
  If user confirms then the locations will be swapped in the database
  User Id associated with sources are updated so that they stay associated with correct location

delete_location.html:
  User clicks checkbox of location they would like to delete
  If user confirms then location will be deleted from database



Explorer (user):

explore.html:
  Displays all tours on database
  Possible Improvement: more advanced methods of displaying tours
    By most recent 
    By most viewed
    By tour admin

explore_tour.html:
  Displays tour name and description 
  Confirms with user that they want to take tour

take_tour.html:
  Creates the User Interface for taking a tour
  Each location on tour is saved as a node in a doubly linked list
  Doubly linked list used so user can easily access locations before and after current location
  Each node in list contains all relevant data on location
    Street view information
    Sources associated with location
    Location name and description
  Displays name, description, street view, and sources of current location
  Each source has a button that when clicked opens the source as a popup
  Next and prev buttons switch current list node and displays new location
