const notifier = require('node-notifier');
const sendNotification = (title, message) => {
    notifier.notify({
      title: title,
      message: message,
    });
  };
module.exports = {sendNotification};