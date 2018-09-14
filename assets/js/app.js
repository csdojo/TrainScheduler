$(document).ready(function () {

    function currentMoment() {
        var today = new Date();
        var h = today.getHours();
        var m = today.getMinutes();
        var s = today.getSeconds();
        m = checkTime(m);
        s = checkTime(s);
        document.getElementById('clock').innerHTML =
            h + ":" + m + ":" + s;
        var t = setTimeout(currentMoment, 500);
    }
    function checkTime(i) {
        if (i < 10) { i = "0" + i };
        return i;
    }

    currentMoment();

    

    var config = {
        apiKey: "AIzaSyANPK23VYZso53124Ic1KdhJEmoDS9VyP8",
        authDomain: "classwork-164a3.firebaseapp.com",
        databaseURL: "https://classwork-164a3.firebaseio.com",
        projectId: "classwork-164a3",
        storageBucket: "classwork-164a3.appspot.com",
        messagingSenderId: "813167233968"
    };
    firebase.initializeApp(config);

    var database = firebase.database();

    $("#train-form").on("submit", function (event) {

        // prevent reload
        event.preventDefault();

        var firstTrain = $("#start-time").val().trim();

        var convertedfirstTrain = moment(firstTrain, "HH:mm A").format("hh:mm A");

        var trainInfo = {
            name: $("#name").val().trim(),
            destination: $("#destination").val().trim(),
            frequency: $("#frequency").val(),
            firstTrain: convertedfirstTrain,
        }
       
        database.ref().push(trainInfo);

        // clear out form fields
        $("#name").val("")
        $("#destination").val("")
        $("#start-time").val("")
        $("#frequency").val("")

    });


    // Add child_added firebase listener to retrieve and print all children (employee data) to the page on load and print every new employee to come after
    database.ref().on("child_added", function (childSnapshot) {

        console.log(childSnapshot.val());

        var name = childSnapshot.val().name;
        var destination = childSnapshot.val().destination;
        var frequency = childSnapshot.val().frequency;
        var firstTrain = childSnapshot.val().firstTrain;
       

        // First Time (pushed back 1 year to make sure it comes before current time)
        var firstTimeConverted = moment(firstTrain, "HH:mm A").subtract(1, "years");
        console.log(firstTimeConverted);

        // Current Time
        var currentTime = moment();
        console.log("CURRENT TIME: " + moment(currentTime).format("hh:mm A"));

        // Difference between the times
        var diffTime = moment().diff(moment(firstTimeConverted), "minutes");
        console.log("DIFFERENCE IN TIME: " + diffTime);

        // Time apart (remainder)
        var tRemainder = diffTime % frequency;
        console.log(tRemainder);

        // Minute Until Train
        var tMinutesTillTrain = frequency - tRemainder;
        console.log("MINUTES TILL TRAIN: " + tMinutesTillTrain);

        // Next Train
        var nextTrain = moment().add(tMinutesTillTrain, "minutes");
        console.log("ARRIVAL TIME: " + moment(nextTrain).format("hh:mm A"));




        // print info as a <tr> tag and append to the tbody
        var trainRow = $("<tr>").append(
            $("<td>").text(name),
            $("<td>").text(destination),
            $("<td>").text(frequency),
            $("<td>").text(moment(nextTrain).format("hh:mm A")),
            $("<td>").text(tMinutesTillTrain),

        );

        $("#train-table").append(trainRow);

    });

    


});