const functions = require('firebase-functions');
const admin = require("firebase-admin");
const moment = require("moment");

const Room = require("../lib/room");

function Friends(){}

Friends.triggerNewFriendRequest = functions.region("asia-east2").firestore.document("/friendRequest/{receiverEmail}/people/{requestorEmail}").onCreate(async (documentSnapshot, context) => {
  const { receiverEmail, requestorEmail } = context.params;

  // this trigger for auto increment totalFriends in friends collection
  const db = admin.firestore();
  const userFriendListRef = db.collection("friendList").doc(receiverEmail)
  const userFriendListSnapshot = await userFriendListRef.get();

  if(userFriendListSnapshot.data() && userFriendListSnapshot.data().totalFriends){
    await userFriendListRef.update({ totalFriends: admin.firestore.FieldValue.increment(1) })
  }else{
    await userFriendListRef.set({ totalFriends: 1 })
  }

  // notify receiver that requestor is requesting to be a friend
  // search if FriendRequest bot has room with the receiver
  const BOT_NAME = "FriendRequest";
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


Friends.addFriendTrigger = functions.region("asia-east2").firestore.document("/friendList/{friendListId}/people/{peopleId}").onCreate(async (documentSnapshot, context) => {
  // this trigger for auto increment totalFriends in friends collection
  const messageDocument = documentSnapshot.data();
  const { friendListId, peopleId } = context.params;
  
  // get all audiences except sender
  const db = admin.firestore();
  const userFriendListRef = db.collection("friendList").doc(friendListId)
   
  const userFriendListSnapshot = await userFriendListRef.get();

  if(userFriendListSnapshot.data() && userFriendListSnapshot.data().totalFriends){
    await userFriendListRef.update({ totalFriends: admin.firestore.FieldValue.increment(1) })
  }else{
    await userFriendListRef.set({ totalFriends: 1 })
  }

  return Promise.resolve(true);
})


Friends.sendNotificationForNewFriendRequest = functions.region("asia-east2").firestore.document("/friendRequest/{friendRequestId}/people/{peopleId}").onCreate(async (documentSnapshot, context) => {
  const { friendRequestId, peopleId  } = context.params;

  const db = admin.firestore();

  const friendRequestFromRef = db.collection("users").doc(peopleId);
  const friendRequestFromSnapshot = await friendRequestFromRef.get();
  const friendRequestFrom = Object.assign({id: friendRequestFromSnapshot.id}, friendRequestFromSnapshot.data())

  const friendRequestToRef = db.collection("users").doc(friendRequestId);
  const friendRequestToSnapshot = await friendRequestToRef.get();
  const friendRequestTo = Object.assign({id: friendRequestToSnapshot.id}, friendRequestToSnapshot.data())

  if(friendRequestTo && friendRequestTo.tokenInformation && friendRequestTo.tokenInformation.messagingToken){
    const message = {
      token: friendRequestTo.tokenInformation.messagingToken,
      android: { 
        notification: {channelId: "friendrequest-notification"}
      },
      data: {
        type: "friend-request",
        friendRequestFromUserId: peopleId,
      },
      notification: { title: friendRequestFrom.applicationInformation.nickName+ " ingin berteman denganmu" }
    }
    admin.messaging().send(message);
  }

})

Friends.triggerBlockFriends = functions.region("asia-east2").firestore.document("/friendList/{friendListId}/blocked/{blockId}").onCreate(async (documentSnapshot, context) => {
  const { friendListId, blockId } = context.params;
  
  const db = admin.firestore();
  const userFriendListRef = db.collection("friendList").doc(blockId)
  const blockedByRef = userFriendListRef.collection("blockedBy").doc(friendListId) 
  const blockedBySnapshot = await blockedByRef.get()

  // set blockedBy
  if(!blockedBySnapshot.exists){
    await blockedByRef.set({creationTime: admin.firestore.FieldValue.serverTimestamp()})
  }

  // set Room to blocked: true
  const roomDocRef = db.collection("rooms").where("type", "==", "chat");
  const userPath = new admin.firestore.FieldPath("audiencesQuery", friendListId);
  const peoplePath = new admin.firestore.FieldPath("audiencesQuery", blockId);
  const querySnapshot = await roomDocRef.where(userPath, "==", true).where(peoplePath, "==", true).get();
  if(!querySnapshot.empty){
    const roomDocRef = querySnapshot.docs[0].ref
    roomDocRef.update({blocked: true})
  }


  return Promise.resolve(true);
})

Friends.triggerUnblockFriends = functions.region("asia-east2").firestore.document("/friendList/{friendListId}/blocked/{blockId}").onDelete(async (documentSnapshot, context) => {
  const { friendListId, blockId } = context.params;
  
  const db = admin.firestore();
  const userFriendListRef = db.collection("friendList").doc(blockId)
  const blockedByRef = userFriendListRef.collection("blockedBy").doc(friendListId) 

  const blockedBySnapshot = await blockedByRef.get()

  if(blockedBySnapshot.exists){
    await blockedByRef.delete()
  }

   // set Room to blocked: false
   const roomDocRef = db.collection("rooms").where("type", "==", "chat");
   const userPath = new admin.firestore.FieldPath("audiencesQuery", friendListId);
   const peoplePath = new admin.firestore.FieldPath("audiencesQuery", blockId);
   const querySnapshot = await roomDocRef.where(userPath, "==", true).where(peoplePath, "==", true).get();
   if(!querySnapshot.empty){
     const roomDocRef = querySnapshot.docs[0].ref
     roomDocRef.update({blocked: false})
   }

  return Promise.resolve(true);
})


Friends.triggerHideFriends = functions.region("asia-east2").firestore.document("/friendList/{friendListId}/hide/{hideId}").onCreate(async (documentSnapshot, context) => {
  const { friendListId, hideId } = context.params;
  
  const db = admin.firestore();
  
   // set Room to hide: false
   const roomDocRef = db.collection("rooms").where("type", "==", "chat");
   const userPath = new admin.firestore.FieldPath("audiencesQuery", friendListId);
   const peoplePath = new admin.firestore.FieldPath("audiencesQuery", hideId);
   const querySnapshot = await roomDocRef.where(userPath, "==", true).where(peoplePath, "==", true).get();
   if(!querySnapshot.empty){
     const roomDocRef = querySnapshot.docs[0].ref
     roomDocRef.update({hidden: true})
   }

  return Promise.resolve(true);
})


Friends.triggerUnhideFriends = functions.region("asia-east2").firestore.document("/friendList/{friendListId}/hide/{hideId}").onDelete(async (documentSnapshot, context) => {
  const { friendListId, hideId } = context.params;
  
  const db = admin.firestore();
  
   // set Room to hide: false
   const roomDocRef = db.collection("rooms").where("type", "==", "chat");
   const userPath = new admin.firestore.FieldPath("audiencesQuery", friendListId);
   const peoplePath = new admin.firestore.FieldPath("audiencesQuery", hideId);
   const querySnapshot = await roomDocRef.where(userPath, "==", true).where(peoplePath, "==", true).get();
   if(!querySnapshot.empty){
     const roomDocRef = querySnapshot.docs[0].ref
     roomDocRef.update({hidden: false})
   }

  return Promise.resolve(true);
})



module.exports = Friends;