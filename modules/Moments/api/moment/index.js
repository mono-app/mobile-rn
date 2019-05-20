import firebase from "react-native-firebase";
import uuid from "uuid/v4";

import { MomentsCollection, FansCollection } from "src/api/database/collection";
import { AddDocument } from "src/api/database/query";
import { Document } from "src/api/database/document";
import { DocumentListener } from "src/api/database/listener";
import FriendsAPI from "src/api/friends";


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
    const momentsCollection = new MomentsCollection();
    const momentDocument = new Document(momentId);
    const listener = new DocumentListener();
    return listener.listen(momentsCollection, momentDocument, doc => {
      if(doc.exists) callback(doc.data());
      else callback(null);
    })
  }

  /**
   * 
   * @param {String} posterEmail - 
   * @param {Object} content 
   */
  static publishMoment(posterEmail, content){
    const payload = {
      posterEmail, content,
      postTime: firebase.firestore.FieldValue.serverTimestamp(),
      privacy: "friends"
    }

    const promises = [];
    const storage = firebase.storage();
    content.images.forEach((image, index) => {
      const stringRef = `/modules/moments/${uuid()}.png`
      const storageRef = storage.ref(stringRef);
      const cleanImagePath = image.substring(7);
      console.log("path: ", cleanImagePath, stringRef);

      promises.push(storageRef.putFile(cleanImagePath))
      content.images[index] = stringRef;
    })

    const collection = new MomentsCollection();
    const query = new AddDocument();
    promises.push(query.executeQuery(collection, null, payload));
    return Promise.all(promises).then(() => {
      return true  
    }).catch(err => {
      console.log(err);
      return false;
    });
  }

  /**
   * 
   * @param {String} email 
   * @returns {Promise} an array of `moments` object
   */
  static getMoments(email){
    const db = firebase.firestore();
    const momentsCollection = new MomentsCollection();
    return FriendsAPI.getFriends(email).then(friends => {
      let promises = [];
      friends.push(email); // to include the creator moment, so that user can see his/her moment
      friends.forEach(friendEmail => {
        const getQuery = db.collection(momentsCollection.getName())
                           .where("posterEmail", "==", friendEmail).where("privacy", "==", "friends")
                           .orderBy("postTime", "desc").get();
        promises.push(getQuery);
      })
      return Promise.all(promises);
    }).then(promiseResults => {
      let documentSnapshots = [];
      promiseResults.forEach(promiseResult => documentSnapshots = documentSnapshots.concat(promiseResult.docs))
      
      const moments = documentSnapshots.map(documentSnapshot => {
        return { id: documentSnapshot.id, ...documentSnapshot.data()}
      });
      moments.sort((a, b) => (a.postTime > b.postTime)? -1: 1);
      return moments;
    });
  }
}