const admin = require("firebase-admin");

function Room(){}

Room.createBotRoom = async (botName, audiences) => {
  const audiencesQuery = {};
  audiences.forEach((audience) => audiencesQuery[audience] = true);

  const db = admin.firestore();
  const newRoomRef = db.collection("rooms").doc();
  await newRoomRef.set({
    audiences, audiencesQuery, bot: botName, type: "bot",
    creationTime: admin.firestore.FieldValue.serverTimestamp()
  });
  return newRoomRef;
}

module.exports = Room;
