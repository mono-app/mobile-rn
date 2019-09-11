const functions = require('firebase-functions');
var admin = require("firebase-admin");
var serviceAccount = require("./serviceAccountKey.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://chat-app-fdf76.firebaseio.com"
});

  // ini untuk testing saja
  const schoolId = "1hZ2DiIYSFa5K26oTe75"
  const classId = "NWNfzx09U8HpxfXZMAEM"
  const taskId = "J76mQkaDnBqGqY4SLr7K"
  //const discussionId = "isiUsKggIRg3pVCVoZVh"
  const discussionId = "zJEZbx6Mu1iHy1vxQG2P"

  // get senderId
  const senderId = "test.kedua@gmail.com"

  // get creator Discussion Email
    

  // get all teacher audience
  const db = admin.firestore();
  const schoolsDocumentRef = db.collection("schools").doc(schoolId);
  const classesDocumentRef = schoolsDocumentRef.collection("classes").doc(classId);
  const tasksDocumentRef = classesDocumentRef.collection("tasks").doc(taskId)
  const discussionsDocumentRef = tasksDocumentRef.collection("discussions").doc(discussionId)
  const participantsCollectionRef = discussionsDocumentRef.collection("participants")

  
  const participantsQuerySnapshot = await participantsCollectionRef.get()

  const arrayOfPromise = participantsQuerySnapshot.docs.map( async (snap) => {
    const userDocumentRef = db.collection("users").doc(snap.id);
    const documentSnapshot = await userDocumentRef.get();
    const user = Object.assign({id: documentSnapshot.id}, documentSnapshot.data())

    return Promise.resolve(user)
  });
  const participants = await Promise.all(arrayOfPromise);
  

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

  // send notification to all audiences except sender
  try{
    const messagePromises = audiencesData.map(audienceData => {
      if(audienceData.tokenInformation){
        const message = {
          token: audienceData.tokenInformation.messagingToken,
          android: { notification: {channelId: "discussion-notification"} },
          data: {
            type: "discussion-comment",
            discussionId: discussionId,
            schoolId: schoolId,
            classId: classId,
            taskId: taskId
          },
          notification: { title: "Komentar Baru Pada Diskusi", body: "azzz" }
        }
        return admin.messaging().send(message);
      }
    })

    await Promise.all(messagePromises);
    return Promise.resolve(true);
  }catch(e){
    return Promise.resolve(e);

  }