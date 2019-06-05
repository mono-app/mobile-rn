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
    
    const db = firebase.firestore ();
    const roomsRef = db.collection(roomsCollection.getName()).doc(roomDocument.getId());
    const messagesRef = roomsRef.collection(messagesCollection.getName())
    const filteredMessagesRef = messagesRef.orderBy("sentTime", "desc").limit(25);
    filteredMessagesRef.onSnapshot({ includeMetadataChanges: true }, snapshot => {
      const messages = [];
      snapshot.forEach(documentSnapshot => {
        const payload = Object.assign({ isSent: !documentSnapshot.metadata.hasPendingWrites }, documentSnapshot.data());
        messages.push(payload);
      })
      callback(messages);
    })
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