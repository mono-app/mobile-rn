const functions = require('firebase-functions');
const admin = require("firebase-admin");

function Student(){}

Student.addStudentClassTrigger = functions.region("asia-east2").firestore.document("/schools/{schoolId}/classes/{classId}/students/{studentId}").onCreate(async (documentSnapshot, context) => {
  // this trigger for auto add room audiences rooms collection
  const { schoolId, classId, studentId } = context.params;
  
  const db = admin.firestore();
  const roomsRef = db.collection("rooms");
  const querySnapshot = await roomsRef.where("school.id", "==", schoolId).where("school.classId", "==", classId).get();
  if(!querySnapshot.empty){
    const queryDocumentSnapshot = querySnapshot.docs[0]
    const audiences = queryDocumentSnapshot.data().audiences
    const audiencesQuery = queryDocumentSnapshot.data().audiencesQuery

    audiences.push(studentId)
    audiencesQuery[studentId] = true
    queryDocumentSnapshot.ref.update({audiences,audiencesQuery})
  }
  
  return Promise.resolve(true);
})

Student.deletedStudentClassTrigger = functions.region("asia-east2").firestore.document("/schools/{schoolId}/classes/{classId}/students/{studentId}").onDelete(async (documentSnapshot, context) => {
  // this trigger for auto add room audiences rooms collection
  const { schoolId, classId, studentId } = context.params;
  
  const db = admin.firestore();
  const roomsRef = db.collection("rooms");
  const querySnapshot = await roomsRef.where("school.id", "==", schoolId).where("school.classId", "==", classId).get();
  if(!querySnapshot.empty){
    const queryDocumentSnapshot = querySnapshot.docs[0]
    const audiences = queryDocumentSnapshot.data().audiences
    const audiencesQuery = queryDocumentSnapshot.data().audiencesQuery

    //remove
    const indexToRemove = audiences.indexOf(studentId);
    if (indexToRemove > -1) {
      audiences.splice(indexToRemove, 1);
    }

    delete audiencesQuery[studentId]
    queryDocumentSnapshot.ref.update({audiences,audiencesQuery})
  }
  
  return Promise.resolve(true);
})

module.exports = Student;