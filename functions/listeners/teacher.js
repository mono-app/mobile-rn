const functions = require('firebase-functions');
const admin = require("firebase-admin");

function Teacher(){}

Teacher.addTeacherClassTrigger = functions.region("asia-east2").firestore.document("/schools/{schoolId}/classes/{classId}/teachers/{teacherId}").onCreate(async (documentSnapshot, context) => {
  // this trigger for auto add room audiences rooms collection
  const { schoolId, classId, teacherId } = context.params;
  
  const db = admin.firestore();
  const roomsRef = db.collection("rooms");
  const querySnapshot = await roomsRef.where("school.id", "==", schoolId).where("school.classId", "==", classId).get();
  if(!querySnapshot.empty){
    const queryDocumentSnapshot = querySnapshot.docs[0]
    const audiences = queryDocumentSnapshot.data().audiences
    const audiencesQuery = queryDocumentSnapshot.data().audiencesQuery

    audiences.push(teacherId)
    audiencesQuery[teacherId] = true
    queryDocumentSnapshot.ref.update({audiences,audiencesQuery})
  }
  
  return Promise.resolve(true);
})

Teacher.deletedTeacherClassTrigger = functions.region("asia-east2").firestore.document("/schools/{schoolId}/classes/{classId}/teachers/{teacherId}").onDelete(async (documentSnapshot, context) => {
  // this trigger for auto add room audiences rooms collection
  const { schoolId, classId, teacherId } = context.params;
  
  const db = admin.firestore();
  const roomsRef = db.collection("rooms");
  const querySnapshot = await roomsRef.where("school.id", "==", schoolId).where("school.classId", "==", classId).get();
  if(!querySnapshot.empty){
    const queryDocumentSnapshot = querySnapshot.docs[0]
    const audiences = queryDocumentSnapshot.data().audiences
    const audiencesQuery = queryDocumentSnapshot.data().audiencesQuery

    //remove
    const indexToRemove = audiences.indexOf(teacherId);
    if (indexToRemove > -1) {
      audiences.splice(indexToRemove, 1);
    }

    delete audiencesQuery[teacherId]
    queryDocumentSnapshot.ref.update({audiences,audiencesQuery})
  }
  
  return Promise.resolve(true);
})

module.exports = Teacher;