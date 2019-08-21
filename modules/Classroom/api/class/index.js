import firebase from "react-native-firebase";

import { ClassesCollection, SchoolsCollection, UserMappingCollection } from "src/api/database/collection";

export default class ClassAPI{

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

  
  static async setUnarchive(schoolId, classId) {
    try{
      const db = firebase.firestore();
      const classesCollection = new ClassesCollection();
      const schoolsCollection = new SchoolsCollection();
      const schoolsDocumentRef = db.collection(schoolsCollection.getName()).doc(schoolId);
      const classesDocumentRef = schoolsDocumentRef.collection(classesCollection.getName()).doc(classId);

      await classesDocumentRef.update({ isArchive: false });
      return Promise.resolve(true);
    }catch(err){ 
      console.log(err);
      return Promise.resolve(false); 
    }
  }

  static async setArchive(schoolId, classId) {
    try{
      const db = firebase.firestore();
      const classesCollection = new ClassesCollection();
      const schoolsCollection = new SchoolsCollection();
      const schoolsDocumentRef = db.collection(schoolsCollection.getName()).doc(schoolId);
      const classesDocumentRef = schoolsDocumentRef.collection(classesCollection.getName()).doc(classId);

      await classesDocumentRef.update({ isArchive: true });
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
    const classesCollectionRef = schoolsDocumentRef.collection(classesCollection.getName()).orderBy('subject','asc');

    const classesSnapshot = await classesCollectionRef.get();

    const classDocuments =  (await classesSnapshot.docs).map((snap) => {
      return {id: snap.id, ...snap.data()}
    });

    return Promise.resolve(classDocuments);
  }

  static async getActiveClasses(schoolId) {
    const db = firebase.firestore();
    const classesCollection = new ClassesCollection();
    const schoolsCollection = new SchoolsCollection();
    const schoolsDocumentRef = db.collection(schoolsCollection.getName()).doc(schoolId);
    const classesCollectionRef = schoolsDocumentRef.collection(classesCollection.getName()).where("isArchive","==",false)

    const classesSnapshot = await classesCollectionRef.get();

    const classDocuments =  (await classesSnapshot.docs).map((snap) => {
      return {id: snap.id, ...snap.data()}
    });
    classDocuments.sort((a, b) => (a.subject.toLowerCase() > b.subject.toLowerCase()) ? 1 : -1)

    return Promise.resolve(classDocuments);
  }

  static async getArchiveClasses(schoolId) {
    const db = firebase.firestore();
    const classesCollection = new ClassesCollection();
    const schoolsCollection = new SchoolsCollection();
    const schoolsDocumentRef = db.collection(schoolsCollection.getName()).doc(schoolId);
    const classesCollectionRef = schoolsDocumentRef.collection(classesCollection.getName()).where("isArchive","==",true)

    const classesSnapshot = await classesCollectionRef.get();

    const classDocuments =  (await classesSnapshot.docs).map((snap) => {
      return {id: snap.id, ...snap.data()}
    });
    classDocuments.sort((a, b) => (a.subject.toLowerCase() > b.subject.toLowerCase()) ? 1 : -1)

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
    const arrayOfPromise = classesSnapshot.docs.map(async (snap) => {
      const data = await ClassAPI.getDetail(schoolId, snap.id)
      return Promise.resolve(data)
    });

    const classDocuments = await Promise.all(arrayOfPromise);
    classDocuments.sort((a, b) => (a.subject.toLowerCase() > b.subject.toLowerCase()) ? 1 : -1)

    return Promise.resolve(classDocuments);
  }

  static async getUserActiveClasses(schoolId, email) {
    const db = firebase.firestore();
    const userMappingCollection = new UserMappingCollection();
    const schoolsCollection = new SchoolsCollection();
    const classesCollection = new ClassesCollection();
    const userMappingDocumentRef = db.collection(userMappingCollection.getName()).doc(email);
    const schoolsDocumentRef = userMappingDocumentRef.collection(schoolsCollection.getName()).doc(schoolId);
    const classesCollectionRef = schoolsDocumentRef.collection(classesCollection.getName())
    
    const classesSnapshot = await classesCollectionRef.get();

    const arrayOfPromise = classesSnapshot.docs.map(async (snap) => {
      const data = await ClassAPI.getDetail(schoolId, snap.id)
      return Promise.resolve(data)
    });

    const classDocuments = await Promise.all(arrayOfPromise);

    const filteredClassDocuments = classDocuments.filter((class_)=>{
      return class_.isArchive == false
    })

    filteredClassDocuments.sort((a, b) => (a.subject.toLowerCase() > b.subject.toLowerCase()) ? 1 : -1)

    return Promise.resolve(filteredClassDocuments);
  }

  static async getUserArchiveClasses(schoolId, email) {
    const db = firebase.firestore();
    const userMappingCollection = new UserMappingCollection();
    const schoolsCollection = new SchoolsCollection();
    const classesCollection = new ClassesCollection();
    const userMappingDocumentRef = db.collection(userMappingCollection.getName()).doc(email);
    const schoolsDocumentRef = userMappingDocumentRef.collection(schoolsCollection.getName()).doc(schoolId);
    const classesCollectionRef = schoolsDocumentRef.collection(classesCollection.getName());
    const classesSnapshot = await classesCollectionRef.get();
    const arrayOfPromise = classesSnapshot.docs.map(async (snap) => {
      const data = await ClassAPI.getDetail(schoolId, snap.id)
      return Promise.resolve(data)
    });

    const classDocuments = await Promise.all(arrayOfPromise);

    const filteredClassDocuments = classDocuments.filter((class_)=>{
      return class_.isArchive == true
    })

    filteredClassDocuments.sort((a, b) => (a.subject < b.subject) ? 1 : -1)

    return Promise.resolve(filteredClassDocuments);
  }

  static async getDetail(schoolId, classId) {
    const db = new firebase.firestore();
    const schoolsCollection = new SchoolsCollection();
    const classesCollection = new ClassesCollection();
    const schoolsDocumentRef = db.collection(schoolsCollection.getName()).doc(schoolId);
    const classesDocumentRef = schoolsDocumentRef.collection(classesCollection.getName()).doc(classId);
    const classesSnapshot = await classesDocumentRef.get();
    
    const data = { id: classesSnapshot.id, ...classesSnapshot.data() };
    return Promise.resolve(data);
  }
  
}