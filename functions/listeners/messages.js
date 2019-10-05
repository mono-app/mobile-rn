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

Messages.sendNotificationForNewMessage = functions.region("asia-east2").firestore.document("/rooms/{roomId}/messages/{messageId}").onCreate(async (documentSnapshot, context) => {
  const messageDocument = documentSnapshot.data();
  const { senderEmail } = messageDocument;
  const { roomId, messageId } = context.params;
  
  // get all audiences except sender
  const db = admin.firestore();
  const roomRef = db.collection("rooms").doc(roomId);
  const roomSnapshot = await roomRef.get();
  const roomDocument = roomSnapshot.data();
  const roomType = roomDocument.type
  const audiences =  roomDocument.audiences.filter( (audience)=>{
    return audience !== senderEmail
  })

  // get all audiences messagingToken  
  const promises = audiences.map(audience => {
    const userRef = db.collection("users").doc(audience);
    return userRef.get();
  })
  const audiencesSnapshot = await Promise.all(promises);
  const audiencesData = audiencesSnapshot.map(audienceSnapshot => {
    const audienceData = audienceSnapshot.data();
    if(audienceData && audienceData.tokenInformation && audienceData.tokenInformation.messagingToken){
      return audienceData;
    }
  });

  let tempTokenArray = []

  // send notification to all audiences except sender
  const messagePromises = audiencesData.map(audienceData => {
    if(audienceData && audienceData.tokenInformation && audienceData.tokenInformation.messagingToken && 
      !tempTokenArray.includes(audienceData.tokenInformation.messagingToken)){
      let message = {}
      let type= "-"
      let title = ""
      const body = messageDocument.content
      if(roomType==="bot"){
        if(roomDocument.bot==="BirthdayReminder"){
          type = "birthday-reminder"
          title = "Birthday"
        }
      }else if(roomType==="chat"){
        type = "new-chat"
        title = audienceData.applicationInformation.nickName
      }else if(roomType==="group-chat"){
        type = "new-groupchat"
        title = audienceData.applicationInformation.nickName
      }
      message = {
        token: audienceData.tokenInformation.messagingToken,
        android: { notification: {channelId: "message-notification"} },
        data: {
          type,
          roomId: roomId,
          messageId: messageId
        },
        notification: { title, body }
      }
      tempTokenArray.push(audienceData.tokenInformation.messagingToken)
      return admin.messaging().send(message);
    }
  })

  await Promise.all(messagePromises);
  return Promise.resolve(true);
})


module.exports = Messages;