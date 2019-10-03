const functions = require('firebase-functions');
const express = require('express');
const bearerToken = require('express-bearer-token');
const libphonenumber = require('libphonenumber-js')
const cors = require('cors');
const app = express();
const admin = require("firebase-admin");
const serviceAccount = require("./serviceAccountKey.json");
const BirthdayReminder = require("./listeners/birthdayReminder");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://chat-app-fdf76.firebaseio.com",
})

app.use(bearerToken());

// for parsing application/json
app.use(express.json()) 

// Automatically allow cross-origin requests
app.use(cors({ origin: true }));

app.get('/test', (req, res) => {
  // [END_EXCLUDE silent]
  res.send(`
  <!doctype html>
    <head>
      <title>Time</title>
    </head>
    <body>
      <p>Hello world</p>
    </body>
  </html>`);

});

const validatePhoneNumber = (phoneNumber0, countryCode, numCode) => {
  // numCode: 62
  // countryCode: ID
  let result = phoneNumber0.toString()
  const phoneNumber1 = libphonenumber.parsePhoneNumberFromString(result, countryCode)
  if(phoneNumber1.isPossible()){
    // check if there is `+` 
    if(result.substring(0,1)==="+"){
      result = result.substr(1);
    }
    // change 0 to numCode 
    if(result.substring(0,1)==="0"){
      result = result.substr(1);
      result = numCode+""+result
    }
    // if 2 first letter is not same with numCode, add the numCode at the beginning
    if(result.substring(0,2)!==numCode){
      result = numCode+""+result
    }

    const phoneNumber2 = libphonenumber.parsePhoneNumberFromString("+"+result, countryCode)
    if(phoneNumber2.isValid()){
      return result
    }
  }
  return null
}

app.post('/synccontact', async (req,res)=>{
  const countryCode = "ID"
  const numCode = "62"
  const currentAccessToken = req.token
  if(!currentAccessToken){
    res.status(401).send("null token");
  }
  const requesterUserId = req.body.userId
  const phoneNumbers = req.body.phonenumbers
  if(!Array.isArray(phoneNumbers)){
    res.status(400).send("phonenumbers value must be array data type");
  }
  const db = admin.firestore();
  const userRef = db.collection("users");
  const userMappingRef = db.collection("userMapping").doc(requesterUserId)
  const userMappingSnapshot = await userMappingRef.get()
  if(userMappingSnapshot.data() && userMappingSnapshot.data().accessToken){
    const dbAccessToken = userMappingSnapshot.data().accessToken
    if(dbAccessToken!==currentAccessToken){
      res.status(401).send("wrong token");
    }
  }else{
    res.status(401).send("null db token");

  }
  const userSnapshot = await userRef.get();
  const users = userSnapshot.docs.map( (snap) => {
    let user = Object.assign({id: snap.id})
    if(snap.data().phoneNumber){
      user = Object.assign({id: snap.id, phone: snap.data().phoneNumber.value})
    }
    return user
  });
  const phones = users.map((obj)=> obj.phone);
  phoneNumbers.forEach( async(item) => {
    let result = item
    //result = validatePhoneNumber(result, countryCode, numCode)
    const phoneNumber1 = libphonenumber.parsePhoneNumberFromString(result, countryCode)
    if(phoneNumber1.isPossible()){
      // check if there is `+` 
      if(result.substring(0,1)==="+"){
        result = result.substr(1);
      }
      // change 0 to numCode 
      if(result.substring(0,1)==="0"){
        result = result.substr(1);
        result = numCode+""+result
      }
      // if 2 first letter is not same with numCode, add the numCode at the beginning
      if(result.substring(0,2)!==numCode){
        result = numCode+""+result
      }
  
      const phoneNumber2 = libphonenumber.parsePhoneNumberFromString("+"+result, countryCode)
      if(phoneNumber2.isValid()){
        const index = phones.indexOf(result)
        if(index>0){
          const userId = users[index].id
          // check user himself (cannot add yourself to friendList)
          if(userId!==requesterUserId){
            const userFriendListRef = db.collection("friendList").doc(requesterUserId)
            const userPeopleRef = userFriendListRef.collection("people").doc(userId)
            const peopleFriendListRef = db.collection("friendList").doc(userId)
            const peoplePeopleRef = peopleFriendListRef.collection("people").doc(requesterUserId)
            
            const promises = [ 
          
            ];

            const userPeopleSnapshot = await userPeopleRef.get()
            const peoplePeopleSnapshot = await peoplePeopleRef.get()
          

            if(!userPeopleSnapshot.exists){
              promises.push(userPeopleRef.set({ creationTime: admin.firestore.FieldValue.serverTimestamp(), source: {value: "auto-sync"} }));
            }
            if(!peoplePeopleSnapshot.exists){
              promises.push(peoplePeopleRef.set({ creationTime: admin.firestore.FieldValue.serverTimestamp(), source: {value: "auto-sync"} }));
            }

            await Promise.all(promises);

          }
         
        }

      }
    }
  })
  res.status(200).send("ok");
});

