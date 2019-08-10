import firebase from "react-native-firebase";

import { SchoolsCollection, SchoolAdminsCollection } from "src/api/database/collection";
import { Document } from "src/api/database/document";

export default class SchoolAdminAPI{

  static async isSchoolAdmin(schoolId, userEmail){
    const db = new firebase.firestore();
    const schoolsCollection = new SchoolsCollection();
    const schoolAdminsCollection = new SchoolAdminsCollection();
    const schoolsDocumentRef = db.collection(schoolsCollection.getName()).doc(schoolId);
    const schoolAdminsDocumentRef = schoolsDocumentRef.collection(schoolAdminsCollection.getName()).doc(userEmail);
    const schoolAdminsSnapshot = await schoolAdminsDocumentRef.get();

    return Promise.resolve(schoolAdminsSnapshot.exists);
  }
}