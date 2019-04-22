import { RoomsCollection, MessagesCollection } from "../database/collection";
import { Document } from "../database/document";
import { DocumentListener } from "../database/listener";
import { AddDocument } from "../database/query";
import firebase from "react-native-firebase";

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
        payload = Object.assign({ 
          isSent: !doc.metadata.hasPendingWrites
        }, payload)
        messages.push(payload);
      })
      callback(messages)
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
    const roomsCollection = new RoomsCollection();
    const messagesCollection = new MessagesCollection();
    const roomDocument = new Document(roomId);
    const firebaseReference = roomsCollection.getFirebaseReference();

    const collectionRef = firebaseReference.doc(roomDocument.getId()).collection(messagesCollection.getName());
    const addDocument = new AddDocument();
    return addDocument.executeFirebaseQuery(collectionRef, null, payload).then(doc => {
      return true;
    })
  }
}