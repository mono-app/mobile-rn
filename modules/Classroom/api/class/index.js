import firebase from "react-native-firebase";

import { ClassesCollection, SchoolsCollection, UserMappingCollection } from "src/api/database/collection";

export default class TeacherAPI{



  async addClass(schoolId, data){
    try{
      const db = firebase.firestore();
      const classesCollection = new ClassesCollection();
      const schoolsCollection = new SchoolsCollection();
      const schoolRef = db.collection(schoolsCollection.getName()).doc(schoolId);
      const schoolTeacherRef = schoolRef.collection(classesCollection.getName()).doc();
      await schoolTeacherRef.set({ creationTime: firebase.firestore.FieldValue.serverTimestamp(), ...data });
      return Promise.resolve(true);
    }catch(err){ 
      console.log(err);
      return Promise.resolve(false); 
    }
  }

  getClassesWithRealTimeUpdate(schoolId, callback) {
    const db = firebase.firestore();
    const classesCollection = new ClassesCollection();
    const schoolsCollection = new SchoolsCollection();
    const schoolRef = db.collection(schoolsCollection.getName()).doc(schoolId);
    const classListDoc = schoolRef.collection(classesCollection.getName());
    return classListDoc.onSnapshot(querySnapshot => {
      if (!querySnapshot.empty) callback(querySnapshot.docs);
      else callback([]);
    });
  }

  getUserClassesWithRealTimeUpdate(email, callback) {
    const db = firebase.firestore();
    const userMappingCollection = new UserMappingCollection();
    const classesCollection = new ClassesCollection();
    const userMappingRef = db.collection(userMappingCollection.getName()).doc(email);
    const classListDoc = userMappingRef.collection(classesCollection.getName());
    return classListDoc.onSnapshot(querySnapshot => {
      if (!querySnapshot.empty) callback(querySnapshot.docs);
      else callback([]);
    });
  }

  async getDetail(schoolId, classId, source = "default") {
    const db = new firebase.firestore();
    const classesCollection = new ClassesCollection();
    const schoolsCollection = new SchoolsCollection();
    const schoolRef = db.collection(schoolsCollection.getName()).doc(schoolId);
    const classRef = schoolRef.collection(classesCollection.getName()).doc(classId);
    const documentSnapshot = await classRef.get({ source });
    const classData = { id: documentSnapshot.id, ...documentSnapshot.data() };

    return Promise.resolve(classData);
  }

}