import firebase from "react-native-firebase";

import { MomentsCollection, CommentsCollection } from "src/api/database/collection";
import { Document } from "src/api/database/document";
import { DocumentListener } from "src/api/database/listener";

export default class CommentsAPI{
  /**
   * 
   * @param {String} momentId 
   */
  static getCommentsWithRealTimeUpdate(momentId, callback){
    const listener = new DocumentListener();
    const momentsCollection = new MomentsCollection();
    const momentDocument = new Document(momentId);
    const commentsCollection = new CommentsCollection();
    
    const db = firebase.firestore();
    const momentRef = db.collection(momentsCollection.getName()).doc(momentDocument.getId());
    const commentsRef = momentRef.collection(commentsCollection.getName()).orderBy("timestamp", "asc");

    listener.setListenerOptions({ includeMetadataChanges: true })
    return listener.listenFromReference(commentsRef, querySnapshot => {
      const comments = [];
      querySnapshot.forEach(documentSnapshot => comments.push({id: documentSnapshot.id, ...documentSnapshot.data()}));
      callback(comments);
    })
  }

  /**
   * 
   * @param {String} momentId 
   * @param {String} comment 
   */
  static postComment(momentId, comment, peopleEmail){
    const payload = { peopleEmail, comment, timestamp: firebase.firestore.FieldValue.serverTimestamp() }
    const db = firebase.firestore();
    const batch = db.batch();

    const momentsCollection = new MomentsCollection();
    const commentsCollection = new CommentsCollection();
    const momentDocument = new Document(momentId);
    const momentRef = db.collection(momentsCollection.getName()).doc(momentDocument.getId());
    const commentRef = momentRef.collection(commentsCollection.getName()).doc();

    batch.set(commentRef, payload);
    batch.update(momentRef, { totalComments: firebase.firestore.FieldValue.increment(1) });
    return batch.commit().then(() => true);
  }
}