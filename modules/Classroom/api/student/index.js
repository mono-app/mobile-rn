import firebase from "react-native-firebase";

import { StudentsCollection, SchoolsCollection } from "src/api/database/collection";

export default class StudentAPI{


  
  async addStudent(schoolId, studentEmail, data){
    try{
      const db = firebase.firestore();
      const studentsCollection = new StudentsCollection();
      const schoolsCollection = new SchoolsCollection();
      const schoolRef = db.collection(schoolsCollection.getName()).doc(schoolId);
      const schoolStudentRef = schoolRef.collection(studentsCollection.getName()).doc(studentEmail);
      await schoolStudentRef.set({ creationTime: firebase.firestore.FieldValue.serverTimestamp(), isActive: false, ...data });
      return Promise.resolve(true);
    }catch(err){ 
      console.log(err);
      return Promise.resolve(false); 
    }
  }

  
  getStudentsWithRealTimeUpdate(schoolId, callback) {
    const db = firebase.firestore();
    const studentsCollection = new StudentsCollection();
    const schoolsCollection = new SchoolsCollection();
    const schoolRef = db.collection(schoolsCollection.getName()).doc(schoolId);
    const studentListDoc = schoolRef.collection(studentsCollection.getName());
    return studentListDoc.onSnapshot(querySnapshot => {
      if (!querySnapshot.empty) callback(querySnapshot.docs);
      else callback([]);
    });
  }

  async getDetail(schoolId, email, source = "default") {
    const db = new firebase.firestore();
    const studentsCollection = new StudentsCollection();
    const schoolsCollection = new SchoolsCollection();
    const schoolRef = db.collection(schoolsCollection.getName()).doc(schoolId);
    const studentRef = schoolRef.collection(studentsCollection.getName()).doc(email);
    const documentSnapshot = await studentRef.get({ source });
    const userData = { id: documentSnapshot.id, ...documentSnapshot.data() };

    return Promise.resolve(userData);
  }
}