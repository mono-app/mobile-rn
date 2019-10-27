const functions = require('firebase-functions');
const admin = require("firebase-admin");
const Bot = require("../lib/bot");

function Moments(){}

Moments.triggerNewMoment = functions.region("asia-east2").firestore.document("/moments/{momentId}").onCreate(async (documentSnapshot, context) => {
  const momentDoc = documentSnapshot.data();
  const posterId = momentDoc.posterId

  // this trigger for auto add room audiences rooms collection  
  const db = admin.firestore();
  const friendListRef = db.collection("friendList").doc(posterId);
  const querySnapshot = await friendListRef.collection("people").get()

  const friendIdList = querySnapshot.docs.map(documentSnapshot => {
    return documentSnapshot.id
  })
  
  friendIdList.push(posterId)

  documentSnapshot.ref.update({showsTo: friendIdList})
  
  return Promise.resolve(true);
})

Moments.sendNotificationForNewMomentComment = functions.region("asia-east2").firestore.document("/moments/{momentId}/comments/{commentId}").onCreate(async (documentSnapshot, context) => {
  const commentDoc = documentSnapshot.data();
  const { momentId } = context.params;

  const db = admin.firestore();

  const momentDocRef = db.collection("moments").doc(momentId)
  const momentSnapshot = await momentDocRef.get()
  const receiverId = momentSnapshot.data().posterId

  const peopleCommentId = commentDoc.peopleId
  // check if the person commented is not the creator of the moment
  if(peopleCommentId!==receiverId){
    const receiverDocRef = db.collection("users").doc(receiverId)
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

    const userDocRef = db.collection("users").doc(peopleCommentId)
    const peopleCommentSnapshot = await userDocRef.get()
    const peopleCommentData = peopleCommentSnapshot.data()

    // notify moment's creator
    // Send BOT message
    const details = Object.assign({ momentId: momentId }, commentDoc);
    const messageBot= `${peopleCommentData.applicationInformation.nickName} Mengomentari Moment Kamu. Lihat sekarang!`

    Bot.sendBotMessage("Moment",receiverId,details,messageBot,"moment-comment")
    // END Send Bot Message

  }
})

module.exports = Moments;