exports.app = functions.https.onRequest(app);
exports.schedullerBirthdayReminder = BirthdayReminder.schedule;

exports.addFriendTrigger = functions.region("asia-east2").firestore.document("/friendList/{friendListId}/people/{peopleId}").onCreate(async (documentSnapshot, context) => {
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


exports.sendNotificationForNewMessage = functions.region("asia-east2").firestore.document("/rooms/{roomId}/messages/{messageId}").onCreate(async (documentSnapshot, context) => {
  const messageDocument = documentSnapshot.data();
  const { senderEmail } = messageDocument;
  const { roomId, messageId } = context.params;
  
  // get all audiences except sender
  const db = admin.firestore();
  const roomRef = db.collection("rooms").doc(roomId);
  const roomSnapshot = await roomRef.get();
  const roomDocument = roomSnapshot.data();
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
    if(audienceData.tokenInformation){
      if(audienceData.tokenInformation.messagingToken) return audienceData;
    }
  });

  let tempTokenArray = []

  // send notification to all audiences except sender
  const messagePromises = audiencesData.map(audienceData => {
    if(!tempTokenArray.includes(audienceData.tokenInformation.messagingToken)){
      const message = {
        token: audienceData.tokenInformation.messagingToken,
        android: { notification: {channelId: "message-notification"} },
        data: {
          type: "new-chat",
          roomId: roomId,
          messageId: messageId
        },
        notification: { title: audienceData.applicationInformation.nickName, body: messageDocument.content }
      }
      tempTokenArray.push(audienceData.tokenInformation.messagingToken)
      return admin.messaging().send(message);
    }
  })

  await Promise.all(messagePromises);
  return Promise.resolve(true);
})

exports.sendNotificationForNewDiscussion = functions.region("asia-east2").firestore.document("/schools/{schoolId}/classes/{classId}/tasks/{taskId}/discussions/{discussionId}").onCreate(async (documentSnapshot, context) => {
  const discussionDocument = documentSnapshot.data();
  const { schoolId, classId, taskId, discussionId  } = context.params;

  // get senderId
  const senderId = discussionDocument.posterEmail

  // get all teacher audience
  const db = admin.firestore();
  const schoolsDocumentRef = db.collection("schools").doc(schoolId);
  const classesDocumentRef = schoolsDocumentRef.collection("classes").doc(classId);
  const teachersCollectionRef = classesDocumentRef.collection("teachers");

  const teachersQuerySnapshot = await teachersCollectionRef.get()

  const arrayOfPromise = teachersQuerySnapshot.docs.map(async (snap) => {
    const teacherDocumentRef = db.collection("users").doc(snap.id);
    const teachersSnapshot = await teacherDocumentRef.get();
    const data = Object.assign({id: teachersSnapshot.id}, teachersSnapshot.data())

    return Promise.resolve(data)
  });
  const teachers = await Promise.all(arrayOfPromise);
  
  // get all student audience
  const schoolsDocumentRef3 = db.collection("schools").doc(schoolId);
  const classesDocumentRef2 = schoolsDocumentRef3.collection("classes").doc(classId);
  let studentsCollectionRef = classesDocumentRef2.collection("students");

  const studentSnapshot = await studentsCollectionRef.get();
  const arrayOfPromise2 = studentSnapshot.docs.map(async (snap) => {
    const studentsDocumentRef = db.collection("users").doc(snap.id);
    const documentSnapshot = await studentsDocumentRef.get();
    const student = Object.assign({id: documentSnapshot.id, finalScore: snap.data().finalScore}, documentSnapshot.data())

    return Promise.resolve(student)
  });

  const students = await Promise.all(arrayOfPromise2);

  let audiencesData = []

  for(const teacher of teachers){
    if(teacher.id !== senderId){
      let allow = true
      if(teacher.settings && teacher.settings.ignoreNotifications && teacher.settings.ignoreNotifications.discussions){
        if(teacher.settings.ignoreNotifications.discussions.some(e => e.id === discussionId)){
          allow = false
        }
      }
      if(allow){
        audiencesData.push(teacher)
      }
    }
  }
  for(const student of students){
    if(student.id !== senderId){
      let allow = true
      if(student.settings && student.settings.ignoreNotifications && student.settings.ignoreNotifications.discussions){
        if(student.settings.ignoreNotifications.discussions.some(e => e.id === discussionId)){
          allow = false
        }
      }
      if(allow){
        audiencesData.push(student)
      }
    }
  }
  // send notification to teacher and student audience except senderId
  let tempTokenArray = []
  // send notification to all audiences except sender
  try{
    const messagePromises = audiencesData.map(audienceData => {
      if(audienceData.tokenInformation && !tempTokenArray.includes(audienceData.tokenInformation.messagingToken)){
        const message = {
          token: audienceData.tokenInformation.messagingToken,
          android: { 
            notification: {channelId: "discussion-notification"},
        },
          data: {
            type: "new-discussion",
            discussionId: discussionId,
            schoolId: schoolId,
            classId: classId,
            taskId: taskId
          },
          notification: { title: "Diskusi Baru", body: discussionDocument.title }
        }
        tempTokenArray.push(audienceData.tokenInformation.messagingToken)
        return admin.messaging().send(message);
      }
    })

    await Promise.all(messagePromises);
    return Promise.resolve(true);
  }catch(e){
    return Promise.resolve(e);

  }
})

