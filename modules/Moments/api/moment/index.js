import firebase from "react-native-firebase";
import uuid from "uuid/v4";

import FriendsAPI from "src/api/friends";
import StorageAPI from "src/api/storage";

import { MomentsCollection, FansCollection, CommentsCollection } from "src/api/database/collection";
import { AddDocument } from "src/api/database/query";
import { Document } from "src/api/database/document";

export default class MomentAPI{
  /**
   * 
   * @param {String} momentId 
   * @param {String} fanEmail 
   */
  static async toggleLike(momentId, fanEmail){
    const payload = { email: fanEmail, timestamp: firebase.firestore.FieldValue.serverTimestamp() }
    const db = firebase.firestore();
    const batch = db.batch();
    
    const momentsCollection = new MomentsCollection();
    const momentDocument = new Document(momentId);
    const fanDocument = new Document(fanEmail);
    const fansCollection = new FansCollection();
    const momentsRef = db.collection(momentsCollection.getName()).doc(momentDocument.getId());
    const fansRef = momentsRef.collection(fansCollection.getName()).doc(fanDocument.getId());

    return fansRef.get().then(documentSnapshot => {
      if(!documentSnapshot.exists){
        batch.set(fansRef, payload);
        batch.update(momentsRef, { fanEmails: firebase.firestore.FieldValue.arrayUnion(fanEmail) });
        batch.update(momentsRef, { totalFans: firebase.firestore.FieldValue.increment(1) });
      }else{
        batch.delete(fansRef);
        batch.update(momentsRef, { fanEmails: firebase.firestore.FieldValue.arrayRemove(fanEmail) });
        batch.update(momentsRef, { totalFans: firebase.firestore.FieldValue.increment(-1) });
      }
      return batch.commit();
    }).then(() => true)
  }

  /**
   * 
   * @param {String} momentId 
   * @param {function} callback 
   */
  static getDetailWithRealTimeUpdate(momentId, currentUserEmail ,callback){
    const db = firebase.firestore();
    const momentsCollection = new MomentsCollection();
    const fansCollection = new FansCollection();
    const commentsCollection = new CommentsCollection();
    const momentDocument = new Document(momentId);
    const momentRef = db.collection(momentsCollection.getName()).doc(momentDocument.getId());
    
    return momentRef.onSnapshot({ includeMetadataChanges: true }, async (documentSnapshot) => {
      if(documentSnapshot.exists) {
        const fansSnapshot = await momentRef.collection(fansCollection.getName()).doc(currentUserEmail).get()
        const commentSnapshot = await momentRef.collection(commentsCollection.getName()).where("peopleEmail","==",currentUserEmail).get()
       
        let normalized = MomentAPI.normalizeMoment(documentSnapshot)
        normalized.isLiked = fansSnapshot.exists
        normalized.isCommented = !commentSnapshot.empty
     
        callback(normalized);
      }
      else callback(null);
    })
  }

  static async getDetail(momentId){
    const db = firebase.firestore();
    const momentsCollection = new MomentsCollection();
    const momentDocument = new Document(momentId);
    const momentRef = db.collection(momentsCollection.getName()).doc(momentDocument.getId());
    const momentDocumentSnapshot = await momentRef.get();
    const data = { id: momentDocumentSnapshot.id, ...momentDocumentSnapshot.data() };
    return Promise.resolve(data);
  }

  /**
   * 
   * @param {String} posterEmail - 
   * @param {Object} content 
   */
  static publishMoment(posterEmail, content){
    const promises = [];
    content.images.forEach((image, index) => {
      const stringRef = `/modules/moments/${uuid()}.png`;
      promises.push(StorageAPI.uploadFile(stringRef, image.uri));
      content.images[index] = { storagePath: stringRef, downloadUrl: null }
    })

    return Promise.all(promises).then(results => {
      results.forEach((result, index) => {
        content.images[index].downloadUrl = result;
      })

      const collection = new MomentsCollection();
      const query = new AddDocument();
      const payload = {
        posterEmail, content, privacy: "friends",
        postTime: firebase.firestore.FieldValue.serverTimestamp(),
      }
      return query.executeQuery(collection, null, payload);
    }).then(() => true).catch(err => {
      console.log(err); 
      return false;
    })
  }

  /**
   * 
   * @param {String} email 
   * @returns {Promise} an array of `moments` object
   */
  static async getMoments(email){
  
    const db = firebase.firestore();
    const momentsCollection = new MomentsCollection();
    const momentsRef = db.collection(momentsCollection.getName()).where('showsTo','array-contains',email);
    const querySnapshots = await momentsRef.get();

    const moments = querySnapshots.docs.map((documentSnapshot) => MomentAPI.normalizeMoment(documentSnapshot));
    moments.sort((a, b) => (a&&b) && (a.postTime.seconds > b.postTime.seconds)? -1: 1);
    return Promise.resolve(moments);
  }

  static normalizeMoment(documentSnapshot){
    return { id: documentSnapshot.id, ...documentSnapshot.data() };
  }

  static async delete(momentId){
    try{
      const db = firebase.firestore();
      const momentsCollection = new MomentsCollection();
      const momentRef = db.collection(momentsCollection.getName()).doc(momentId);
      await momentRef.delete();
      return Promise.resolve(true);
    }catch(err){
      console.log(err);
      return Promise.resolve(false);
    }
  }

}