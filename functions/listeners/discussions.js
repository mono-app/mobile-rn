const functions = require('firebase-functions');
const admin = require("firebase-admin");
const Bot = require("../lib/bot");
const School = require("../lib/school")
function Discussion(){}


Discussion.triggerNewDiscussion = functions.region("asia-east2").firestore.document("/schools/{schoolId}/classes/{classId}/tasks/{taskId}/discussions/{discussionId}").onCreate(async (documentSnapshot, context) => {
  const discussionDocument = documentSnapshot.data();
  const { schoolId, classId, taskId, discussionId  } = context.params;

  const db = admin.firestore();
  const userMappingRef = db.collection("userMapping").doc(discussionDocument.posterId);
  const schoolRef = userMappingRef.collection("schools").doc(schoolId)
  const discussionRef = schoolRef.collection("discussions").doc(discussionId)
  const data = Object.assign({classId: classId, taskId: taskId}, documentSnapshot.data())
  discussionRef.set(data)
  
 
  return Promise.resolve(true);
})

Discussion.triggerNewDiscussionComment = functions.region("asia-east2").firestore.document("/schools/{schoolId}/classes/{classId}/tasks/{taskId}/discussions/{discussionId}/comments/{commentId}").onCreate(async (documentSnapshot, context) => {
  const discussionDocument = documentSnapshot.data();
  const { schoolId, classId, taskId, discussionId  } = context.params;

  // add to My Discussion when commenting someone discussions
  const db = admin.firestore();
  const userMappingRef = db.collection("userMapping").doc(discussionDocument.posterId);
  const schoolRef = userMappingRef.collection("schools").doc(schoolId)
  const discussionRef = schoolRef.collection("discussions").doc(discussionId)

  const school2Ref = db.collection("schools").doc(schoolId)
  const class2Ref = school2Ref.collection("classes").doc(classId)
  const task2Ref = class2Ref.collection("tasks").doc(taskId)
  const discussion2Ref = task2Ref.collection("discussions").doc(discussionId)
  const discussion2Snapshot = await discussion2Ref.get()

  const data = Object.assign({classId: classId, taskId: taskId}, discussion2Snapshot.data())
  discussionRef.set(data)
  
  return Promise.resolve(true);
})


Discussion.sendNotificationForNewDiscussion = functions.region("asia-east2").firestore.document("/schools/{schoolId}/classes/{classId}/tasks/{taskId}/discussions/{discussionId}").onCreate(async (documentSnapshot, context) => {
  const discussionDocument = documentSnapshot.data();
  const { schoolId, classId, taskId, discussionId  } = context.params;

  // get senderId
  const senderId = discussionDocument.posterId
  const senderName = await School.getUserName(schoolId, senderId)

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
      if(audienceData && audienceData.tokenInformation && audienceData.tokenInformation.messagingToken &&
        !tempTokenArray.includes(audienceData.tokenInformation.messagingToken)){

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

        // Send BOT message
        const details = {discussion: Object.assign({id: documentSnapshot.id, schoolId, classId, taskId},Object.assign(discussionDocument))}
        const messageBot = senderName+" Membuat Diskusi Baru, Lihat Sekarang!"
        Bot.sendBotMessage("ClassroomDiscussion",audienceData.id,details,messageBot,"new-discussion")
        // END Send Bot Message

        return admin.messaging().send(message);
      }
    })

    await Promise.all(messagePromises);
    


    return Promise.resolve(true);
  }catch(e){
    return Promise.resolve(e);

  }
})

Discussion.sendNotificationForNewDiscussionComment = functions.region("asia-east2").firestore.document("/schools/{schoolId}/classes/{classId}/tasks/{taskId}/discussions/{discussionId}/comments/{commentId}").onCreate(async (documentSnapshot, context) => {
  const commentDocument = documentSnapshot.data();
  const { schoolId, classId, taskId, discussionId, commentId  } = context.params;

  // get senderId
  const senderId = commentDocument.posterId
  const senderName = await School.getUserName(schoolId, senderId)

  const db = admin.firestore();

  // get all teacher audience
  const schoolsDocumentRef = db.collection("schools").doc(schoolId);
  const classesDocumentRef = schoolsDocumentRef.collection("classes").doc(classId);
  const tasksDocumentRef = classesDocumentRef.collection("tasks").doc(taskId)
  const discussionsDocumentRef = tasksDocumentRef.collection("discussions").doc(discussionId)
  const participantsCollectionRef = discussionsDocumentRef.collection("participants")

  // get creator Discussion ID
  const discussionDocumentSnapshot = await discussionsDocumentRef.get();
  const discussionDocument = discussionDocumentSnapshot.data()
  const creatorId = discussionDocumentSnapshot.data().posterId
  const creatorDocumentRef = db.collection("users").doc(creatorId);
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
      if(audienceData && audienceData.tokenInformation && audienceData.tokenInformation.messagingToken &&
        !tempTokenArray.includes(audienceData.tokenInformation.messagingToken)){
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
        // Send BOT message
        const details = {discussion: Object.assign({id: discussionDocumentSnapshot.id, schoolId, classId, taskId},Object.assign(discussionDocument))}
        const messageBot = senderName+" Mengomentari Diskusi, Lihat Sekarang!"
        Bot.sendBotMessage("ClassroomDiscussion",audienceData.id,details,messageBot,"new-discussion-comment")
        // END Send Bot Message
        return admin.messaging().send(message);
      }
    })

    await Promise.all(messagePromises);
    return Promise.resolve(true);
  }catch(e){
    return Promise.resolve(e);

  }
})



module.exports = Discussion;