$(function () {

    console.log("ready");

    //declaring variables
    var currentLocation = "",
        destination = "",
        startLng = 0,
        startLat = 0,
        endLng = 0,
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


    //variables for parking time in UNIX
      //  var startParkingString = moment(departureTime).add(30,"minutes").format('LT')
       // console.log(startParkingString);
        //var startParkingNumber = parseFloat(startTimeAsUNIXString);
        //console.log("UNIX NUMBER:"+startTimeAsUNIXNumber)
       // var endTimeAsUNIXstring = startTimeAsUNIXNumber + 1800;
        //console.log(endTimeAsUNIXstring);

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
 
    
    //once lat and long have been stored, use them to do a call to the Uber API
    function uberAPICall() {

        //make AJAX call to Uber API ***does not currently work***
        $.ajax({
            url: "https://api.uber.com/v1.2/estimate",
            method: "POST",
            headers: {
                Authorization: "Bearer " + uberServerToken,
            },
            data: {
                start_latitude: startLat,
                start_longitude: startLng,
                end_latitude: endLat,
                end_longitude: endLng,
                product_id: "821415d8-3bd5-4e27-9604-194e4359a449"
            }
        }).then(function(response) {
            console.log(response);
        });
    };

    //on click event for form submission
    $("#submit").on("click", function (event) {

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
            url: googleURLEnd,
            method: "GET"
        }).then(function (response) {
            console.log(response);

            endLat = response.results[0].geometry.location.lat;
            endLng = response.results[0].geometry.location.lng;

            console.log(endLat);
            console.log(endLng);

            uberURL = "https://api.uber.com/v1.2/products?latitude=" + endLat + "&longitude=" + endLng;

        });

        //make AJAX call to Google Geocode API, set to be delayed
        $(document).setTimeout(function() {
            $.ajax({
                url: googleURLStart,
                method: "GET"
            }).then(function (response) {
                console.log(response);

                startLat = response.results[0].geometry.location.lat;
                startLng = response.results[0].geometry.location.lng;

                console.log(startLat);
                console.log(startLng);

            uberAPICall();
        });
        database.ref().push({
            currentLocation : currentLocation,
            destination : destination,
            departureTime : departureTime,
            passengers : passengers,
            timeAdded: firebase.database.ServerValue.TIMESTAMP
    });
   }, 10000);

    });
   
});