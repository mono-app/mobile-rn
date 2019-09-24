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
      const schoolsDocumentRef = db.collection(schoolsCollection.getName()).doc(schoolId);
      const teachersDocumentRef = schoolsDocumentRef.collection(teachersCollection.getName()).doc(teacherEmail);
      await teachersDocumentRef.set({creationTime: firebase.firestore.FieldValue.serverTimestamp(), isActive: false, ...data});

       // insert to userMapping
       const userMappingCollection = new UserMappingCollection();
       const userMappingDocumentRef = db.collection(userMappingCollection.getName()).doc(teacherEmail);
       const schoolsDocumentRef2 = userMappingDocumentRef.collection(schoolsCollection.getName()).doc(schoolId);
       await schoolsDocumentRef2.set({ creationTime: firebase.firestore.FieldValue.serverTimestamp(), role:"teacher" });
 
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
              .collection(schoolsCollection.getName())
              .doc(schoolDocument.getId())
              .collection(classesCollection.getName())
              .doc(classDocument.getId())
              .set({ creationTime: firebase.firestore.FieldValue.serverTimestamp() })

      return Promise.resolve(true);
    } catch (err) {
      console.log(err);
      return Promise.resolve(false);
    }
  }

  static async getTeachers(schoolId) {
    const db = firebase.firestore();
    const teachersCollection = new TeachersCollection();
    const schoolsCollection = new SchoolsCollection();
    const schoolsDocumentRef = db.collection(schoolsCollection.getName()).doc(schoolId);
    const teachersCollectionRef = schoolsDocumentRef.collection(teachersCollection.getName()).orderBy("name", "asc");

    const teachersQuerySnapshot = await teachersCollectionRef.get()

    const teachers = (await teachersQuerySnapshot.docs).map((snap)=> {
      return {id: snap.id, ...snap.data()}
    });

    return Promise.resolve(teachers)
  }

  static async getClassTeachers(schoolId, classId){
    const db = firebase.firestore();
    const teachersCollection = new TeachersCollection();
    const schoolsCollection = new SchoolsCollection();
    const classesCollection = new ClassesCollection();
    const schoolsDocumentRef = db.collection(schoolsCollection.getName()).doc(schoolId);
    const classesDocumentRef = schoolsDocumentRef.collection(classesCollection.getName()).doc(classId);
    const teachersCollectionRef = classesDocumentRef.collection(teachersCollection.getName());

    const teachersQuerySnapshot = await teachersCollectionRef.orderBy("creationTime","desc").get()

    const arrayOfPromise = teachersQuerySnapshot.docs.map(async (snap) => {
      const data = await TeacherAPI.getDetail(schoolId, snap.id)
      return Promise.resolve(data)
    });

    const teachers = await Promise.all(arrayOfPromise);
    teachers.sort((a, b) => (a.name.toLowerCase() > b.name.toLowerCase()) ? 1 : -1)

    return Promise.resolve(teachers)
  }

  static async updateProfilePicture(schoolId, teacherId, storagePath, downloadUrl){
    const db = firebase.firestore();
    const schoolsCollection = new SchoolsCollection();
    const teachersCollection = new TeachersCollection();
    const schoolsDocumentRef = db.collection(schoolsCollection.getName()).doc(schoolId);
    const teachersDocumentRef = schoolsDocumentRef.collection(teachersCollection.getName()).doc(teacherId);
  
    await teachersDocumentRef.update({ "profilePicture": {storagePath, downloadUrl}})
    return Promise.resolve(true)
  }

  static async getDetail(schoolId, email, source = "default") {
    const db = new firebase.firestore();
    const schoolsCollection = new SchoolsCollection();
    const teachersCollection = new TeachersCollection();
    const schoolsDocumentRef = db.collection(schoolsCollection.getName()).doc(schoolId);
    const teachersDocumentRef = schoolsDocumentRef.collection(teachersCollection.getName()).doc(email);
    const teachersSnapshot = await teachersDocumentRef.get({ source });
    const data = { id: teachersSnapshot.id, ...teachersSnapshot.data() };

    return Promise.resolve(data);
  }

  static async isTeacher(schoolId, userEmail){
    const db = new firebase.firestore();
    const schoolsCollection = new SchoolsCollection();
    const teachersCollection = new TeachersCollection();
    const schoolsDocumentRef = db.collection(schoolsCollection.getName()).doc(schoolId);
    const teachersDocumentRef = schoolsDocumentRef.collection(teachersCollection.getName()).doc(userEmail);
    const teachersSnapshot = await teachersDocumentRef.get();

    return Promise.resolve(teachersSnapshot.exists);
  }
}
