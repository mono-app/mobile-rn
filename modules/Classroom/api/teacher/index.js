import firebase from "react-native-firebase";

import {
  TeachersCollection,
  SchoolsCollection,
  ClassesCollection,
  UserMappingCollection
} from "src/api/database/collection";
import { Document } from "src/api/database/document";

export default class TeacherAPI {
  static async addTeacher(schoolId, teacherEmail, data) {
    try {
      const db = firebase.firestore();
      const teachersCollection = new TeachersCollection();
      const schoolsCollection = new SchoolsCollection();
      const schoolRef = db.collection(schoolsCollection.getName()).doc(schoolId);
      const schoolTeacherRef = schoolRef.collection(teachersCollection.getName()).doc(teacherEmail);
      await schoolTeacherRef.set({creationTime: firebase.firestore.FieldValue.serverTimestamp(), isActive: false, ...data});

       // insert to userMapping
       const userMappingCollection = new UserMappingCollection();
       const userMappingRef = db.collection(userMappingCollection.getName()).doc(teacherEmail);
       const userMappingSchoolRef = userMappingRef.collection(schoolsCollection.getName()).doc(schoolId);
       await userMappingSchoolRef.set({ creationTime: firebase.firestore.FieldValue.serverTimestamp() });
 
      return Promise.resolve(true);
    } catch (err) {
      console.log(err);
      return Promise.resolve(false);
    }
  }

  static async addTeacherClass(teacherEmail, schoolId, classId){
    try {
      const db = firebase.firestore();
      
      const userMappingCollection = new UserMappingCollection()
      const classesCollection = new ClassesCollection()
      const schoolsCollection = new SchoolsCollection()
      const teachersCollection = new TeachersCollection()
      const schoolDocument = new Document(schoolId);
      const teacherDocument = new Document(teacherEmail);
      const classDocument = new Document(classId);

      await db.collection(schoolsCollection.getName())
              .doc(schoolDocument.getId())
              .collection(classesCollection.getName())
              .doc(classDocument.getId())
              .collection(teachersCollection.getName())
              .doc(teacherDocument.getId())
              .set({ creationTime: firebase.firestore.FieldValue.serverTimestamp() })

      await db.collection(userMappingCollection.getName())
              .doc(teacherDocument.getId())
              .collection(classesCollection.getName())
              .doc(classDocument.getId())
              .set({ creationTime: firebase.firestore.FieldValue.serverTimestamp() })

      return Promise.resolve(true);
    } catch (err) {
      console.log(err);
      return Promise.resolve(false);
    }
  }

  getTeachersWithRealTimeUpdate(schoolId, callback) {
    const db = firebase.firestore();
    const teachersCollection = new TeachersCollection();
    const schoolsCollection = new SchoolsCollection();
    const schoolRef = db.collection(schoolsCollection.getName()).doc(schoolId);
    const teacherListDoc = schoolRef.collection(teachersCollection.getName());
    return teacherListDoc.onSnapshot(querySnapshot => {
      if (!querySnapshot.empty) callback(querySnapshot.docs);
      else callback([]);
    });
  }

  async getDetail(schoolId, email, source = "default") {
    const db = new firebase.firestore();
    const teachersCollection = new TeachersCollection();
    const schoolsCollection = new SchoolsCollection();
    const schoolRef = db.collection(schoolsCollection.getName()).doc(schoolId);
    const teacherRef = schoolRef.collection(teachersCollection.getName()).doc(email);
    const documentSnapshot = await teacherRef.get({ source });
    const userData = { id: documentSnapshot.id, ...documentSnapshot.data() };

    return Promise.resolve(userData);
  }
}
