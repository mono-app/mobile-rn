import firebase from "react-native-firebase";

import { ClassesCollection, SchoolsCollection, UserMappingCollection } from "src/api/database/collection";

export default class TeacherAPI{



  async addClass(schoolId, data){
    try{
      const db = firebase.firestore();
      const classesCollection = new ClassesCollection();
      const schoolsCollection = new SchoolsCollection();
      const schoolsDocumentRef = db.collection(schoolsCollection.getName()).doc(schoolId);
      const classesDocumentRef = schoolsDocumentRef.collection(classesCollection.getName()).doc();
      await classesDocumentRef.set({ creationTime: firebase.firestore.FieldValue.serverTimestamp(), ...data });
      return Promise.resolve(true);
    }catch(err){ 
      console.log(err);
      return Promise.resolve(false); 
    }
  }

  static async getClasses(schoolId) {
    const db = firebase.firestore();
    const classesCollection = new ClassesCollection();
    const schoolsCollection = new SchoolsCollection();
    const schoolsDocumentRef = db.collection(schoolsCollection.getName()).doc(schoolId);
    const classesCollectionRef = schoolsDocumentRef.collection(classesCollection.getName());

    const classesSnapshot = await classesCollectionRef.get();

    const classDocuments =  (await classesSnapshot.docs).map((snap) => {
      return {id: snap.id, ...snap.data()}
    });

    return Promise.resolve(classDocuments);
  }
  

  static async getUserClasses(schoolId, email) {
    const db = firebase.firestore();
    const userMappingCollection = new UserMappingCollection();
    const schoolsCollection = new SchoolsCollection();
    const classesCollection = new ClassesCollection();
    const userMappingDocumentRef = db.collection(userMappingCollection.getName()).doc(email);
    const schoolsDocumentRef = userMappingDocumentRef.collection(schoolsCollection.getName()).doc(schoolId);
    const classesCollectionRef = schoolsDocumentRef.collection(classesCollection.getName());

    const classesSnapshot = await classesCollectionRef.get();
    const classDocuments = (await classesSnapshot.docs).map((snap)=>{
      return {id: snap.id, ...snap.data()}
    });
    return Promise.resolve(classDocuments);

  }

  async getDetail(schoolId, classId, source = "default") {
    const db = new firebase.firestore();
    const classesCollection = new ClassesCollection();
    const schoolsCollection = new SchoolsCollection();
    const schoolsDocumentRef = db.collection(schoolsCollection.getName()).doc(schoolId);
    const classesDocumentRef = schoolsDocumentRef.collection(classesCollection.getName()).doc(classId);
    const documentSnapshot = await classesDocumentRef.get({ source });
    const data = { id: documentSnapshot.id, ...documentSnapshot.data() };

    return Promise.resolve(data);
  }

}