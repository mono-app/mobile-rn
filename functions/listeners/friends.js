const functions = require('firebase-functions');
const admin = require("firebase-admin");
const moment = require("moment");

const Room = require("../lib/room");

function Friends(){}

Friends.triggerNewFriendRequest = functions.region("asia-east2").firestore.document("/friendRequest/{receiverEmail}/people/{requestorEmail}").onCreate(async (documentSnapshot, context) => {
  const { receiverEmail, requestorEmail } = context.params;
  
  // notify receiver that requestor is requesting to be a friend
  // search if FriendRequest bot has room with the receiver
  const BOT_NAME = "FriendRequest";
  const db = admin.firestore();
  const botQuery = new admin.firestore.FieldPath("audiencesQuery", BOT_NAME);
  const receiverQuery = new admin.firestore.FieldPath("audiencesQuery", receiverEmail);
  const roomRef = await db.collection("rooms").where(botQuery, "==", true).where(receiverQuery, "==", true).get();
  
  // create room first before sending a message to the bot
  const arrRooms = roomRef.docs.map((documentSnapshot) => documentSnapshot.ref);
  if(roomRef.empty){
    const newRoomRef = await Room.createBotRoom(BOT_NAME, [BOT_NAME, receiverEmail]);
    arrRooms.push(newRoomRef);
  }

  // get requestor details to be sent by the bot
  const requestorRef = await db.collection("users").doc(requestorEmail).get();
  const requestor = requestorRef.data();

  await Promise.all(arrRooms.map(async (roomRef) => {
    const messageRef = roomRef.collection("messages").doc();
    const details = Object.assign({ targetEmail: requestorRef.id }, documentSnapshot.data());
    await messageRef.set({
      content: `${requestor.applicationInformation.nickName} ingin berteman dengan kamu. Lihat sekarang!`,
      senderEmail: BOT_NAME, localSentTime: admin.firestore.Timestamp.fromMillis(new moment().valueOf()),
      readBy: [], sentTime: admin.firestore.FieldValue.serverTimestamp(), type: "friend-request", details
    })
  }))
})

module.exports = Friends;