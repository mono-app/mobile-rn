import firebase from "react-native-firebase";

import { StudentsCollection, SchoolsCollection, UserMappingCollection, ClassesCollection } from "src/api/database/collection";
import { Document } from "src/api/database/document";

export default class StudentAPI{

  async addStudent(schoolId, studentEmail, data){
    try{
      const db = firebase.firestore();
      const studentsCollection = new StudentsCollection();
      const schoolsCollection = new SchoolsCollection();
      const schoolRef = db.collection(schoolsCollection.getName()).doc(schoolId);
      const schoolStudentRef = schoolRef.collection(studentsCollection.getName()).doc(studentEmail);
      await schoolStudentRef.set({ creationTime: firebase.firestore.FieldValue.serverTimestamp(), isActive: false, ...data });

      // insert to userMapping
      const userMappingCollection = new UserMappingCollection();
      const userMappingRef = db.collection(userMappingCollection.getName()).doc(studentEmail);
      const userMappingSchoolRef = userMappingRef.collection(schoolsCollection.getName()).doc(schoolId);
      await userMappingSchoolRef.set({ creationTime: firebase.firestore.FieldValue.serverTimestamp() });

      
      return Promise.resolve(true);
    }catch(err){ 
      console.log(err);
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
              .collection(classesCollection.getName())
              .doc(classDocument.getId())
              .set({ creationTime: firebase.firestore.FieldValue.serverTimestamp() })

      return Promise.resolve(true);
    } catch (err) {
      console.log(err);
      return Promise.resolve(false);
    }
  }

  
  getStudentsWithRealTimeUpdate(schoolId, callback) {
    const db = firebase.firestore();
    const studentsCollection = new StudentsCollection();
    const schoolsCollection = new SchoolsCollection();
    const schoolRef = db.collection(schoolsCollection.getName()).doc(schoolId);
    const studentListDoc = schoolRef.collection(studentsCollection.getName());
    return studentListDoc.onSnapshot(querySnapshot => {
      if (!querySnapshot.empty) callback(querySnapshot.docs);
      else callback([]);
    });
  }

  getClassStudentWithRealTimeUpdate(schoolId, classId, callback){
    const db = firebase.firestore();
    const studentsCollection = new StudentsCollection();
    const schoolsCollection = new SchoolsCollection();
    const classesCollection = new ClassesCollection();
    const schoolRef = db.collection(schoolsCollection.getName()).doc(schoolId);
    const classRef = schoolRef.collection(classesCollection.getName()).doc(classId);
    const studentListDoc = classRef.collection(studentsCollection.getName());

    return studentListDoc.onSnapshot(querySnapshot => {
      if (!querySnapshot.empty) callback(querySnapshot.docs);
      else callback([]);
    });
  }

  async getDetail(schoolId, email, source = "default") {
    const db = new firebase.firestore();
    const studentsCollection = new StudentsCollection();
    const schoolsCollection = new SchoolsCollection();
    const schoolRef = db.collection(schoolsCollection.getName()).doc(schoolId);
    const studentRef = schoolRef.collection(studentsCollection.getName()).doc(email);
    const documentSnapshot = await studentRef.get({ source });
    const userData = { id: documentSnapshot.id, ...documentSnapshot.data() };

    return Promise.resolve(userData);
  }
}