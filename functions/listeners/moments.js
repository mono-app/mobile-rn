const functions = require('firebase-functions');
const admin = require("firebase-admin");

function Moments(){}

Moments.triggerNewMoment = functions.region("asia-east2").firestore.document("/moments/{momentId}").onCreate(async (documentSnapshot, context) => {
  const momentDoc = documentSnapshot.data();
  const posterEmail = momentDoc.posterEmail

  // this trigger for auto add room audiences rooms collection
  const { schoolId, classId, studentId } = context.params;
  
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

module.exports = Moments;