exports.sendNotificationForNewDiscussionComment = functions.region("asia-east2").firestore.document("/schools/{schoolId}/classes/{classId}/tasks/{taskId}/discussions/{discussionId}/comments/{commentId}").onCreate(async (documentSnapshot, context) => {
  const commentDocument = documentSnapshot.data();
  const { schoolId, classId, taskId, discussionId, commentId  } = context.params;

  // get senderId
  const senderId = commentDocument.posterEmail

  const db = admin.firestore();

  // get all teacher audience
  const schoolsDocumentRef = db.collection("schools").doc(schoolId);
  const classesDocumentRef = schoolsDocumentRef.collection("classes").doc(classId);
  const tasksDocumentRef = classesDocumentRef.collection("tasks").doc(taskId)
  const discussionsDocumentRef = tasksDocumentRef.collection("discussions").doc(discussionId)
  const participantsCollectionRef = discussionsDocumentRef.collection("participants")

  // get creator Discussion Email
  const discussionDocumentSnapshot = await discussionsDocumentRef.get();
  const creatorEmail = discussionDocumentSnapshot.data().posterEmail
  const creatorDocumentRef = db.collection("users").doc(creatorEmail);
  const creatorDocumentSnapshot = await creatorDocumentRef.get();
  const creator = Object.assign({id: creatorDocumentSnapshot.id}, creatorDocumentSnapshot.data())

  const participantsQuerySnapshot = await participantsCollectionRef.get()

  const arrayOfPromise = participantsQuerySnapshot.docs.map( async (snap) => {
    const userDocumentRef = db.collection("users").doc(snap.id);
    const documentSnapshot = await userDocumentRef.get();
    const user = Object.assign({id: documentSnapshot.id}, documentSnapshot.data())

    return Promise.resolve(user)
  });
  let participants = await Promise.all(arrayOfPromise);
  
  participants.push(creator)

  let audiencesData = []

  for(const participant of participants){
    if(participant.id !== senderId){
      let allow = true
      if(participant.settings && participant.settings.ignoreNotifications && participant.settings.ignoreNotifications.discussions){
        if(participant.settings.ignoreNotifications.discussions.some(e => e.id === discussionId)){
          allow = false
        }
      }
      if(allow){
        audiencesData.push(participant)
      }
    }
  }
  let tempTokenArray = []
  // send notification to all audiences except sender
  try{
    const messagePromises = audiencesData.map(audienceData => {
      if(audienceData.tokenInformation && !tempTokenArray.includes(audienceData.tokenInformation.messagingToken)){
        const message = {
          token: audienceData.tokenInformation.messagingToken,
          android: { 
            notification: {channelId: "discussion-notification"}
          },
          data: {
            type: "discussion-comment",
            discussionId: discussionId,
            schoolId: schoolId,
            classId: classId,
            taskId: taskId
          },
          notification: { title: "Komentar Baru Pada Diskusi", body: commentDocument.comment }
        }
        tempTokenArray.push(audienceData.tokenInformation.messagingToken)
        return admin.messaging().send(message);
      }
    })

    await Promise.all(messagePromises);
    return Promise.resolve(true);
  }catch(e){
    return Promise.resolve(e);

  }
})

exports.sendNotificationForNewFriendRequest = functions.region("asia-east2").firestore.document("/friendRequest/{friendRequestId}/people/{peopleId}").onCreate(async (documentSnapshot, context) => {
  const { friendRequestId, peopleId  } = context.params;

  const db = admin.firestore();

  const friendRequestFromRef = db.collection("users").doc(peopleId);
  const friendRequestFromSnapshot = await friendRequestFromRef.get();
  const friendRequestFrom = Object.assign({id: friendRequestFromSnapshot.id}, friendRequestFromSnapshot.data())

  const friendRequestToRef = db.collection("users").doc(friendRequestId);
  const friendRequestToSnapshot = await friendRequestToRef.get();
  const friendRequestTo = Object.assign({id: friendRequestToSnapshot.id}, friendRequestToSnapshot.data())

  if(friendRequestTo.tokenInformation){
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



