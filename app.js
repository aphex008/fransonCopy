var textToPutOnClipboard;

/**
 * Get data from Franson browser gateway
 */
function sendAjaxRequest() {
    var nocache = ((new Date()).getTime().toString().substr(5));
    $.get('http://localhost:12175/gps/getGpsInfo?jsonp=CallbackMessage&noCache=' + nocache)
        .done(function (data) {
            eval(data);
        })
        .fail(function () {
            alert("Error: Querying for gps location.");
        })
    ;
}

/**
 * Callback for Franson browser request
 * @param JSON gps
 * @constructor
 */
function CallbackMessage(gps) {
    if (gps.status.permitted == false) {
        alert('Error: Request not permitted by user');
    } else {
        textToPutOnClipboard = gps.trackPoint.position.latitude + ', ' + gps.trackPoint.position.longitude;
        if (!document.execCommand('copy')) {
            alert('Error: Failed to exec copy command');
        };
    }
}

/**
 * Copy event listener
 */
document.addEventListener('copy', function (e) {
    e.preventDefault();
    e.clipboardData.setData('text/plain', textToPutOnClipboard);
});

/**
 * Bind events
 */
chrome.commands.onCommand.addListener(function (command) {
    if (command == 'copy-gps-location-to-clipboard') {
        sendAjaxRequest();
    }
});
chrome.browserAction.onClicked.addListener(function (tab) { //Fired when User Clicks ICON
    sendAjaxRequest();
});

