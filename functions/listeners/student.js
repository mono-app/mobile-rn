const functions = require('firebase-functions');
const admin = require("firebase-admin");

function Student(){}

Student.addStudentTrigger = functions.region("asia-east2").firestore.document("/schools/{schoolId}/students/{studentId}").onCreate(async (documentSnapshot, context) => {
  const { schoolId, studentId } = context.params;
  const db = admin.firestore();
  const userMappingRef = db.collection("userMapping").doc(studentId);
  const userMappingSchoolRef = userMappingRef.collection("schools").doc(schoolId);
  userMappingSchoolRef.set({ creationTime: admin.firestore.FieldValue.serverTimestamp(), role: "student" });
})

Student.newTempStudentTrigger = functions.region("asia-east2").firestore.document("/schools/{schoolId}/tempStudents/{studentEmail}").onCreate(async (documentSnapshot, context) => {
  const { schoolId, studentEmail } = context.params;
  const data = documentSnapshot.data()
  const db = admin.firestore();
  
  const userRecord = await admin.auth().createUser({
    email: studentEmail,
    emailVerified: false,
    password: '123123',
    disabled: false
  })
  const userRef = db.collection("users").doc(userRecord.uid)
  await userRef.set({ 
    email: studentEmail,
    isCompleteSetup: false,
    phoneNumber: {
      value: "000000", isVerified: false
    },
    creationTime: admin.firestore.FieldValue.serverTimestamp()
  })
  const schoolRef = db.collection("schools").doc(schoolId)
  const studentRef = schoolRef.collection("students").doc(userRecord.uid)
  await studentRef.set({name: data.name, creationTime: admin.firestore.FieldValue.serverTimestamp()})
  await documentSnapshot.ref.delete()
})

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