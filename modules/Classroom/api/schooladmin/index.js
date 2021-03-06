import firebase from "react-native-firebase";

import { SchoolsCollection, SchoolAdminsCollection } from "src/api/database/collection";

export default class SchoolAdminAPI{

  static async isSchoolAdmin(schoolId, userId){
    const db = new firebase.firestore();
    const schoolsCollection = new SchoolsCollection();
    const schoolAdminsCollection = new SchoolAdminsCollection();
    const schoolsDocumentRef = db.collection(schoolsCollection.getName()).doc(schoolId);
    const schoolAdminsDocumentRef = schoolsDocumentRef.collection(schoolAdminsCollection.getName()).doc(userId);
    const schoolAdminsSnapshot = await schoolAdminsDocumentRef.get();

    return Promise.resolve(schoolAdminsSnapshot.exists);
  }

  static async getDetail(schoolId, userId) {
    const db = new firebase.firestore();
    const schoolsCollection = new SchoolsCollection();
    const schoolAdminsCollection = new SchoolAdminsCollection();

    const schoolsDocumentRef = db.collection(schoolsCollection.getName()).doc(schoolId);
    const schoolAdminsDocumentRef = schoolsDocumentRef.collection(schoolAdminsCollection.getName()).doc(userId);
    const documentSnapshot = await schoolAdminsDocumentRef.get();
    const data = { id: documentSnapshot.id, ...documentSnapshot.data() };

    return Promise.resolve(data);
  }

}