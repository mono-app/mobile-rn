import firebase from "react-native-firebase";

import { SchoolsCollection, ClassesCollection, TasksCollection, SubmissionsCollection } from "src/api/database/collection";

export default class SubmissionAPI{

  static async addScore(schoolId, classId, taskId, submissionId, data){
    const db = firebase.firestore();
    const schoolsCollection = new SchoolsCollection();
    const classesCollection = new ClassesCollection();
    const tasksCollection = new TasksCollection();
    const submissionsCollection = new SubmissionsCollection();
    const schoolsDocumentRef = db.collection(schoolsCollection.getName()).doc(schoolId);
    const classesDocumentRef = schoolsDocumentRef.collection(classesCollection.getName()).doc(classId);
    const tasksDocumentRef = classesDocumentRef.collection(tasksCollection.getName()).doc(taskId);
    const submissionsDocumentRef = tasksDocumentRef.collection(submissionsCollection.getName()).doc(submissionId);

    submissionsDocumentRef.update({creationTime: firebase.firestore.FieldValue.serverTimestamp(),...data})
    return Promise.resolve(true);
  }
  

  static async getSubmissions(schoolId, classId, taskId) {
    const db = firebase.firestore();
    const schoolsCollection = new SchoolsCollection();
    const classesCollection = new ClassesCollection();
    const tasksCollection = new TasksCollection();
    const submissionsCollection = new SubmissionsCollection();
    const schoolsDocumentRef = db.collection(schoolsCollection.getName()).doc(schoolId);
    const classesDocumentRef = schoolsDocumentRef.collection(classesCollection.getName()).doc(classId);
    const tasksDocumentRef = classesDocumentRef.collection(tasksCollection.getName()).doc(taskId);
    const submissionsCollectionRef = tasksDocumentRef.collection(submissionsCollection.getName());

    const submissionSnapshot = await submissionsCollectionRef.get();

    const submissions = (await submissionSnapshot.docs).map((snap)=> {
      return {id: snap.id, ...snap.data()}
    });

    return Promise.resolve(submissions)
  }


  static async getDetail(schoolId, classId, taskId, studentId) {
    const db = firebase.firestore();
    const schoolsCollection = new SchoolsCollection();
    const classesCollection = new ClassesCollection();
    const tasksCollection = new TasksCollection();
    const submissionsCollection = new SubmissionsCollection();
    const schoolsDocumentRef = db.collection(schoolsCollection.getName()).doc(schoolId);
    const classesDocumentRef = schoolsDocumentRef.collection(classesCollection.getName()).doc(classId);
    const tasksDocumentRef = classesDocumentRef.collection(tasksCollection.getName()).doc(taskId);
    const submissionDocumentRef = tasksDocumentRef.collection(submissionsCollection.getName()).doc(studentId);

    const submissionDocumentSnapshot = await submissionDocumentRef.get();

    const data = {id: submissionDocumentSnapshot.id, ...submissionDocumentSnapshot.data()};
    
    return Promise.resolve(data)
  }


  
}