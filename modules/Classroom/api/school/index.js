import firebase from "react-native-firebase";

import TeacherAPI from "modules/Classroom/api/teacher"
import StudentAPI from "modules/Classroom/api/student"
import { SchoolsCollection, UserMappingCollection } from "src/api/database/collection";

export default class SchoolAPI{
  static currentSchoolId = ""

  static async getUserSchools(userId) {
    const db = firebase.firestore();
    const userMappingCollection = new UserMappingCollection();
    const schoolsCollection = new SchoolsCollection();
    const userMappingDocumentRef = db.collection(userMappingCollection.getName()).doc(userId);
    const schoolsCollectionRef = userMappingDocumentRef.collection(schoolsCollection.getName());

    const schoolSnapshot = await schoolsCollectionRef.get();

    const arrayOfPromise = schoolSnapshot.docs.map(async (snap) => {
      const detail = await SchoolAPI.getDetail(snap.id)
      return Promise.resolve(detail)
    });

    const schools = await Promise.all(arrayOfPromise);
   
    return Promise.resolve(schools)
  }

  static async getUserRole(schoolId, userId){
    const db = firebase.firestore();
    const userMappingCollection = new UserMappingCollection();
    const schoolsCollection = new SchoolsCollection();
    const userMappingDocumentRef = db.collection(userMappingCollection.getName()).doc(userId);
    const schoolsDocumentRef = userMappingDocumentRef.collection(schoolsCollection.getName()).doc(schoolId);

    const schoolSnapshot = await schoolsDocumentRef.get();


    return Promise.resolve(schoolSnapshot.data().role)
  }

  static async getTotalUserSchools(userId){
    const db = firebase.firestore();
    const userMappingCollection = new UserMappingCollection();
    const schoolsCollection = new SchoolsCollection();
    const userMappingDocumentRef = db.collection(userMappingCollection.getName()).doc(userId);
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

  static async getUserName(schoolId, userId){
    const userRole = await SchoolAPI.getUserRole(schoolId, userId);
    let name = "-"
    if(userRole==="teacher"){
      const teacher = await TeacherAPI.getDetail(schoolId, userId)
      name = teacher.name
    }else if(userRole==="student"){
      const student = await StudentAPI.getDetail(schoolId, userId)
      name = student.name
    }
    return Promise.resolve(name)
  }
  static async getUserDetails(schoolId, userId){
    const userRole = await SchoolAPI.getUserRole(schoolId, userId);
    let name = "-"
    if(userRole==="teacher"){
      const teacher = await TeacherAPI.getDetail(schoolId, userId)
      name = teacher
    }else if(userRole==="student"){
      const student = await StudentAPI.getDetail(schoolId, userId)
      name = student
    }
    return Promise.resolve(name)
  }
}