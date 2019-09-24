import firebase from "react-native-firebase";

import { SchoolsCollection, UserMappingCollection } from "src/api/database/collection";

export default class SchoolAPI{
  static currentSchoolId = ""

  static async getUserSchools(userEmail) {
    const db = firebase.firestore();
    const userMappingCollection = new UserMappingCollection();
    const schoolsCollection = new SchoolsCollection();
    const userMappingDocumentRef = db.collection(userMappingCollection.getName()).doc(userEmail);
    const schoolsCollectionRef = userMappingDocumentRef.collection(schoolsCollection.getName());

    const schoolSnapshot = await schoolsCollectionRef.get();

    const arrayOfPromise = schoolSnapshot.docs.map(async (snap) => {
      const detail = await SchoolAPI.getDetail(snap.id)
      return Promise.resolve(detail)
    });

    const schools = await Promise.all(arrayOfPromise);
   
    return Promise.resolve(schools)
  }

  static async getUserRole(schoolId, userEmail){
    const db = firebase.firestore();
    const userMappingCollection = new UserMappingCollection();
    const schoolsCollection = new SchoolsCollection();
    const userMappingDocumentRef = db.collection(userMappingCollection.getName()).doc(userEmail);
    const schoolsDocumentRef = userMappingDocumentRef.collection(schoolsCollection.getName()).doc(schoolId);

    const schoolSnapshot = await schoolsDocumentRef.get();


    return Promise.resolve(schoolSnapshot.data().role)
  }

  static async getTotalUserSchools(userEmail){
    const db = firebase.firestore();
    const userMappingCollection = new UserMappingCollection();
    const schoolsCollection = new SchoolsCollection();
    const userMappingDocumentRef = db.collection(userMappingCollection.getName()).doc(userEmail);
    const schoolsCollectionRef = userMappingDocumentRef.collection(schoolsCollection.getName());

    const schoolSnapshot = await schoolsCollectionRef.get();

   
    return Promise.resolve(schoolSnapshot.size)
  }

  static async updateSchoolProfilePicture(schoolId, storagePath, downloadUrl){
    const db = firebase.firestore();
    const schoolsCollection = new SchoolsCollection();
    const schoolsDocumentRef = db.collection(schoolsCollection.getName()).doc(schoolId);
    await schoolsDocumentRef.update({"profilePicture": {storagePath, downloadUrl} })
    return Promise.resolve(true)
  }

  static async getDetail(schoolId) {
    const db = new firebase.firestore();
    const schoolsCollection = new SchoolsCollection();
    const schoolsDocumentRef = db.collection(schoolsCollection.getName()).doc(schoolId);
    const schoolsSnapshot = await schoolsDocumentRef.get();
    const data = { id: schoolsSnapshot.id, ...schoolsSnapshot.data() };

    return Promise.resolve(data);
  }
}