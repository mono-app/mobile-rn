const functions = require("firebase-functions");
const OpenTok = require("opentok");
const moment = require("moment");

function RoomListener(){}

RoomListener.triggerNewRoom = functions.region("asia-east2").firestore.document("/rooms/{roomId}").onCreate((documentSnapshot, context) => {
  if(documentSnapshot.data().type !== "chat") return Promise.resolve(true);

  const handleSessionCreated = async (sessionId, resolve) => {
    const payload = { liveVoice: {session: sessionId} };
    await documentSnapshot.ref.update(payload);
    resolve(true);
  };

  const API_KEY = functions.config().tb.api;
  const API_SECRET = functions.config().tb.secret;
  const OT = new OpenTok(API_KEY, API_SECRET);

  return new Promise((resolve, reject) => {
    OT.createSession((err, session) => {
      if(err) reject(err);
      else handleSessionCreated(session.sessionId, resolve);
    });
  })
})

module.exports = RoomListener;