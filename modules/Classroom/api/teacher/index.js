import firebase from "react-native-firebase";
import Email from "src/entities/email";
import {
  TeachersCollection,
  SchoolsCollection,
  ClassesCollection,
  UserMappingCollection,
  TempTeachersCollection
} from "src/api/database/collection";
import { Document } from "src/api/database/document";
import Database from "src/api/database";
import PeopleAPI from "src/api/people";
import CustomError from "src/entities/error";

export default class TeacherAPI {
  static async addTeacher(school, teacher) {
    try{
      teacher.id = (await PeopleAPI.getDetailByEmail(teacher.email, true)).id
      if((await TeacherAPI.isExistById(school, teacher.id))) throw new CustomError("teacher/email-already-in-user","Email already in used")

      await Database.insert(async (db)=> {
        const schoolsCollection = new SchoolsCollection();
        const teachersCollection = new TeachersCollection();
        const schoolsDocumentRef = db.collection(schoolsCollection.getName()).doc(school.id);
        const teacherRef = schoolsDocumentRef.collection(teachersCollection.getName()).doc(teacher.id);
        teacherRef.set({name: teacher.name, creationTime: firebase.firestore.FieldValue.serverTimestamp()})
      })
    }catch(err){ 
      if(err.code==="user/not-found") {
        await Database.insert(async (db)=> {
          const schoolsCollection = new SchoolsCollection();
          const tempTeachersCollection = new TempTeachersCollection();
          const schoolsDocumentRef = db.collection(schoolsCollection.getName()).doc(school.id);
          const tempTeacherRef = schoolsDocumentRef.collection(tempTeachersCollection.getName()).doc(teacher.email);
          tempTeacherRef.set({name: teacher.name, creationTime: firebase.firestore.FieldValue.serverTimestamp()})
        })
      }else throw err
    }

    return Promise.resolve(true)
  }

  static async addTeacherClass(teacherId, schoolId, classId){
    try {
      const db = firebase.firestore();
      
      const userMappingCollection = new UserMappingCollection()
      const classesCollection = new ClassesCollection()
      const schoolsCollection = new SchoolsCollection()
      const teachersCollection = new TeachersCollection()
      const schoolDocument = new Document(schoolId);
      const teacherDocument = new Document(teacherId);
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

  static async getDetail(schoolId, userId, source = "default") {
    const db = new firebase.firestore();
    const schoolsCollection = new SchoolsCollection();
    const teachersCollection = new TeachersCollection();
    const schoolsDocumentRef = db.collection(schoolsCollection.getName()).doc(schoolId);
    const teachersDocumentRef = schoolsDocumentRef.collection(teachersCollection.getName()).doc(userId);
    const teachersSnapshot = await teachersDocumentRef.get({ source });
    const user = await PeopleAPI.getDetailById(userId, true)
    const data = { id: teachersSnapshot.id, ...teachersSnapshot.data(), email: user.email, phoneNumber: user.phoneNumber.number };

    return Promise.resolve(data);
  }

  static async isTeacher(schoolId, userId){
    const db = new firebase.firestore();
    const schoolsCollection = new SchoolsCollection();
    const teachersCollection = new TeachersCollection();
    const schoolsDocumentRef = db.collection(schoolsCollection.getName()).doc(schoolId);
    const teachersDocumentRef = schoolsDocumentRef.collection(teachersCollection.getName()).doc(userId);
    const teachersSnapshot = await teachersDocumentRef.get();

    return Promise.resolve(teachersSnapshot.exists);
  }

  static async isExistById(school, teacherId){
    const result = await Database.get(async (db) => {
      const schoolCollection = new SchoolsCollection()
      const teachersCollection = new TeachersCollection()
      const schoolRef = db.collection(schoolCollection.getName()).doc(school.id)
      const teacherRef = schoolRef.collection(teachersCollection.getName()).doc(teacherId)
      const teachersSnapshot = await teacherRef.get()
      return teachersSnapshot.exists
    } ,true)
    return result
  }

}
