//initializing firebase
var config = {
  apiKey: "AIzaSyCNa_EJptD_QVj8fmYwYHSX2JkRjEQnJDA",
  authDomain: "chugga-chugga-choo-choo-a5353.firebaseapp.com",
  databaseURL: "https://chugga-chugga-choo-choo-a5353.firebaseio.com",
  projectId: "chugga-chugga-choo-choo-a5353",
  storageBucket: "",
  messagingSenderId: "975769309691"
};

firebase.initializeApp(config);

var database = firebase.database();
//defining vars
var name;
var destination;
var starttime;
var frequency;
var nextTrain;
var minutesAway;
var starttime;
var timeRemaining;
//sets the var new row to a dynamic html row element
var newRow = $("<tr>");

database
  .ref()
  .once("value")
  .then(function(snapshot) {
    snapshot.forEach(function(childSnapshot) {
      var oldRow = $("<tr>");
      //sets vars equal to the values pulled from the database
      name = childSnapshot.val().name;
      timeRemaining = childSnapshot.val().timeRemaining;
      destination = childSnapshot.val().destination;
      starttime = childSnapshot.val().starttime;
      frequency = childSnapshot.val().frequency;
      nextTrain = childSnapshot.val().nextTrain;
      
      //appending the database stored values to the html table
      oldRow.append($("<td>").text(name));
      oldRow.append($("<td>").text(destination));
      oldRow.append($("<td>").text(frequency));
      oldRow.append($("<td>").text(nextTrain));
      oldRow.append($("<td>").text(timeRemaining));
      $(".train-list").append(oldRow);
    });
  });

$("#add-train").on("click", function(e) {
  //preventing the code from running by default
  e.preventDefault();
  //setting input vars
  name = $("#input-name")
    .val()
    .trim();
  destination = $("#input-destination")
    .val()
    .trim();
  starttime = $("#input-starttime").val();
  frequency = $("#input-frequency")
    .val()
    .trim();
  //making our user input a moment object and setting the format to military time
  starttime = moment(starttime, "HH:minutes");

  //formating the users time input so it can be pushed to the DB
  var starttimeText = starttime.format("LT");

  // var newCol = $("<td>");
  newRow.append($("<td>").text(name));
  newRow.append($("<td>").text(destination));
  newRow.append($("<td>").text(frequency));

  //getting the current time moment
  var currentTime = moment();

  //setting var equal to diff between current time and start time
  var leftovers = moment(currentTime).diff(starttime, "minutes");
  //frequency minus the modulus of the frequency to get how many minutes away our train is
  timeRemaining = frequency - (leftovers % frequency);
  //adds the remainng time to the current time to get the time of arrival of the next rain
  nextTrain = moment().add(timeRemaining, "minutes");

  newRow.append($("<td>").text(nextTrain));
  newRow.append($("<td>").text(timeRemaining));

  $(".train-list").append(newRow);
  //database push info
  database.ref().push({
    name: name,
    destination: destination,
    starttime: starttimeText,
    frequency: frequency,
    nextTrain: nextTrain.toString(),
    timeRemaining: timeRemaining.toString()
  });
});
database.ref().on(
  "child_added",
  function(childSnapshot) {
    console.log(childSnapshot.val().name);
  },
  function(errorObject) {
    console.log("Errors Handled " + errorObject.code);
  }
);
