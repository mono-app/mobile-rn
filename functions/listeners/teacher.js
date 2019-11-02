const functions = require('firebase-functions');
const admin = require("firebase-admin");

function Teacher(){}

Teacher.addTeacherTrigger = functions.region("asia-east2").firestore.document("/schools/{schoolId}/teachers/{teacherId}").onCreate(async (documentSnapshot, context) => {
  const { schoolId, teacherId } = context.params;
  const db = admin.firestore();
  const userMappingRef = db.collection("userMapping").doc(teacherId);
  const userMappingSchoolRef = userMappingRef.collection("schools").doc(schoolId);
  userMappingSchoolRef.set({ creationTime: admin.firestore.FieldValue.serverTimestamp(), role: "teacher" });
})

Teacher.newTempTeacherTrigger = functions.region("asia-east2").firestore.document("/schools/{schoolId}/tempTeachers/{teacherEmail}").onCreate(async (documentSnapshot, context) => {
  const { schoolId, teacherEmail } = context.params;
  const data = documentSnapshot.data()
  const db = admin.firestore();
  
  const userRecord = await admin.auth().createUser({
    email: teacherEmail,
    emailVerified: false,
    password: '123123',
    disabled: false
  })
  const userRef = db.collection("users").doc(userRecord.uid)
  await userRef.set({ 
    email: teacherEmail,
    isCompleteSetup: false,
    phoneNumber: {
      value: "62000000000", isVerified: false
    },
    creationTime: admin.firestore.FieldValue.serverTimestamp()
  })
  const schoolRef = db.collection("schools").doc(schoolId)
  const teacherRef = schoolRef.collection("teachers").doc(userRecord.uid)
  await teacherRef.set({name: data.name, creationTime: admin.firestore.FieldValue.serverTimestamp()})
  await documentSnapshot.ref.delete()
})

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