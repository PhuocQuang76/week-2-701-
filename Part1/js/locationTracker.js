
window.onload = init;

var startLatitude, startLongitude;
let currentLatitude, currentLongitude;
let updateNo = 1;
var map = null; // Google map
var path = [];  // Path
var lastMarker = null;

// register the event handler for the button
function init() {
    let startButton = document.getElementById("startButton");
    startButton.addEventListener("click", getLocation =() =>{
        let options = {
            enableHighAccuracy: true,
            timeout: 50000,
            maximumAge: 0
        };

        navigator.geolocation.getCurrentPosition(
            displayLocation, handleError, options);

    },{once : true});

    // var pathButton = document.getElementById("pathButton");
    // pathButton.onclick = showSamplePath;
    // function getLocation() {
    //     // asynchronous call with callback success,
    //     // error functions and options specified
    //
    //     var options = {
    //         enableHighAccuracy: true,
    //         timeout: 50000,
    //         maximumAge: 0
    //     };
    //
    //     navigator.geolocation.getCurrentPosition(
    //         displayLocation, handleError, options);
    //
    // }


    function displayLocation(position) {
        startLatitude = position.coords.latitude;
        startLongitude = position.coords.longitude;
        currentLatitude = position.coords.latitude;
        currentLongitude = position.coords.longitude;

        document.getElementById("version").innerHTML =
            "Update#: " + updateNo;
        document.getElementById("startLatitude").innerHTML =
            "Start Latitude: " + startLatitude;
        document.getElementById("startLongitude").innerHTML =
            "Start Longitude: " + startLongitude;
        document.getElementById("currentLatitude").innerHTML =
            "Start Latitude: " + position.coords.latitude;
        document.getElementById("currentLongitude").innerHTML =
            "Start Longitude: " + position.coords.longitude;


        // Show the google map with the position
        showOnMap(position.coords);
        // first st
        var latlong = new google.maps.LatLng(startLatitude, startLongitude);
        path.push(latlong);

        setInterval(() => {
            showSamplePath(latlong);
        }, 5000);

    }

    function handleError(error) {
        switch (error.code) {
            case 1:
                updateStatus("The user denied permission");
                break;
            case 2:
                updateStatus("Position is unavailable");
                break;
            case 3:
                updateStatus("Timed out");
                break;
        }
    }

    function updateStatus(message) {
        document.getElementById("status").innerHTML =
            "<strong>Error</strong>: " + message;
    }

// initialize the map and show the position
    function showOnMap(pos) {

        var googlePosition =
            new google.maps.LatLng(pos.latitude, pos.longitude);

        var mapOptions = {
            zoom: 15,
            center: googlePosition,
            mapTypeId: google.maps.MapTypeId.ROADMAP
        };

        var mapElement = document.getElementById("map");
        map = new google.maps.Map(mapElement, mapOptions);

        // add the marker to the map
        var title = "Location Details";
        var content = "Lat: " + pos.latitude +
            ", Long: " + pos.longitude;

        addMarker(map, googlePosition, title, content);
    }

// add position marker to the map
    function addMarker(map, latlongPosition, title, content) {

        var options = {
            position: latlongPosition,
            map: map,
            title: title,
            clickable: true
        };
        var marker = new google.maps.Marker(options);

        var popupWindowOptions = {
            content: content,
            position: latlongPosition
        };

        var popupWindow = new google.maps.InfoWindow(popupWindowOptions);

        google.maps.event.addListener(marker, 'click', function () {
            popupWindow.open(map);
        });

        return marker;
    }


    function showSamplePath(latlong) {
        updateNo++;
        currentLatitude += Math.random() / 100;
        currentLongitude -= Math.random() / 100;

        document.getElementById("version").innerHTML =
            "Update#: " + updateNo;
        document.getElementById("currentLatitude").innerHTML =
            "Current Latitude: " + currentLatitude;
        document.getElementById("currentLongitude").innerHTML =
            "Current Longitude: " + currentLongitude;

        // next point
        latlong = new google.maps.LatLng(currentLatitude, currentLongitude);
        path.push(latlong);


        var line = new google.maps.Polyline({
            path: path,
            strokeColor: '#0000ff',
            strokeOpacity: 1.0,
            strokeWeight: 3
        });
        line.setMap(map);

        map.panTo(latlong);

        if (lastMarker)
            lastMarker.setMap(null);
        // add the new marker
        lastMarker = addMarker(map, latlong, "Your new location", "You moved to: " + startLatitude + ", " + startLongitude);
    }
}













