const functions = require('firebase-functions');
const admin = require("firebase-admin");
const Room = require("../lib/room");
const moment = require("moment");

function Moments(){}

Moments.triggerNewMoment = functions.region("asia-east2").firestore.document("/moments/{momentId}").onCreate(async (documentSnapshot, context) => {
  const momentDoc = documentSnapshot.data();
  const posterEmail = momentDoc.posterEmail

  // this trigger for auto add room audiences rooms collection  
  const db = admin.firestore();
  const friendListRef = db.collection("friendList").doc(posterEmail);
  const querySnapshot = await friendListRef.collection("people").get()

  const friendIdList = querySnapshot.docs.map(documentSnapshot => {
    return documentSnapshot.id
  })
  
  friendIdList.push(posterEmail)

  documentSnapshot.ref.update({showsTo: friendIdList})
  
  return Promise.resolve(true);
})

Moments.sendNotificationForNewMomentComment = functions.region("asia-east2").firestore.document("/moments/{momentId}/comments/{commentId}").onCreate(async (documentSnapshot, context) => {
  const commentDoc = documentSnapshot.data();
  const { momentId } = context.params;

  const db = admin.firestore();

  const momentDocRef = db.collection("moments").doc(momentId)
  const momentSnapshot = await momentDocRef.get()
  const receiverEmail = momentSnapshot.data().posterEmail

  const peopleCommentEmail = commentDoc.peopleEmail
  // check if the person commented is not the creator of the moment
  if(peopleCommentEmail!==receiverEmail){
    const receiverDocRef = db.collection("users").doc(receiverEmail)
    const receiverSnapshot = await receiverDocRef.get()
    const receiverData = receiverSnapshot.data()

    if(receiverData && receiverData.tokenInformation && receiverData.tokenInformation.messagingToken){
      const message = {
        token: receiverData.tokenInformation.messagingToken,
        android: { 
          notification: {channelId: "moment-notification"}
        },
        data: {
          type: "moment-comment",
          momentId: momentId
        },
        notification: { title: receiverData.applicationInformation.nickName+ " mengomentari moment kamu" }
      }
      admin.messaging().send(message);
    }

    const userDocRef = db.collection("users").doc(peopleCommentEmail)
    const peopleCommentSnapshot = await userDocRef.get()
    const peopleCommentData = peopleCommentSnapshot.data()

    // notify moment's creator
    // search if Moment bot has room with the receiver
    const BOT_NAME = "Moment";
    const botQuery = new admin.firestore.FieldPath("audiencesQuery", BOT_NAME);
    const receiverQuery = new admin.firestore.FieldPath("audiencesQuery", receiverEmail);
    const roomQuerySnapshot = await db.collection("rooms").where(botQuery, "==", true).where(receiverQuery, "==", true).get();
    
    // create room first before sending a message to the bot
    const arrRooms = roomQuerySnapshot.docs.map((documentSnapshot) => documentSnapshot.ref);
    if(roomQuerySnapshot.empty){
      const newRoomRef = await Room.createBotRoom(BOT_NAME, [BOT_NAME, receiverEmail]);
      arrRooms.push(newRoomRef);
    }

    await Promise.all(arrRooms.map(async (roomRef) => {
      const messageRef = roomRef.collection("messages").doc();
      const details = Object.assign({ momentId: momentId }, commentDoc);
      await messageRef.set({
        content: `${peopleCommentData.applicationInformation.nickName} Mengomentari Moment Kamu. Lihat sekarang!`,
        senderEmail: BOT_NAME, localSentTime: admin.firestore.Timestamp.fromMillis(new moment().valueOf()),
        readBy: [], sentTime: admin.firestore.FieldValue.serverTimestamp(), type: "moment-comment", details
      })
    }))


  }
})

module.exports = Moments;