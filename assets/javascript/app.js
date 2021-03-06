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
        passengers = 1,
        parkingPrice = 0,
        drivingPrice = 0,
        drivingDuration,
        distance = 0,
        uberXDuration = 0,
        parkWhizAPIKey = "c58c2efc75d096c933b115d1d19e590bc31c9e21",
        uberClientID = "ojF1HzMnEg2VGCONbMWdqnjUdsDxJmsU",
        uberServerToken = "AWIcb5H_Chv5WH7cV7kyW95D-nM1Tb8n2vRbgMlG",
        uberURL = "",
        googleGeocodeAPIKey = "AIzaSyCPSBM6KMAJJxjGS9vfrJblGzVKfD26VbE",
        googleMapsAPIKey = "AIzaSyBS-0csDaAZvjBkMpoKI0YaAA3t0BJw1z8",
        googleURL = "";

    //Moment.JS
    var startTimeAsUNIXString = moment().format('X')
    console.log(startTimeAsUNIXString);
    var startTimeAsUNIXNumber = parseFloat(startTimeAsUNIXString);
    var endTimeAsUNIXstring = startTimeAsUNIXNumber + 1800;
    console.log(endTimeAsUNIXstring);

    //once lat and long have been stored, use them to do a call to the Uber API
    function uberAPICall() {

        //make AJAX call to Uber API
        $.get("https://api.uber.com/v1/estimates/price?start_latitude=" + startLat + "&start_longitude=" + startLng + "&end_latitude=" + endLat + "&end_longitude=" + endLng + "&server_token=" + uberServerToken, function (response) {

            //parse data from Uber API call and converting duration from seconds to minutes
                distance = response.prices[5].distance;
                uberXDuration = response.prices[5].duration / 60;
                
            var uberXPrice = response.prices[5].estimate,
                uberPoolDuration = (response.prices[2].duration / 60) + "+",
                uberPoolPrice = response.prices[2].estimate;

            //calculate the cost of driving using constant 12.9 c/km
            //var drivingPrice = Math.round((distance * 0.129) + parkingPrice);

            //calculate the cost duration using a constant average speed of 55 km/h 
            //var drivingDuration = Math.ceil((distance / 55) * 60);

            var uberXPrice = response.prices[5].estimate,
                uberPoolDuration = (response.prices[2].duration / 60) + "+",
                uberPoolPrice = response.prices[2].estimate;

            //fill in table with Uber price and duration
            $("#uberXPrice").text(uberXPrice);
            $("#uberXDuration").text(uberXDuration);
            $("#uberPoolPrice").text(uberPoolPrice);
            $("#uberPoolDuration").text(uberPoolDuration);

            //$("#drivingPrice").text(drivingPrice);
            //$("#drivingDuration").text(drivingDuration);

            parkingwhizAPICall();
        });
    };

    function parkingwhizAPICall() {
        var queryURL = "https://api.parkwhiz.com/search/?lat=" + endLat + "&lng=" + endLng + "&start=" + startTimeAsUNIXString + "&end=" + endTimeAsUNIXstring + "&key=c338b416a2579b7f332aca83bdce28d417c8a7ce";

        $.ajax({
            url: queryURL,
            method: "GET"
        }).done(function (response) {
            console.log(response);

            parkingPrice = (response.min_price + response.max_price) / 2;

            console.log(parkingPrice);
            console.log(distance);

            drivingPrice = Math.round((distance * 0.129) + parkingPrice);
            $("#drivingPrice").text(drivingPrice);
            $("#drivingDuration").text(uberXDuration);
        });
    };

    /*
    function parkwhizAPICall() {
        $.get("https://api.parkwhiz.com/v4/quotes/?q=coordinates:" + endLat + "," + endLng + "&start_time=2018-07-14T12:00&end_time=2018-07-14T13:00&api_key=" + parkWhizAPIKey, function (response) {
            console.log(response);
            for (i = 0; i < 3; i++) {
                parkingPrices += parseInt(response[i].purchase_options[0].price.USD);
            }
            parkingPrice = parkingPrices / 3;

            //calculate the cost of driving using constant 12.9 c/km
            var drivingPrice = Math.round((distance * 12.9) + parkingPrice);

            //calculate the cost duration using a constant average speed of 55 km/h 
            var drivingDuration = Math.ceil(((distance / 55) * 60) * 100);

            //getGas();

            $("#drivingPrice").text(drivingPrice);
            $("#drivingDuration").text(drivingDuration);
        });
    };

    */

    

    function getGas() {
        // console.log(endLat)
        // console.log(endLng);
        var gasQuery = "http://devapi.mygasfeed.com/stations/radius/" + endLat + "/" + endLng + "/10/reg/distance/rfej9napna.json";
        // console.log("gas query url:"+gasQuery);
        $.ajax({
            url: gasQuery,
            method: "GET"
        }).then(function (response) {
            console.log(response);
            console.log(JSON.parse(response));
            /*
            var gas = {};
            if (response.stations.length === 0) {
                gas = { exists: false };
            } else {
                var i = 0;
                while (response.stations[i].reg_price === "N/A") {
                    i++;
                    if (i === response.stations.length) { break; }
                }
                var price = response.stations[i].reg_price;
                //var outputRow = $("<tr>");
                //outputRow.html("")
                gas = {
                    exists: true,
                    "price": price
                };
                console.log("gas: " + gas);
            }
            drivingPrice = Math.round((distance * 12.9) + parkingPrice);
            $("#drivingPrice").text(drivingPrice);
            $("#drivingDuration").text(uberXDuration);
            */
        })
    }


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
        console.log("Departure Time:" + departureTime);
        console.log(passengers);

        //reset form after values are taken
        $("form").trigger("reset");

        //convert to the form that the Google Geocode API takes
        currentLocation = currentLocation.split(" ").join("+");
        destination = destination.split(" ").join("+");
        googleURLStart = "https://maps.googleapis.com/maps/api/geocode/json?address=" + currentLocation + "&key=" + googleGeocodeAPIKey;
        googleURLEnd = "https://maps.googleapis.com/maps/api/geocode/json?address=" + destination + "&key=" + googleGeocodeAPIKey;

        //make AJAX call to Google Geocode API
        $.ajax({
            url: googleURLEnd,
            method: "GET"
        }).then(function (response) {
            endLat = response.results[0].geometry.location.lat;
            endLng = response.results[0].geometry.location.lng;
        });

        //make AJAX call to Google Geocode API, set to be delayed
        setTimeout(function () {

            $.ajax({
                url: googleURLStart,
                method: "GET"
            }).then(function (response) {
                startLat = response.results[0].geometry.location.lat;
                startLng = response.results[0].geometry.location.lng;

                uberAPICall();
                getGas();
            });

            database.ref().push({
                currentLocation: currentLocation,
                destination: destination,
                departureTime: departureTime,
                passengers: passengers,
                timeAdded: firebase.database.ServerValue.TIMESTAMP
            });
            uberAPICall();
        }, 1000);
    });
});