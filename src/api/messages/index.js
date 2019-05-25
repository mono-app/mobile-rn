import firebase from "react-native-firebase";

import PeopleAPI from "src/api/people";
import { RoomsCollection, MessagesCollection } from "src/api/database/collection";
import { Document } from "src/api/database/document";

export default class MessagesAPI{
  /**
   * This function will trigger for ofline storage as well
   * 
   * @param {string} roomId 
   * @param {function} callback - a callback for this real-time function. It requires one parameter `messages`
   */
  getMessagesWithRealTimeUpdate(roomId, callback){
    const roomsCollection = new RoomsCollection();
    const messagesCollection = new MessagesCollection();
    const roomDocument = new Document(roomId);
    const firebaseReference = roomsCollection.getFirebaseReference();

    const collectionRef = firebaseReference.doc(roomDocument.getId()).collection(messagesCollection.getName())
    return collectionRef.orderBy("sentTime", "desc").onSnapshot({ includeMetadataChanges: true }, snapshot => {
      let messages = [];
      snapshot.forEach(doc => {
        let payload = doc.data();
        payload = Object.assign({ isSent: !doc.metadata.hasPendingWrites}, payload)
        messages.push(payload);
      })

      const promises = messages.map(message => new PeopleAPI().getDetail(message.senderEmail, "cache"));
      Promise.all(promises).then(results => {
        const newMessages = messages.map((message, index) => {
          message.sender = results[index]
          return message;
        });
        callback(newMessages);
      })
    }, err => console.error(err));
  }

  /**
   * 
   * @param {string} roomId 
   * @param {string} senderEmail 
   * @param {string} message
   * @returns {Promise} `true` if insert is successful, throw an error if result is not success
   */
  sendMessage(roomId, senderEmail, message){
    const payload = { senderEmail, message, sentTime: firebase.firestore.FieldValue.serverTimestamp() }
    const db = firebase.firestore();
    const batch = db.batch();

    const roomsCollection = new RoomsCollection();
    const messagesCollection = new MessagesCollection();
    const roomDocument = new Document(roomId);
    const roomsRef = db.collection(roomsCollection.getName()).doc(roomDocument.getId());
    const newCollectionRef = roomsRef.collection(messagesCollection.getName()).doc();
    batch.set(newCollectionRef, payload);
    batch.update(roomsRef, { lastMessage: { message, sentTime: firebase.firestore.FieldValue.serverTimestamp() } });
    return batch.commit().then(() => true);
  }
}