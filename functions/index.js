const functions = require('firebase-functions');
const admin = require("firebase-admin");
const serviceAccount = require("./chat-app-fdf76-firebase-adminsdk-zmt06-683706239d.json");

admin.initializeApp({
  credential: admin.credential.applicationDefault(),
})

exports.sendNotificationForNewMessage = functions.region("asia-east2").firestore.document("/rooms/{roomId}/messages/{messageId}").onCreate(async (documentSnapshot, context) => {
  const messageDocument = documentSnapshot.data();
  const { senderEmail } = messageDocument;
  const { roomId } = context.params;
  
  // get all audiences except sender
  const db = admin.firestore();
  const roomRef = db.collection("rooms").doc(roomId);
  const roomSnapshot = await roomRef.get();
  const roomDocument = roomSnapshot.data();
  const audiences = Object.keys(roomDocument.audiences).filter(audience => audience !== senderEmail);
  
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

  // send notification to all audiences except sender
  const messagePromises = audiencesData.map(audienceData => {
    const message = {
      token: audienceData.tokenInformation.messagingToken,
      android: { notification: {channelId: "message-notification"} },
      notification: { title: audienceData.applicationInformation.nickName, body: messageDocument.message }
    }
    return admin.messaging().send(message);
  })

  await Promise.all(messagePromises);
  return Promise.resolve(true);
})

exports.sendNotificationForNewDiscussion = functions.region("asia-east2").firestore.document("/schools/{schoolId}/classes/{classId}/tasks/{taskId}/discussions/{discussionId}").onCreate(async (documentSnapshot, context) => {
  const discussionDocument = documentSnapshot.data();
  // console.log(111)
  // console.log(discussionDocument)
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
    const schoolsDocumentRef2 = db.collection("schools").doc(schoolId);
    const teachersDocumentRef = schoolsDocumentRef2.collection("teachers").doc(snap.id);
    const teachersSnapshot = await teachersDocumentRef.get();
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
    const schoolsDocumentRef4 = db.collection("schools").doc(schoolId);
    const studentsDocumentRef = schoolsDocumentRef4.collection("students").doc(snap.id);
    const documentSnapshot = await studentsDocumentRef.get();
    const student = Object.assign({id: documentSnapshot.id, finalScore: snap.data().finalScore}, documentSnapshot.data())

    return Promise.resolve(student)
  });

  const students = await Promise.all(arrayOfPromise2);

  let audiencesData = []

  for(const teacher of teachers){
    if(teacher.tokenInformation && teacher.id !== senderId){
      audiencesData.push(teacher)
    }
  }
  for(const student of students){
    if(student.tokenInformation && teacher.id !== senderId){
      audiencesData.push(student)
    }
  }
  // send notification to teacher and student audience except senderId

  // send notification to all audiences except sender
  const messagePromises = audiencesData.map(audienceData => {
    const message = {
      token: audienceData.tokenInformation.messagingToken,
      android: { notification: {channelId: "discussion-notification"} },
      notification: { title: discussionDocument.title, body: discussionDocument.description }
    }
    return admin.messaging().send(message);
  })

  await Promise.all(messagePromises);
  return Promise.resolve(true);
})
