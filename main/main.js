var map = null;
var FIRST_POSITION_COORD = [35.681167, 139.767052];
var FIRST_POSITION_ZOOM = 11;

var myPositionMarker = null;

const BEACON_COORDINATES = [
    [39.70319718460974, 141.13568971105417],
    [39.70263696121417, 141.13627825612957],
    [39.70230017895931, 141.136553629643],
    [39.70188497701128, 141.13706503754975],
    [39.70139217940158, 141.13698567524352],
    [39.7017438242472, 141.13650108950878],
    [39.70198815857398, 141.1361345209707],
    [39.702671235872735, 141.13608286227543],
    [39.70278349618237, 141.13570020048326],
    [39.70261022462722, 141.13545066942368],
    [39.70235459957511, 141.13567108022494]
];

function createGSIMapTileLayers(dictMapNameAndMapPath) {
    var _list = [];
    var _mapNameTileDict = {};

    for (var key in dictMapNameAndMapPath) {
        var mapName = key;
        var mapPath = dictMapNameAndMapPath[key];

        var tileLayer = L.tileLayer('https://cyberjapandata.gsi.go.jp/xyz/'+mapPath+'/{z}/{x}/{y}.png', {
            attribution: '<a href="http://maps.gsi.go.jp/development/ichiran.html" target="_blank">地理院タイル</a>'
        });

        _list.push(tileLayer);
        _mapNameTileDict[key] = tileLayer;
    }

    return {
        list: _list,
        mapNameTilePairs: _mapNameTileDict
    };
}

window.onload = function() {
    var tileLayers = createGSIMapTileLayers({
        '標準地図': 'std',
        '淡色地図': 'pale',

        /* 
        404 Not found:
        'English': 'english',
        '土地条件図（初期整備版）': 'lcm25k',
        '火山基本図': 'vbm',
        '土地利用図': 'lum200k',
        '湖沼図': 'lake1',
        '白地図': 'blank',
        '写真': 'seamlessphoto',
        '色別標高図': 'relief',
        '活断層図': 'afm',
        '陰影起伏図': 'hillshademap',
        */
    });

    map = L.map('map', {
        center: FIRST_POSITION_COORD,
        zoom: FIRST_POSITION_ZOOM,
        layers: tileLayers.list
    });

    L.control.layers(tileLayers.mapNameTilePairs).addTo(map);

    for (var i=0; i<BEACON_COORDINATES.length; i++) {
        var beaconCoordinate = BEACON_COORDINATES[i];
        
        L.marker(beaconCoordinate, {
            draggable: true,
            opacity: 0.5
        })
        .addTo(map);
    }

    map.fitBounds(BEACON_COORDINATES);

    callbackToNative("ready");
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
    if (map == null) {
        return;
    }

    var coordinate = [latitude, longitude];

    if (myPositionMarker == null) {
        myPositionMarker = L
            .marker(coordinate)
            .addTo(map);
    }
    else {
        myPositionMarker
            .setLatLng(coordinate);
    }
    
    map.setView(coordinate);
}
