import firebase from "react-native-firebase";
import CurrentUserAPI from "src/api/people/CurrentUser";
import { SchoolsCollection, ClassesCollection, TasksCollection, DiscussionsCollection, LikesCollection, CommentsCollection } from "src/api/database/collection";

export default class DiscussionAPI{


  static async addDiscussion(schoolId, classId, taskId, data){
    try{
      const db = new firebase.firestore();
      const schoolsCollection = new SchoolsCollection();
      const classesCollection = new ClassesCollection();
      const tasksCollection = new TasksCollection();
      const discussionsCollection = new DiscussionsCollection();
      const schoolDocumentRef = db.collection(schoolsCollection.getName()).doc(schoolId);
      const classDocumentRef = schoolDocumentRef.collection(classesCollection.getName()).doc(classId);
      const tasksDocumentRef = classDocumentRef.collection(tasksCollection.getName()).doc(taskId);
      const discussionsDocumentRef = tasksDocumentRef.collection(discussionsCollection.getName()).doc();
      await discussionsDocumentRef.set({ creationTime: firebase.firestore.FieldValue.serverTimestamp(), ...data });

      return Promise.resolve(true);
    }catch(err){ 
      console.log(err);
      return Promise.resolve(false); 
    }
  }

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

  static async getTotalDiscussion(schoolId, classId, taskId) {
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

    return Promise.resolve(discussionsQuerySnapshot.size)
  }

  
  async getDetail(schoolId, classId, taskId, discussionId, callback) {
    const db = new firebase.firestore();
    const schoolsCollection = new SchoolsCollection();
    const classesCollection = new ClassesCollection();
    const tasksCollection = new TasksCollection();
    const discussionsCollection = new DiscussionsCollection();
    const likesCollection = new LikesCollection();
    const schoolDocumentRef = db.collection(schoolsCollection.getName()).doc(schoolId);
    const classDocumentRef = schoolDocumentRef.collection(classesCollection.getName()).doc(classId);
    const tasksDocumentRef = classDocumentRef.collection(tasksCollection.getName()).doc(taskId);
    const discussionsDocumentRef = tasksDocumentRef.collection(discussionsCollection.getName()).doc(discussionId);
   
    const discussionsDocumentSnapshot = await discussionsDocumentRef.get();

    const currentUserEmail = await CurrentUserAPI.getCurrentUserEmail()

    const likesDocumentRef = discussionsDocumentRef.collection(likesCollection.getName()).doc(currentUserEmail);
    const likesDocumentSnapshot = await likesDocumentRef.get();
    const data = { id: discussionsDocumentSnapshot.id, ...discussionsDocumentSnapshot.data(), isLiked: likesDocumentSnapshot.exists };

    return Promise.resolve(data);
  }

  static async like(schoolId, classId, taskId, discussionId, email){
    try{
      const db = new firebase.firestore();
      const schoolsCollection = new SchoolsCollection();
      const classesCollection = new ClassesCollection();
      const tasksCollection = new TasksCollection();
      const discussionsCollection = new DiscussionsCollection();
      const likesCollection = new LikesCollection();
      const schoolDocumentRef = db.collection(schoolsCollection.getName()).doc(schoolId);
      const classDocumentRef = schoolDocumentRef.collection(classesCollection.getName()).doc(classId);
      const tasksDocumentRef = classDocumentRef.collection(tasksCollection.getName()).doc(taskId);
      const discussionsDocumentRef = tasksDocumentRef.collection(discussionsCollection.getName()).doc(discussionId);
      const likesDocumentRef = discussionsDocumentRef.collection(likesCollection.getName()).doc(email);
      await likesDocumentRef.set({ creationTime: firebase.firestore.FieldValue.serverTimestamp() });

      return Promise.resolve(true);
    }catch(err){ 
      console.log(err);
      return Promise.resolve(false); 
    }
  }

  static async isLikedRealTimeUpdate(schoolId, classId, taskId, discussionId, callback){
    const currentUserEmail = await CurrentUserAPI.getCurrentUserEmail()
    const db = new firebase.firestore();
    const schoolsCollection = new SchoolsCollection();
    const classesCollection = new ClassesCollection();
    const tasksCollection = new TasksCollection();
    const discussionsCollection = new DiscussionsCollection();
    const likesCollection = new LikesCollection();
    const schoolDocumentRef = db.collection(schoolsCollection.getName()).doc(schoolId);
    const classDocumentRef = schoolDocumentRef.collection(classesCollection.getName()).doc(classId);
    const tasksDocumentRef = classDocumentRef.collection(tasksCollection.getName()).doc(taskId);
    const discussionsDocumentRef = tasksDocumentRef.collection(discussionsCollection.getName()).doc(discussionId);
    const likesDocumentRef = discussionsDocumentRef.collection(likesCollection.getName()).doc(currentUserEmail);
    return Promise.resolve(likesDocumentRef.onSnapshot(function(doc){
      callback(doc.exists)
    }))
  }

  static async getComments(schoolId, classId, taskId, discussionId) {
    const db = firebase.firestore();
    const schoolsCollection = new SchoolsCollection();
    const classesCollection = new ClassesCollection();
    const tasksCollection = new TasksCollection();
    const discussionsCollection = new DiscussionsCollection();
    const commentsCollection = new CommentsCollection();
    const schoolsDocumentRef = db.collection(schoolsCollection.getName()).doc(schoolId);
    const classesDocumentRef = schoolsDocumentRef.collection(classesCollection.getName()).doc(classId);
    const tasksCollectionRef = classesDocumentRef.collection(tasksCollection.getName()).doc(taskId);
    const discussionsCollectionRef = tasksCollectionRef.collection(discussionsCollection.getName()).doc(discussionId);
    const commentsCollectionRef = discussionsCollectionRef.collection(commentsCollection.getName());

    const commentsQuerySnapshot = await commentsCollectionRef.orderBy("creationTime","desc").get();

    const comments = (await commentsQuerySnapshot.docs).map((snap)=> {
      return {id: snap.id, ...snap.data()}
    });

    return Promise.resolve(comments)
  }

  static async sendComment(schoolId, classId, taskId, discussionId, data){
    
    try{
      const db = firebase.firestore();
      const schoolsCollection = new SchoolsCollection();
      const classesCollection = new ClassesCollection();
      const tasksCollection = new TasksCollection();
      const discussionsCollection = new DiscussionsCollection();
      const commentsCollection = new CommentsCollection();
      const schoolDocumentRef = db.collection(schoolsCollection.getName()).doc(schoolId);
      const classDocumentRef = schoolDocumentRef.collection(classesCollection.getName()).doc(classId);
      const tasksDocumentRef = classDocumentRef.collection(tasksCollection.getName()).doc(taskId);
      const discussionsDocumentRef = tasksDocumentRef.collection(discussionsCollection.getName()).doc(discussionId);
      const commentsDocumentRef = discussionsDocumentRef.collection(commentsCollection.getName()).doc();

      await commentsDocumentRef.set({ creationTime: firebase.firestore.FieldValue.serverTimestamp(), ...data });

      return Promise.resolve(true);
    }catch(err){ 
      console.log(err);
      return Promise.resolve(false); 
    }
  }

}