import firebase from "react-native-firebase";

import { SchoolsCollection, ClassesCollection, FilesCollection } from "src/api/database/collection";

export default class FileAPI{


  
  static async getFiles(schoolId, classId) {
    const db = firebase.firestore();
    const schoolsCollection = new SchoolsCollection();
    const classesCollection = new ClassesCollection();
    const filesCollection = new FilesCollection();
    const schoolsDocumentRef = db.collection(schoolsCollection.getName()).doc(schoolId);
    const classesDocumentRef = schoolsDocumentRef.collection(classesCollection.getName()).doc(classId);
    const filesCollectionRef = classesDocumentRef.collection(filesCollection.getName());

    const filesQuerySnapshot = await filesCollectionRef.get();

    const files = (await filesQuerySnapshot.docs).map((snap)=> {
      return {id: snap.id, ...snap.data()}
    });

    return Promise.resolve(files)
  }

  static async getDetail(schoolId, classId, fileId, source = "default") {
    const db = new firebase.firestore();
    const schoolsCollection = new SchoolsCollection();
    const classesCollection = new ClassesCollection();
    const filesCollection = new FilesCollection();
    const schoolDocumentRef = db.collection(schoolsCollection.getName()).doc(schoolId);
    const classDocumentRef = schoolDocumentRef.collection(classesCollection.getName()).doc(classId);
    const filesDocumentRef = classDocumentRef.collection(filesCollection.getName()).doc(fileId);

    const filesDocumentSnapshot = await filesDocumentRef.get({ source });
    const data = { id: filesDocumentSnapshot.id, ...filesDocumentSnapshot.data() };

    return Promise.resolve(data);
  }

  static async delete(schoolId, classId, file) {
    const db = new firebase.firestore();
    const schoolsCollection = new SchoolsCollection();
    const classesCollection = new ClassesCollection();
    const filesCollection = new FilesCollection();
    const schoolDocumentRef = db.collection(schoolsCollection.getName()).doc(schoolId);
    const classDocumentRef = schoolDocumentRef.collection(classesCollection.getName()).doc(classId);
    const filesDocumentRef = classDocumentRef.collection(filesCollection.getName()).doc(file.id);

    const promises = []
    promises.push(filesDocumentRef.delete())
    promises.push(new firebase.storage().ref(file.storage.storagePath).delete())
    await Promise.all(promises);
   
    return Promise.resolve(true);
  }
}