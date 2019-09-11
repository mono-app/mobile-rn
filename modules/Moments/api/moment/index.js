import firebase from "react-native-firebase";
import uuid from "uuid/v4";

import FriendsAPI from "src/api/friends";
import StorageAPI from "src/api/storage";

import { MomentsCollection, FansCollection } from "src/api/database/collection";
import { AddDocument } from "src/api/database/query";
import { Document } from "src/api/database/document";

export default class MomentAPI{
  /**
   * 
   * @param {String} momentId 
   * @param {String} fanEmail 
   */
  static toggleLike(momentId, fanEmail){
    const payload = { email: fanEmail, timestamp: firebase.firestore.FieldValue.serverTimestamp() }
    const db = firebase.firestore();
    const batch = db.batch();
    
    const momentsCollection = new MomentsCollection();
    const momentDocument = new Document(momentId);
    const fanDocument = new Document(fanEmail);
    const fansCollection = new FansCollection();
    const momentsRef = db.collection(momentsCollection.getName()).doc(momentDocument.getId());
    const fansRef = momentsRef.collection(fansCollection.getName()).doc(fanDocument.getId());

    fansRef.get().then(documentSnapshot => {
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
  static getDetailWithRealTimeUpdate(momentId, callback){
    const db = firebase.firestore();
    const momentsCollection = new MomentsCollection();
    const momentDocument = new Document(momentId);
    const momentRef = db.collection(momentsCollection.getName()).doc(momentDocument.getId());
    return momentRef.onSnapshot({ includeMetadataChanges: true }, (documentSnapshot) => {
      if(documentSnapshot.exists) callback(documentSnapshot.data());
      else callback(null);
    })
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
      promises.push(StorageAPI.uploadFile(stringRef, image));
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
    const friends = await FriendsAPI.getFriends(email);
    const posterEmails = friends.map((friend) => friend.email);
    posterEmails.push(email); // add myself to poster email to catch the moment created by me
    
    const db = firebase.firestore();
    const momentsCollection = new MomentsCollection();
    const momentsRef = db.collection(momentsCollection.getName());
    const queries = posterEmails.map((email) => {
      const posterRef = momentsRef.where("posterEmail", "==", email);
      const privacyRef = posterRef.where("privacy", "==", "friends");
      return privacyRef.limit(100).orderBy("postTime", "desc").get();
    });

    const querySnapshots = await Promise.all(queries);
    const documentSnapshots = [];
    querySnapshots.forEach((querySnapshot) => documentSnapshots.push.apply(documentSnapshots, querySnapshot.docs))

    const moments = documentSnapshots.map((documentSnapshot) => MomentAPI.normalizeMoment(documentSnapshot));
    moments.sort((a, b) => (a.postTime.seconds > b.postTime.seconds)? -1: 1);
    return Promise.resolve(moments);
  }

  static normalizeMoment(documentSnapshot){
    return { id: documentSnapshot.id, ...documentSnapshot.data() };
  }
}