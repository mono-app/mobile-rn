const functions = require('firebase-functions');
var admin = require("firebase-admin");
var serviceAccount = require("./serviceAccountKey.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://chat-app-fdf76.firebaseio.com"
});


var message = {
  android: { notification: {channelId: "message-notification"} },
  notification: { 
    title: "bagaimana cara membuat donat?", 
    body: "Jelaskan deskripsinya"
  },
  data: {
    type: "new-discussion",
    discussionId: "XmJxBRVqYuCW7UdB3XpG",
    schoolId: "1hZ2DiIYSFa5K26oTe75",
    classId: "NWNfzx09U8HpxfXZMAEM",
    taskId:"J76mQkaDnBqGqY4SLr7K"
  },
  token: "cRIc1aDSWJg:APA91bHcSortyRVyqihs8LQvR2iB2s9EUFd4ungAFw_avPRi0zz5BtsP7XQ-m_a7SlBb1g7o5I57bzoDfRpYTyP2k_nrmJ0Z77-ruXKC4gr_7zrlvbysqJn2UOovA6rA-5hgIpSGVBGo",
};

// Send a message to the device corresponding to the provided
// registration token.
admin.messaging().send(message)
  .then((response) => {
    // Response is a message ID string.
    console.log('Successfully sent message:', response);
  })
  .catch((error) => {
    console.log('Error sending message:', error);
  });