var mymap = null;
var FIRST_POSITION_COORD = [38.926133, 141.137863];
var FIRST_POSITION_ZOOM = 15;

var myPositionMarker = null;

window.onload = function() {
    mymap = L.map('mapid')
            .setView(FIRST_POSITION_COORD, FIRST_POSITION_ZOOM);

    L.tileLayer('https://cyberjapandata.gsi.go.jp/xyz/std/{z}/{x}/{y}.png', {
        attribution: '<a href="http://maps.gsi.go.jp/development/ichiran.html" target="_blank">地理院タイル</a>'
    })
    .addTo(mymap);

    callbackToNative("ready");

    var latitude = FIRST_POSITION_COORD[0];
    var longitude = FIRST_POSITION_COORD[1];
    setInterval(function() {
        updateMyPosition(latitude, longitude);

        latitude += 0.00001;
    }, 100);
};

function callbackToNative(eventName, parameters) {
    if (parameters == null) {
        parameters = {};
    }

    /*
    Detecting iOS / Android Operating system
    https://stackoverflow.com/a/21742107
    */
   
    var userAgent = navigator.userAgent || navigator.vendor || window.opera;

    // Windows Phone must come first because its UA also contains "Android"
    if (/windows phone/i.test(userAgent)) {
        // Not supports in my App
        return;
    }

    if (/android/i.test(userAgent)) {
        const CUSTOM_URL_SCHEME = "work.yusukesugawara.callback://";
        window.location.href = CUSTOM_URL_SCHEME + eventName + '/?' + JSON.stringify(parameters);
        return;
    }

    // iOS detection from: http://stackoverflow.com/a/9039885/177710
    if (/iPad|iPhone|iPod/.test(userAgent) && !window.MSStream) {
        webkit.messageHandlers.callbackHandler.postMessage({
            eventName: eventName,
            parameters: parameters
        });
        return;
    }
}

function updateMyPosition(latitude, longitude) {
    if (mymap == null) {
        return;
    }

    var coordinate = [latitude, longitude];

    if (myPositionMarker == null) {
        myPositionMarker = L
            .marker(coordinate)
            .bindPopup("You're here!")
            .addTo(mymap);
    }
    else {
        myPositionMarker
            .setLatLng(coordinate);
    }
    
    myPositionMarker.openPopup();
}
