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

    const schools = (await schoolSnapshot.docs).map((snap)=> {
      return {id: snap.id, ...snap.data()}
    });

    return Promise.resolve(schools)
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