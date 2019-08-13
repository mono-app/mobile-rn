import firebase from "react-native-firebase";

import { StudentsCollection, SchoolsCollection, UserMappingCollection, ClassesCollection } from "src/api/database/collection";
import { Document } from "src/api/database/document";

export default class StudentAPI{

  async addStudent(schoolId, studentEmail, data){
    try{
      const db = firebase.firestore();
      const studentsCollection = new StudentsCollection();
      const schoolsCollection = new SchoolsCollection();
      const schoolsDocumentRef = db.collection(schoolsCollection.getName()).doc(schoolId);
      const schoolStudentRef = schoolsDocumentRef.collection(studentsCollection.getName()).doc(studentEmail);
      await schoolStudentRef.set({ creationTime: firebase.firestore.FieldValue.serverTimestamp(), isActive: false, ...data });

      // insert to userMapping
      const userMappingCollection = new UserMappingCollection();
      const userMappingRef = db.collection(userMappingCollection.getName()).doc(studentEmail);
      const userMappingSchoolRef = userMappingRef.collection(schoolsCollection.getName()).doc(schoolId);
      await userMappingSchoolRef.set({ creationTime: firebase.firestore.FieldValue.serverTimestamp() });

      
      return Promise.resolve(true);
    }catch(err){ 
      return Promise.resolve(false); 
    }
  }

  
  static async addStudentClass(studentEmail, schoolId, classId){
    try {
      const db = firebase.firestore();
      
      const userMappingCollection = new UserMappingCollection()
      const classesCollection = new ClassesCollection()
      const schoolsCollection = new SchoolsCollection()
      const studentsCollection = new StudentsCollection()
      const schoolDocument = new Document(schoolId);
      const studentDocument = new Document(studentEmail);
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
    const studentsCollectionRef = schoolsDocumentRef.collection(studentsCollection.getName());
    const studentSnapshot = await studentsCollectionRef.get();
    const studentDocuments = (await studentSnapshot.docs).map((snap) => {
      return {id: snap.id, ...snap.data()}
    });

    return Promise.resolve(studentDocuments);
  
  }

  static async getClassStudent(schoolId, classId){
    const db = firebase.firestore();
    const studentsCollection = new StudentsCollection();
    const schoolsCollection = new SchoolsCollection();
    const classesCollection = new ClassesCollection();
    const schoolsDocumentRef = db.collection(schoolsCollection.getName()).doc(schoolId);
    const classesDocumentRef = schoolsDocumentRef.collection(classesCollection.getName()).doc(classId);
    let studentsCollectionRef = classesDocumentRef.collection(studentsCollection.getName());

    const studentSnapshot = await studentsCollectionRef.get();
    const arrayOfPromise = studentSnapshot.docs.map(async (snap) => {
      const student = await StudentAPI.getDetail(schoolId, snap.id)
      return Promise.resolve({...student, finalScore: snap.data().finalScore})
    });

    const studentDocuments = await Promise.all(arrayOfPromise);

    return Promise.resolve(studentDocuments);
  }

  static async getDetail(schoolId, email, source = "default") {
    const db = new firebase.firestore();
    const studentsCollection = new StudentsCollection();
    const schoolsCollection = new SchoolsCollection();
    const schoolsDocumentRef = db.collection(schoolsCollection.getName()).doc(schoolId);
    const studentsDocumentRef = schoolsDocumentRef.collection(studentsCollection.getName()).doc(email);
    const documentSnapshot = await studentsDocumentRef.get({ source });
    const data = { id: documentSnapshot.id, ...documentSnapshot.data() };

    return Promise.resolve(data);
  }

  static async isStudent(schoolId, userEmail){
    const db = new firebase.firestore();
    const schoolsCollection = new SchoolsCollection();
    const studentsCollection = new StudentsCollection();
    const schoolsDocumentRef = db.collection(schoolsCollection.getName()).doc(schoolId);
    const studentsDocumentRef = schoolsDocumentRef.collection(studentsCollection.getName()).doc(userEmail);
    const studentsSnapshot = await studentsDocumentRef.get();

    return Promise.resolve(studentsSnapshot.exists);
  }
}