import firebase from "react-native-firebase";

import { SchoolsCollection, ClassesCollection, TasksCollection } from "src/api/database/collection";

export default class TaskAPI{

  static async addTask(schoolId, classId, data){
    try{
      const db = firebase.firestore();
      const classesCollection = new ClassesCollection();
      const schoolsCollection = new SchoolsCollection();
      const tasksCollection = new TasksCollection();
      
      const schoolsDocumentRef = db.collection(schoolsCollection.getName()).doc(schoolId);
      const classesDocumentRef = schoolsDocumentRef.collection(classesCollection.getName()).doc(classId);
      const tasksDocumentRef = classesDocumentRef.collection(tasksCollection.getName()).doc();
      await tasksDocumentRef.set({ creationTime: firebase.firestore.FieldValue.serverTimestamp(), ...data });
      
      return Promise.resolve(true);
    }catch(err){ 
      console.log(err);
      return Promise.resolve(false); 
    }
  }

  static async getTasks(schoolId, classId) {
    const db = firebase.firestore();
    const classesCollection = new ClassesCollection();
    const schoolsCollection = new SchoolsCollection();
    const tasksCollection = new TasksCollection();
    const schoolsDocumentRef = db.collection(schoolsCollection.getName()).doc(schoolId);
    const classesDocumentRef = schoolsDocumentRef.collection(classesCollection.getName()).doc(classId);
    const tasksCollectionRef = classesDocumentRef.collection(tasksCollection.getName());

    const taskSnapshot = await tasksCollectionRef.get();

    const task = (await taskSnapshot.docs).map((snap)=> {
      return {id: snap.id, ...snap.data()}
    });

    return Promise.resolve(task)
  }

  
  async getDetail(schoolId, classId, taskId, source = "default") {
    const db = new firebase.firestore();
    const classesCollection = new ClassesCollection();
    const schoolsCollection = new SchoolsCollection();
    const tasksCollection = new TasksCollection();
    const schoolsDocumentRef = db.collection(schoolsCollection.getName()).doc(schoolId);
    const classesDocumentRef = schoolsDocumentRef.collection(classesCollection.getName()).doc(classId);
    const tasksDocumentRef = classesDocumentRef.collection(tasksCollection.getName()).doc(taskId);
    const documentSnapshot = await tasksDocumentRef.get({ source });
    const data = { id: documentSnapshot.id, ...documentSnapshot.data() };
   
    return Promise.resolve(data);
  }


  
}