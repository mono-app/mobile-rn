const admin = require("firebase-admin");

function School(){}

School.getUserName = async (schoolId, id) => {
  // get user role
  const db = admin.firestore();
  const userMappingDocumentRef = db.collection("userMapping").doc(id);
  const schoolsDocumentRef = userMappingDocumentRef.collection("schools").doc(schoolId);
  const schoolSnapshot = await schoolsDocumentRef.get();
  const userRole = await schoolSnapshot.data().role

  let name = "-"
  if(userRole==="teacher"){
    const schoolsDocRef = db.collection("schools").doc(schoolId);
    const teachersDocumentRef = schoolsDocRef.collection("teachers").doc(id);
    const teachersSnapshot = await teachersDocumentRef.get();

    name = teachersSnapshot.data().name
  }else if(userRole==="student"){
    const schoolsDocRef = db.collection("schools").doc(schoolId);
    const studentsDocumentRef = schoolsDocRef.collection("students").doc(id);
    const studentSnapshot = await studentsDocumentRef.get();

    name = studentSnapshot.data().name
  }

  return name
}


module.exports = School;
