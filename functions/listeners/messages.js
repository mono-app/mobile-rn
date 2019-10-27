const functions = require('firebase-functions');
const admin = require("firebase-admin");

function Messages(){}

Messages.triggerNewMessage = functions.region("asia-east2").firestore.document("/rooms/{roomId}/messages/{messageId}").onCreate(async (documentSnapshot, context) => {
  const { roomId } = context.params;
  const db = admin.firestore();
  const message = documentSnapshot.data()
  const roomDocRef = db.collection("rooms").doc(roomId)
 
  const docSnapshot = await roomDocRef.get()
  const readByPayload = {}
  docSnapshot.data().audiences.forEach(id=>{
    if(id===message.senderId){
      readByPayload[id] = true
    }else{
      readByPayload[id] = false
    }
  })
  await roomDocRef.update({
    "lastMessage.message": message.content,
    "lastMessage.sentTime": message.sentTime,
    readBy: readByPayload
  })
})

Messages.sendNotificationForNewMessage = functions.region("asia-east2").firestore.document("/rooms/{roomId}/messages/{messageId}").onCreate(async (documentSnapshot, context) => {
  const messageDocument = documentSnapshot.data();
  const { senderId } = messageDocument;
  const { roomId, messageId } = context.params;
  
  // get all audiences except sender
  const db = admin.firestore();
  const roomRef = db.collection("rooms").doc(roomId);
  const roomSnapshot = await roomRef.get();
  const roomDocument = roomSnapshot.data();
  const roomType = roomDocument.type
  const audiences =  roomDocument.audiences.filter( (audience)=>{
    return audience !== senderId
  })

  const senderSnapshot = await db.collection("users").doc(senderId).get()
  if(!senderSnapshot.data().applicationInformation){
    return Promise.resolve(false);
  }
  const senderNickname = senderSnapshot.data().applicationInformation.nickName
  const blockedUserList = []
  const blockedByUserList = []
  const blockedQuerySnapshot = await db.collection("friendList").doc(senderId).collection("blocked").get()
  if(!blockedQuerySnapshot.empty)
  blockedQuerySnapshot.docs.forEach(docSnap=>{
    blockedUserList.push(docSnap.id)
  })
  const blockedByQuerySnapshot = await db.collection("friendList").doc(senderId).collection("blockedBy").get()
  if(!blockedByQuerySnapshot.empty){
    blockedByQuerySnapshot.docs.forEach(docSnap=>{
      blockedByUserList.push(docSnap.id)
    })
  }
  // get all audiences messagingToken  
  const promises = audiences.map(audience => {
    const userRef = db.collection("users").doc(audience);
    return userRef.get();
  })
  const audiencesSnapshot = await Promise.all(promises);
  const audiencesData = audiencesSnapshot.map(audienceSnapshot => {
    const audienceData =  Object.assign({ id: audienceSnapshot.id }, audienceSnapshot.data())
    if(audienceData && audienceData.tokenInformation && audienceData.tokenInformation.messagingToken){
      return audienceData;
    }
  });

  let tempTokenArray = []

  // send notification to all audiences except sender
  const messagePromises = audiencesData.map(audienceData => {
    if(audienceData && audienceData.tokenInformation && audienceData.tokenInformation.messagingToken && 
      !tempTokenArray.includes(audienceData.tokenInformation.messagingToken) && !blockedUserList.includes(audienceData.id) && 
      !blockedByUserList.includes(audienceData.id)){
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
        title = senderNickname
      }else if(roomType==="group-chat"){
        type = "new-groupchat"
        title = senderNickname
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