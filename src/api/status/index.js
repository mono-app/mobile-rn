import firebase from "react-native-firebase";

import { StatusCollection, UserCollection } from "src/api/database/collection";
import { Document } from "src/api/database/document";
import { DocumentListener } from "src/api/database/listener";

export default class StatusAPI{
  /**
   * 
   * @param {String} peopleEmail 
   * @param {String} status 
   */
  static postStatus(peopleEmail, status){
    const db = firebase.firestore();
    const batch = db.batch();

    const statusCollection = new StatusCollection();
    const userCollection = new UserCollection();
    const userDocument = new Document(peopleEmail);
    const payload = { content: status, timestamp: firebase.firestore.FieldValue.serverTimestamp() }

    const userRef = db.collection(userCollection.getName()).doc(userDocument.getId());
    const statusRef = userRef.collection(statusCollection.getName()).doc();

    batch.set(statusRef, payload);
    batch.update(userRef, { "statistic.totalStatus": firebase.firestore.FieldValue.increment(1) });
    return batch.commit();
  }

  static getStatusWithRealTimeUpdate(peopleEmail, callback){
    const listener = new DocumentListener();
    const userCollection = new UserCollection();
    const userDocument = new Document(peopleEmail);
    const statusCollection = new StatusCollection();

    const db = firebase.firestore();
    const userRef = db.collection(userCollection.getName()).doc(userDocument.getId());
    const statusRef = userRef.collection(statusCollection.getName()).orderBy("timestamp", "desc");

    listener.setListenerOptions({ includeMetadataChanges: true });
    return listener.listenFromReference(statusRef, querySnapshot => {
      const status = [];
      querySnapshot.forEach(documentSnapshot => status.push(documentSnapshot.data()));
      callback(status);
    })
  }
}