$(function() {

    console.log("ready");
    
    //declaring variables
    var currentLocation = "",
        destination = "",
        startLon = 0,
        startLat = 0,
        endLon = 0,
        endLat = 0;
        userName = "",
        departureTime = "",
        arrivalTime = "",
        passengers = 0,
        uberClientID = "ojF1HzMnEg2VGCONbMWdqnjUdsDxJmsU",
        uberServerToken = "AWIcb5H_Chv5WH7cV7kyW95D-nM1Tb8n2vRbgMlG",
        uberURL = "",
        googleGeocodeAPIKey = "AIzaSyCPSBM6KMAJJxjGS9vfrJblGzVKfD26VbE",
        googleMapsAPIKey = "AIzaSyBS-0csDaAZvjBkMpoKI0YaAA3t0BJw1z8",
        googleURL = "";
    
    //initializing Firebase
    var config = {
        apiKey: "AIzaSyDLiMqIB_sTo5BmeluSCwtwBB0r0cKiQ0U",
        authDomain: "project-1-c6c0c.firebaseapp.com",
        databaseURL: "https://project-1-c6c0c.firebaseio.com",
        projectId: "project-1-c6c0c",
        storageBucket: "project-1-c6c0c.appspot.com",
        messagingSenderId: "157899091270"
    };
    firebase.initializeApp(config);
    
    var database = firebase.database();

    //on click event for form submission
    $("#submit").on("click", function(event) {

        event.preventDefault();

        //gather inputs from form
        currentLocation = $("#currentLocation").val().trim();
        destination = $("#destination").val().trim();
        departureTime = $("#departureTime").val().trim();
        passengers = $("#passengers").val().trim();

        console.log(currentLocation);
        console.log(destination);
        console.log(departureTime);
        console.log(passengers);

        currentLocation = currentLocation.split(" ").join("+");
        destination = destination.split(" ").join("+");

        console.log(currentLocation);
        console.log(destination);

        googleURLStart = "https://maps.googleapis.com/maps/api/geocode/json?address=" + currentLocation + "&key=" + googleGeocodeAPIKey;
        googleURLEnd = "https://maps.googleapis.com/maps/api/geocode/json?address=" + destination + "&key=" + googleGeocodeAPIKey;

        //make AJAX call to Google Geocode API
        $.ajax({
            url: googleURLStart,
            method: "GET"
        }).then(function (response) {
            console.log(response);
            console.log(response.results[0].geometry.location);
        });

        //make AJAX call to Google Geocode API
        $.ajax({
            url: googleURLEnd,
            method: "GET"
        }).then(function (response) {
            console.log(response);
            console.log(response.results[0].geometry.location);
        });

        //make AJAX call to Uber API
        $.ajax({
            url: uberURL,
            method: "GET"
        }).then(function (response) {
            console.log(response);
        });
    });
});