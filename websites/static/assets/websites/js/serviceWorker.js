// https://stackoverflow.com/questions/30054543/google-chrome-push-notifications-without-browser-running
// https://stackoverflow.com/questions/39201067/does-service-worker-runs-on-background-even-if-browser-is-closed
// Example navigatorPush.service.js file
function notifyMe() {
          // Let's check if the browser supports notifications
    // if (!("Notification" in window)) {
    //     alert("This browser does not support system notifications");
    // }

    // Let's check whether notification permissions have already been granted
    console.log('Notification.permission ', Notification.permission);
    if (Notification.permission === "granted") {
         // If it's okay let's create a notification
        // var notification = new Notification("Hi there!");
    }

    // Otherwise, we need to ask the user for permission
    else if (Notification.permission !== 'denied') {
        Notification.requestPermission(function (permission) {
        // If the user accepts, let's create a notification
        if (permission === "granted") {
            // var notification = new Notification("Hi there!");
        }
        });
    }
    console.log('Notification.permission ', Notification.permission);

}
var getTitle = function (title) {
	console.log('hoang get title');
    if (title === "") {
        title = "TITLE DEFAULT";
    }
    return title;
};
var getNotificationOptions = function (message, message_tag) {
    // https://developers.google.com/web/fundamentals/push-notifications/display-a-notification
    var options = {
            body: message,
            icon: '/img/icon_120.png',
            tag: message_tag,
            vibrate: [200, 100, 200, 100, 200, 100, 200]
    };
    return options;
};

self.addEventListener('install', function (event) {
        notifyMe();
        self.skipWaiting();
});

self.addEventListener('push', function(event) {
	console.log('hoang push', event.notification);
    console.log('err ', event.data.text());
    notifyMe();
    

    try {
            // Push is a JSON
            var response_json = event.data.json();
            console.log('response_json ', response_json);
            var title = response_json.subject;
            var message = response_json.message;
            var message_tag = response_json.tag;
    } catch (err) {
            console.log('err ', err);

            // Push is a simple text
            var title = "";
            var message = event.data.text();
            var message_tag = "";
    }
    self.registration.showNotification(getTitle(title), getNotificationOptions(message, message_tag));
    // Optional: Comunicating with our js application. Send a signal
    self.clients.matchAll({includeUncontrolled: true, type: 'window'}).then(function (clients) {
            clients.forEach(function (client) {
                    client.postMessage({
                            "data": message_tag,
                            "data_title": title,
                            "data_body": 'message'});
                    });
    });
});

// Optional: Added to that the browser opens when you click on the notification push web.
self.addEventListener('notificationclick', function(event) {
    // Android doesn't close the notification when you click it
    // See http://crbug.com/463146
    event.notification.close();
    // Check if there's already a tab open with this URL.
    // If yes: focus on the tab.
    // If no: open a tab with the URL.
    event.waitUntil(clients.matchAll({type: 'window', includeUncontrolled: true}).then(function(windowClients) {
            for (var i = 0; i < windowClients.length; i++) {
                var client = windowClients[i];
                if ('focus' in client) {
                        return client.focus();
                }
            }
        })
    );
});

