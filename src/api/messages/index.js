import firebase from "react-native-firebase";
import moment from "moment";

import { RoomsCollection, MessagesCollection } from "src/api/database/collection";
import { Document } from "src/api/database/document";

export default class MessagesAPI{

  constructor(roomId=null){
    this.roomId = roomId;
    this.lastDocumentSnapshot = null;
    this.messagePaginationLimit = 25;
  }

   /**
   * This function will trigger for offline storage as well
   * 
   * @param {string} roomId 
   * @param {function} callback - a callback for this real-time function. It requires one parameter `messages`
   */
  static getMessagesWithRealTimeUpdate(roomId, callback, limit=25){
    const messagesRef = MessagesAPI.getMessageReference(roomId);
    const filteredMessagesRef = messagesRef.orderBy("sentTime", "desc").limit(limit);
    return filteredMessagesRef.onSnapshot({ includeMetadataChanges: true }, (querySnapshot) => {
      const { messages, lastDocumentSnapshot } = MessagesAPI.normalizeMessage(querySnapshot);
      callback(messages, lastDocumentSnapshot);
    })
  }

  /**
   * 
   * @param {String} roomId 
   */
  static getMessageReference(roomId){
    const roomsCollection = new RoomsCollection();
    const messagesCollection = new MessagesCollection();
    const roomDocument = new Document(roomId);

    const db = firebase.firestore();
    const roomsRef = db.collection(roomsCollection.getName()).doc(roomDocument.getId());
    const messagesRef = roomsRef.collection(messagesCollection.getName())
    return messagesRef;
  }

  static async getNext(lastMessageSnapshot, roomId, limit=25){
    const messagesRef = MessagesAPI.getMessageReference(roomId);
    const queryRef = messagesRef.orderBy("sentTime", "desc").startAfter(lastMessageSnapshot);
    const querySnapshot = await queryRef.limit(limit).get();
    const { messages, lastDocumentSnapshot } = MessagesAPI.normalizeMessage(querySnapshot);
    return Promise.resolve({ messages, lastDocumentSnapshot });
  }

  static normalizeMessage(querySnapshot){
    let lastDocumentSnapshot = null;
    const messages = [];
    querySnapshot.forEach((documentSnapshot) => {
      lastDocumentSnapshot = documentSnapshot;
      const messageData = documentSnapshot.data();
      const payload = { 
        id: documentSnapshot.id, isSent: messageData.sentTime !== null, 
        ...messageData
      }
      messages.push(payload);
    })
    return { messages, lastDocumentSnapshot }
  }

  parseQuerySnapshotToMessages(querySnapshot){
    let lastDocumentSnapshot = null;
    const messages = [];
    querySnapshot.forEach((documentSnapshot) => {
      lastDocumentSnapshot = documentSnapshot;
      const payload = { isSent: documentSnapshot.sentTime !== null, id: documentSnapshot.id, ...documentSnapshot.data() }
      messages.push(payload);
    })
    return { messages, lastDocumentSnapshot }
  }

  /**
   * 
   * @param {string} roomId 
   * @param {string} senderEmail 
   * @param {string} message
   * @returns {Promise} `true` if insert is successful, throw an error if result is not success
   */
  static sendMessage(roomId, senderEmail, message, type="text", details={}){
    const localSentTime = firebase.firestore.Timestamp.fromMillis(new moment().valueOf())
    const sentTime = firebase.firestore.FieldValue.serverTimestamp();
    const payload = { 
      senderEmail, content: message, sentTime, readBy: [], localSentTime, type, details
    }
    const db = firebase.firestore();
    const batch = db.batch();

    const roomsCollection = new RoomsCollection();
    const messagesCollection = new MessagesCollection();
    const roomDocument = new Document(roomId);
    const roomsRef = db.collection(roomsCollection.getName()).doc(roomDocument.getId());
    const newCollectionRef = roomsRef.collection(messagesCollection.getName()).doc();
    batch.set(newCollectionRef, payload);
    batch.update(roomsRef, { lastMessage: { message, sentTime } });
    return batch.commit().then(() => Promise.resolve(true));
  }

  /**
   * @param {String} roomId
   * @param {String} messageId 
   * @param {String} peopleEmail 
   */
  static async markAsRead(roomId, messageId, peopleEmail){
    const db = firebase.firestore();
    const batch = db.batch();
    const roomsCollection = new RoomsCollection();
    const roomDocument = new Document(roomId);
    const messagesCollection = new MessagesCollection();
    const messageDocument = new Document(messageId);
    const roomRef = db.collection(roomsCollection.getName()).doc(roomDocument.getId());
    const messageRef = roomRef.collection(messagesCollection.getName()).doc(messageDocument.getId());
    batch.update(messageRef, { "read.isRead": true });
    batch.update(messageRef, { "read.by": firebase.firestore.FieldValue.arrayUnion(peopleEmail) });
    batch.update(roomRef, { "lastMessage.readTime": moment().unix() })
    await batch.commit();
    return Promise.resolve(true);
  }
}