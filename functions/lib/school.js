const admin = require("firebase-admin");

function School(){}

School.getUserName = async (schoolId, email) => {
  // get user role
  const db = admin.firestore();
  const userMappingDocumentRef = db.collection("userMapping").doc(email);
  const schoolsDocumentRef = userMappingDocumentRef.collection("schools").doc(schoolId);
  const schoolSnapshot = await schoolsDocumentRef.get();
  const userRole = await schoolSnapshot.data().role

  let name = "-"
  if(userRole==="teacher"){
    const schoolsDocRef = db.collection("schools").doc(schoolId);
    const teachersDocumentRef = schoolsDocRef.collection("teachers").doc(email);
    const teachersSnapshot = await teachersDocumentRef.get();

    name = teachersSnapshot.data().name
  }else if(userRole==="student"){
    const schoolsDocRef = db.collection("schools").doc(schoolId);
    const studentsDocumentRef = schoolsDocRef.collection("students").doc(email);
    const studentSnapshot = await studentsDocumentRef.get();

    name = studentSnapshot.data().name
  }

  return name
}


module.exports = School;
