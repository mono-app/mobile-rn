const functions = require('firebase-functions');
const admin = require("firebase-admin");
const Bot = require("../lib/bot");

function Friends(){}

Friends.triggerNewFriendRequest = functions.region("asia-east2").firestore.document("/friendRequest/{receiverId}/people/{requestorId}").onCreate(async (documentSnapshot, context) => {
  const { receiverId, requestorId } = context.params;

  // this trigger for auto increment totalFriends in friends collection
  const db = admin.firestore();
 
  // get requestor details to be sent by the bot
  const requestorRef = await db.collection("users").doc(requestorId).get();
  const requestor = requestorRef.data();

  // update the document to include requestor detail
  await documentSnapshot.ref.update({ "applicationInformation": requestor.applicationInformation })

  // notify receiver that requestor is requesting to be a friend
  // Send BOT message
  const details = Object.assign({ targetId: requestorRef.id }, documentSnapshot.data());
  const messageBot= `${requestor.applicationInformation.nickName} ingin berteman dengan kamu. Lihat sekarang!`

  Bot.sendBotMessage("FriendRequest",receiverId,details,messageBot,"friend-request")
  // END Send Bot Message
})


Friends.addFriendTrigger = functions.region("asia-east2").firestore.document("/friendList/{friendListId}/people/{peopleId}").onCreate(async (documentSnapshot, context) => {
  // this trigger for auto increment totalFriends in friends collection
  const { friendListId, peopleId } = context.params;
  
  const db = admin.firestore();

  // add showsTo in moments collection
  const momentQuerySnapshot = await db.collection("moments").where("posterId","==",friendListId).get()
  momentQuerySnapshot.docs.map( async documentSnapshot => {
    await documentSnapshot.ref.update({showsTo: admin.firestore.FieldValue.arrayUnion(peopleId)})
  })

  return Promise.resolve(true);
})

Friends.deleteFriendTrigger = functions.region("asia-east2").firestore.document("/friendList/{friendListId}/people/{peopleId}").onDelete(async (documentSnapshot, context) => {
  // this trigger for auto decrease totalFriends in friends collection
  const { friendListId, peopleId } = context.params;
  
  const db = admin.firestore();
  const userFriendListRef = db.collection("friendList").doc(friendListId)
  await userFriendListRef.update({friends: admin.firestore.FieldValue.arrayRemove(peopleId)})

  // remove showsTo in moments collection
  const momentQuerySnapshot = await db.collection("moments").where("posterId","==",friendListId).get()
  momentQuerySnapshot.docs.map( async documentSnapshot => {
    await documentSnapshot.ref.update({showsTo: admin.firestore.FieldValue.arrayRemove(peopleId)})
  })

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

  const blockedUserFriendListRef = db.collection("friendList").doc(blockId)
  const peopleRef = blockedUserFriendListRef.collection("people").doc(friendListId)
  peopleRef.update({status:"blocked-by"})

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

  // set status to opponent friendList
  const blockedUserFriendListRef = db.collection("friendList").doc(blockId)
  const peopleRef = blockedUserFriendListRef.collection("people").doc(friendListId)
  peopleRef.update({status:"friend"})

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