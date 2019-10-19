const admin = require("firebase-admin");
const Room = require("./room");
const moment = require("moment");

function Bot(){}

Bot.sendBotMessage = async (botName, receiverUserEmail, customValueObj, content, type) => {
  const db = admin.firestore();
  // search if bot has room with the receiver

  const BOT_NAME = botName;
  const botQuery = new admin.firestore.FieldPath("audiencesQuery", BOT_NAME);
  const receiverQuery = new admin.firestore.FieldPath("audiencesQuery", receiverUserEmail);
  const roomQuerySnapshot = await db.collection("rooms").where(botQuery, "==", true).where(receiverQuery, "==", true).get();

  // create room first before sending a message to the bot
  const arrRooms = roomQuerySnapshot.docs.map((documentSnapshot) => documentSnapshot.ref);
  if(roomQuerySnapshot.empty){
    const newRoomRef = await Room.createBotRoom(BOT_NAME, [BOT_NAME, receiverUserEmail]);
    arrRooms.push(newRoomRef);
  }

  return await Promise.all(arrRooms.map(async (roomRef) => {
    const messageRef = roomRef.collection("messages").doc();
    await messageRef.set({
      content,
      senderEmail: BOT_NAME, localSentTime: admin.firestore.Timestamp.fromMillis(new moment().valueOf()),
      readBy: {}, sentTime: admin.firestore.FieldValue.serverTimestamp(), type, details: customValueObj
    })

  }))
}


module.exports = Bot;
