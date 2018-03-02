
window.onload = function() {
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

    // other OS (Development environment)
    hello(new Date().getTime());
}

function hello(timeMillis) {
    return;
}
