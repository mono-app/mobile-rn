import firebase from "react-native-firebase";
import { SchoolsCollection, ClassesCollection, TasksCollection, DiscussionsCollection, LikesCollection, CommentsCollection, ParticipantsCollection, UserMappingCollection } from "src/api/database/collection";
import StorageAPI from "src/api/storage"
import uuid from "uuid/v4"

export default class DiscussionAPI{

  static async addDiscussion(schoolId, classId, taskId, data){
    try{
      if(data.images.length>0){
        let resImages = []
        for (const res of data.images) {
          const storagePath = "/modules/classroom/discussions/"+uuid()
          const downloadUrl = await StorageAPI.uploadFile(storagePath,res.uri)
          resImages.push({storagePath,downloadUrl})
        }
        data.images = resImages
      }

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

    const discussionsQuerySnapshot = await discussionsCollectionRef.orderBy("creationTime","desc").get();

    const discussions = (await discussionsQuerySnapshot.docs).map((snap)=> {
      return {id: snap.id, ...snap.data()}
    });

    return Promise.resolve(discussions)
  }

  static async getMyDiscussions(email,schoolId){
    const db = firebase.firestore();
    const userMappingCollection = new UserMappingCollection()
    const schoolsCollection = new SchoolsCollection();
    const discussionsCollection = new DiscussionsCollection();
    
    const userMappingRef = db.collection(userMappingCollection.getName()).doc(email);
    const schoolsDocumentRef = userMappingRef.collection(schoolsCollection.getName()).doc(schoolId);
    const discussionsCollectionRef = schoolsDocumentRef.collection(discussionsCollection.getName());

    const discussionsQuerySnapshot = await discussionsCollectionRef.orderBy("creationTime","desc").get();

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

  static async getTotalParticipant(schoolId, classId, taskId, discussionId) {
    const db = new firebase.firestore();
    const schoolsCollection = new SchoolsCollection();
    const classesCollection = new ClassesCollection();
    const tasksCollection = new TasksCollection();
    const discussionsCollection = new DiscussionsCollection();
    const participantsCollection = new ParticipantsCollection();
    const schoolDocumentRef = db.collection(schoolsCollection.getName()).doc(schoolId);
    const classDocumentRef = schoolDocumentRef.collection(classesCollection.getName()).doc(classId);
    const tasksDocumentRef = classDocumentRef.collection(tasksCollection.getName()).doc(taskId);
    const discussionsDocumentRef = tasksDocumentRef.collection(discussionsCollection.getName()).doc(discussionId);
    const participantCollectionRef = discussionsDocumentRef.collection(participantsCollection.getName());

    const participantQuerySnapshot = await participantCollectionRef.get();

    return Promise.resolve(participantQuerySnapshot.size);
  }
  
  static async getDetail(schoolId, classId, taskId, discussionId, currentUserEmail) {
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

  static async isLikedRealTimeUpdate(schoolId, classId, taskId, discussionId, currentUserEmail, callback){
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
      if(data.images.length>0){
        let resImages = []
        for (const res of data.images) {
          const storagePath = "/modules/classroom/discussions/comments/"+uuid()
          const downloadUrl = await StorageAPI.uploadFile(storagePath,res.uri)
          resImages.push({storagePath,downloadUrl})
        }
        data.images = resImages
      }
      const db = firebase.firestore();
      const schoolsCollection = new SchoolsCollection();
      const classesCollection = new ClassesCollection();
      const tasksCollection = new TasksCollection();
      const discussionsCollection = new DiscussionsCollection();
      const commentsCollection = new CommentsCollection();
      const participantsCollection = new ParticipantsCollection();
      const schoolDocumentRef = db.collection(schoolsCollection.getName()).doc(schoolId);
      const classDocumentRef = schoolDocumentRef.collection(classesCollection.getName()).doc(classId);
      const tasksDocumentRef = classDocumentRef.collection(tasksCollection.getName()).doc(taskId);
      const discussionsDocumentRef = tasksDocumentRef.collection(discussionsCollection.getName()).doc(discussionId);
      const commentsDocumentRef = discussionsDocumentRef.collection(commentsCollection.getName()).doc();
      const participantDocumentRef = discussionsDocumentRef.collection(participantsCollection.getName()).doc(data.posterEmail);

      await commentsDocumentRef.set({ creationTime: firebase.firestore.FieldValue.serverTimestamp(), ...data });
      await participantDocumentRef.set({ creationTime: firebase.firestore.FieldValue.serverTimestamp() });

      return Promise.resolve(true);
    }catch(err){ 
      console.log(err);
      return Promise.resolve(false); 
    }
  }

}
