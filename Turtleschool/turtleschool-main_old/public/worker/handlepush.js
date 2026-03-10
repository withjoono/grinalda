self.addEventListener('push', function (event) {
  const data = JSON.parse(event.data.text());
  event.waitUntil(
    self.registration
      .showNotification(data.title, {
        body: data.message,
        icon: '/pwa-logo-192x192.png',
      })
      .catch(e => {
        console.log(e);
      }),
  );
});

self.addEventListener('notificationclick', function (event) {
  event.notification.close();

  // This looks to see if the current is already open and
  // focuses if it is
  event.waitUntil(
    clients
      .matchAll({
        type: 'window',
      })
      .then(function (clientList) {
        for (var i = 0; i < clientList.length; i++) {
          var client = clientList[i];
          if (client.url == '/' && 'focus' in client) return client.focus();
        }
        if (clients.openWindow) return clients.openWindow('/consulting/Consulting');
      }),
  );
});

self.addEventListener('pushsubscriptionchange', e => {
  console.log(e);
});
