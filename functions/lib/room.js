const admin = require("firebase-admin");
const functions = require("firebase-functions");
const OpenTok = require("opentok");

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

Room.normalize = async () => {
  const API_KEY = functions.config().tb.api;
  const API_SECRET = functions.config().tb.secret;
  const OT = new OpenTok(API_KEY, API_SECRET);

  const db = admin.firestore();
  const roomRef = db.collection("rooms").where("type", "==", "chat");
  const querySnapshot = await roomRef.get();
  querySnapshot.forEach((documentSnapshot) => {
    const room = documentSnapshot.data();
    if(room.liveVoice === undefined){
      OT.createSession(async (err, session) => {
        if(err) console.log(err);
        else{
          const payload = { liveVoice: {session: session.sessionId} };
          await documentSnapshot.ref.update(payload);
        }
      })
    }
  })
}

module.exports = Room;
