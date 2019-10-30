import firebase from "react-native-firebase";

import { StudentsCollection, SchoolsCollection, UserMappingCollection, ClassesCollection, UserCollection, TempStudentsCollection } from "src/api/database/collection";
import { Document } from "src/api/database/document";
import PeopleAPI from "src/api/people";
import Email from "src/entities/email";
import Database from "src/api/database";
import CustomError from "src/entities/error";

export default class StudentAPI{

  /**
   * 
   * @param {String} schoolId 
   * @param {String} studentEmail 
   * @param {Object} data 
   */
  static async addStudent(school, student){
    try{
      student.id = (await PeopleAPI.getDetailByEmail(student.email, true)).id
      if((await StudentAPI.isExistById(school, student.id))) throw new CustomError("student/email-already-in-user","Email already in used")

      await Database.insert(async (db)=> {
        const schoolsCollection = new SchoolsCollection();
        const studentsCollection = new StudentsCollection();
        const schoolsDocumentRef = db.collection(schoolsCollection.getName()).doc(school.id);
        const studentRef = schoolsDocumentRef.collection(studentsCollection.getName()).doc(student.id);
        studentRef.set({name: student.name, creationTime: firebase.firestore.FieldValue.serverTimestamp()})
      })
    }catch(err){ 
      if(err.code==="user/not-found") {
        await Database.insert(async (db)=> {
          const schoolsCollection = new SchoolsCollection();
          const tempStudentsCollection = new TempStudentsCollection();
          const schoolsDocumentRef = db.collection(schoolsCollection.getName()).doc(school.id);
          const tempStudentRef = schoolsDocumentRef.collection(tempStudentsCollection.getName()).doc(student.email);
          tempStudentRef.set({name: student.email, creationTime: firebase.firestore.FieldValue.serverTimestamp()})
        })
      }else throw err
    }

    return Promise.resolve(true)
  }
  
  static async addStudentClass(studentId, schoolId, classId){
    try {
      const db = firebase.firestore();
      
      const userMappingCollection = new UserMappingCollection()
      const classesCollection = new ClassesCollection()
      const schoolsCollection = new SchoolsCollection()
      const studentsCollection = new StudentsCollection()
      const schoolDocument = new Document(schoolId);
      const studentDocument = new Document(studentId);
      const classDocument = new Document(classId);

      await db.collection(schoolsCollection.getName())
              .doc(schoolDocument.getId())
              .collection(classesCollection.getName())
              .doc(classDocument.getId())
              .collection(studentsCollection.getName())
              .doc(studentDocument.getId())
              .set({ creationTime: firebase.firestore.FieldValue.serverTimestamp() })

      await db.collection(userMappingCollection.getName())
              .doc(studentDocument.getId())
              .collection(schoolsCollection.getName())
              .doc(schoolDocument.getId())
              .collection(classesCollection.getName())
              .doc(classDocument.getId())
              .set({ creationTime: firebase.firestore.FieldValue.serverTimestamp() })

      return Promise.resolve(true);
    } catch (err) {
      return Promise.resolve(false);
    }
  }

  static async saveFinalScoreStudent(schoolId, classId, studentId, updateObject){
    const db = firebase.firestore();
    const schoolsCollection = new SchoolsCollection();
    const classesCollection = new ClassesCollection();
    const studentsCollection = new StudentsCollection();
    const schoolsDocumentRef = db.collection(schoolsCollection.getName()).doc(schoolId);
    const classesDocumentRef = schoolsDocumentRef.collection(classesCollection.getName()).doc(classId);
    const studentsDocumentRef = classesDocumentRef.collection(studentsCollection.getName()).doc(studentId);
    await studentsDocumentRef.update(updateObject)
    return Promise.resolve(true);
  }

  
  static async getStudents(schoolId) {
    const db = firebase.firestore();
    const studentsCollection = new StudentsCollection();
    const schoolsCollection = new SchoolsCollection();
    const schoolsDocumentRef = db.collection(schoolsCollection.getName()).doc(schoolId);
    const studentsCollectionRef = schoolsDocumentRef.collection(studentsCollection.getName()).orderBy("name", "asc");
    const studentSnapshot = await studentsCollectionRef.get();
    const studentDocuments = (await studentSnapshot.docs).map((snap) => {
      return {id: snap.id, ...snap.data()}
    });

    return Promise.resolve(studentDocuments);
  }

