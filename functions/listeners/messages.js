const functions = require('firebase-functions');
const admin = require("firebase-admin");

function Messages(){}

Messages.triggerNewMessage = functions.region("asia-east2").firestore.document("/rooms/{roomId}/messages/{messageId}").onCreate((documentSnapshot, context) => {
  const { roomId } = context.params;
  const db = admin.firestore();
  const message = documentSnapshot.data()
  return db.collection("rooms").doc(roomId).update({
    "lastMessage.message": message.content,
    "lastMessage.sentTime": message.sentTime
  })
})

module.exports = Messages;