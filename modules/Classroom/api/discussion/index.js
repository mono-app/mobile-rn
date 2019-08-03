import firebase from "react-native-firebase";

import { SchoolsCollection, ClassesCollection, TasksCollection, DiscussionsCollection } from "src/api/database/collection";

export default class DiscussionAPI{

  static async getDiscussions(schoolId, classId, taskId) {
    const db = firebase.firestore();
    const schoolsCollection = new SchoolsCollection();
    const classesCollection = new ClassesCollection();
    const tasksCollection = new TasksCollection();
    const discussionsCollection = new DiscussionsCollection();
    const schoolsDocumentRef = db.collection(schoolsCollection.getName()).doc(schoolId);
    const classesDocumentRef = schoolsDocumentRef.collection(classesCollection.getName()).doc(classId);
    const tasksCollectionRef = classesDocumentRef.collection(tasksCollection.getName()).doc(taskId);
    const discussionsCollectionRef = tasksCollectionRef.collection(discussionsCollection.getName());

    const discussionsQuerySnapshot = await discussionsCollectionRef.get();

    const discussions = (await discussionsQuerySnapshot.docs).map((snap)=> {
      return {id: snap.id, ...snap.data()}
    });

    return Promise.resolve(discussions)
  }

  
  async getDetail(schoolId, classId, taskId, discussionId, source = "default") {
    const db = new firebase.firestore();
    const schoolsCollection = new SchoolsCollection();
    const classesCollection = new ClassesCollection();
    const tasksCollection = new TasksCollection();
    const discussionsCollection = new DiscussionsCollection();
    const schoolDocumentRef = db.collection(schoolsCollection.getName()).doc(schoolId);
    const classDocumentRef = schoolDocumentRef.collection(classesCollection.getName()).doc(classId);
    const tasksDocumentRef = classDocumentRef.collection(tasksCollection.getName()).doc(taskId);
    const discussionsDocumentRef = tasksDocumentRef.collection(discussionsCollection.getName()).doc(discussionId);
   
    const discussionsDocumentSnapshot = await discussionsDocumentRef.get({ source });
    const data = { id: discussionsDocumentSnapshot.id, ...discussionsDocumentSnapshot.data() };

    return Promise.resolve(data);
  }

}