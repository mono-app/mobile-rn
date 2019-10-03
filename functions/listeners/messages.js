const functions = require('firebase-functions');
const admin = require("firebase-admin");

function Messages(){}

Messages.triggerNewMessage = functions.region("asia-east2").firestore.document("/rooms/{roomId}/messages/{messageId}").onCreate(async (documentSnapshot, context) => {
  const { roomId, messageId } = context.params;
  const db = admin.firestore();
  const roomRef = db.collection("rooms").doc(roomId);
  console.log(documentSnapshot.data());
  const message = (await roomRef.collection("messages").doc(messageId).get()).data();
  return db.collection("rooms").doc(roomId).update({
    "lastMessage.message": message.content,
    "lastMessage.sentTime": message.sentTime
  })
})

module.exports = Messages;