  static async updateDiscussionNotification(studentId, discussionId, isAllowNotif){

    const db = firebase.firestore();
    const userCollection = new UserCollection();
    const usersDocumentRef = db.collection(userCollection.getName()).doc(studentId);

    if(isAllowNotif){
      await usersDocumentRef.update({settings: {ignoreNotifications: {discussions: firebase.firestore.FieldValue.arrayRemove({id: discussionId})}}})
    }else{
      const docSnapshot = await usersDocumentRef.get()
      const data = docSnapshot.data()

      if(data.settings && 
        data.settings.ignoreNotifications && 
        data.settings.ignoreNotifications.discussions && data.settings.ignoreNotifications.discussions.length>0){
          let newArray = JSON.parse(JSON.stringify(data.settings.ignoreNotifications.discussions))
          let allowPush = true
          for(const obj of newArray){
            if(obj.id==discussionId){
              allowPush=false
              break
            }
          }
          if(allowPush){
            newArray.push({id: discussionId})
            await usersDocumentRef.update({settings: {ignoreNotifications: {discussions: newArray}}})
          }
         
      }else{
        await usersDocumentRef.update({settings: {ignoreNotifications: {discussions: firebase.firestore.FieldValue.arrayUnion({id: discussionId})}}})
      }
    }
    return Promise.resolve(true);
  }

  static async getClassStudent(schoolId, classId){
    const db = firebase.firestore();
    const schoolsCollection = new SchoolsCollection();
    const classesCollection = new ClassesCollection();
    const studentsCollection = new StudentsCollection();
    const schoolsDocumentRef = db.collection(schoolsCollection.getName()).doc(schoolId);
    const classesDocumentRef = schoolsDocumentRef.collection(classesCollection.getName()).doc(classId);
    let studentsCollectionRef = classesDocumentRef.collection(studentsCollection.getName());

    const studentSnapshot = await studentsCollectionRef.get();
    const arrayOfPromise = studentSnapshot.docs.map(async (snap) => {
      const student = await StudentAPI.getDetail(schoolId, snap.id)
      return Promise.resolve({...student, finalScore: snap.data().finalScore})
    });
    
    const studentDocuments = await Promise.all(arrayOfPromise);
    studentDocuments.sort((a, b) => ((a.name && b.name)&&a.name.toLowerCase() > b.name.toLowerCase()) ? 1 : -1)

    return Promise.resolve(studentDocuments);
  }

  
  static async getTotalClassStudent(schoolId, classId){
    const db = firebase.firestore();
    const schoolsCollection = new SchoolsCollection();
    const classesCollection = new ClassesCollection();
    const studentsCollection = new StudentsCollection();
    const schoolsDocumentRef = db.collection(schoolsCollection.getName()).doc(schoolId);
    const classesDocumentRef = schoolsDocumentRef.collection(classesCollection.getName()).doc(classId);
    const studentsCollectionRef = classesDocumentRef.collection(studentsCollection.getName());

    const studentSnapshot = await studentsCollectionRef.get();
   
    return Promise.resolve(studentSnapshot.size);
  }

  static async getDetail(schoolId, userId) {
    const db = firebase.firestore();
    const studentsCollection = new StudentsCollection();
    const schoolsCollection = new SchoolsCollection();
    const schoolsDocumentRef = db.collection(schoolsCollection.getName()).doc(schoolId);
    const studentsDocumentRef = schoolsDocumentRef.collection(studentsCollection.getName()).doc(userId);
    const documentSnapshot = await studentsDocumentRef.get();
    const user = await PeopleAPI.getDetailById(userId, true)
    const data = { id: documentSnapshot.id, ...documentSnapshot.data(), email: user.email, phoneNumber: user.phoneNumber.number };
    return Promise.resolve(data);
  }
  
  static async updateProfilePicture(schoolId, studentId, storagePath, downloadUrl){
    const db = firebase.firestore();
    const schoolsCollection = new SchoolsCollection();
    const studentsCollection = new StudentsCollection();
    const schoolsDocumentRef = db.collection(schoolsCollection.getName()).doc(schoolId);
    const studentsDocumentRef = schoolsDocumentRef.collection(studentsCollection.getName()).doc(studentId);
  
    await studentsDocumentRef.update({ "profilePicture": {storagePath, downloadUrl}})
    return Promise.resolve(true)
  }

  static async isStudent(schoolId, userId){
    const db = firebase.firestore();
    const schoolsCollection = new SchoolsCollection();
    const studentsCollection = new StudentsCollection();
    const schoolsDocumentRef = db.collection(schoolsCollection.getName()).doc(schoolId);
    const studentsDocumentRef = schoolsDocumentRef.collection(studentsCollection.getName()).doc(userId);
    const studentsSnapshot = await studentsDocumentRef.get();

    return Promise.resolve(studentsSnapshot.exists);
  }

  static async isExistById(school, studentId){
    const result = await Database.get(async (db) => {
      const schoolCollection = new SchoolsCollection()
      const studentsCollection = new StudentsCollection()
      const schoolRef = db.collection(schoolCollection.getName()).doc(school.id)
      const studentRef = schoolRef.collection(studentsCollection.getName()).doc(studentId)
      const studentSnapshot = await studentRef.get()
      return studentSnapshot.exists
    } ,true)
    return result
  }

}
