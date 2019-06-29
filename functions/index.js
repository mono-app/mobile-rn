const functions = require('firebase-functions');
const admin = require("firebase-admin");
const serviceAccount = require("./chat-app-fdf76-firebase-adminsdk-zmt06-683706239d.json");

admin.initializeApp({
  credential: admin.credential.applicationDefault(),
})

exports.sendNotificationForNewMessage = functions.region("asia-east2").firestore.document("/rooms/{roomId}/messages/{messageId}").onCreate(async (documentSnapshot, context) => {
  const messageDocument = documentSnapshot.data();
  const { senderEmail } = messageDocument;
  const { roomId } = context.params;
  
  // get all audiences except sender
  const db = admin.firestore();
  const roomRef = db.collection("rooms").doc(roomId);
  const roomSnapshot = await roomRef.get();
  const roomDocument = roomSnapshot.data();
  const audiences = Object.keys(roomDocument.audiences).filter(audience => audience !== senderEmail);
  
  // get all audiences messagingToken  
  const promises = audiences.map(audience => {
    const userRef = db.collection("users").doc(audience);
    return userRef.get();
  })
  const audiencesSnapshot = await Promise.all(promises);
  const audiencesData = audiencesSnapshot.map(audienceSnapshot => {
    const audienceData = audienceSnapshot.data();
    if(audienceData.tokenInformation){
      if(audienceData.tokenInformation.messagingToken) return audienceData;
    }
  });

  // send notification to all audiences except sender
  const messagePromises = audiencesData.map(audienceData => {
    const message = {
      token: audienceData.tokenInformation.messagingToken,
      android: { notification: {channelId: "message-notification"} },
      notification: { title: audienceData.applicationInformation.nickName, body: messageDocument.message }
    }
    return admin.messaging().send(message);
  })

  await Promise.all(messagePromises);
  return Promise.resolve(true);
})
