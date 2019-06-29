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
   * 
   * @param {String} roomId 
   */
  getMessageReference(roomId){
    const roomsCollection = new RoomsCollection();
    const messagesCollection = new MessagesCollection();
    const roomDocument = new Document(roomId);

    const db = firebase.firestore();
    const roomsRef = db.collection(roomsCollection.getName()).doc(roomDocument.getId());
    const messagesRef = roomsRef.collection(messagesCollection.getName())
    return messagesRef;
  }

  getNext(){
    if(this.lastDocumentSnapshot && this.roomId){
      const messagesRef = this.getMessageReference(this.roomId);
      const queryRef = messagesRef.orderBy("sentTime", "desc").startAfter(this.lastDocumentSnapshot);
      return queryRef.limit(this.messagePaginationLimit).get().then(querySnapshot => {
        const { messages, lastDocumentSnapshot } = this.parseQuerySnapshotToMessages(querySnapshot);
        this.lastDocumentSnapshot = lastDocumentSnapshot;
        return messages
      })
    }else return Promise.resolve([]);
  }

  parseQuerySnapshotToMessages(querySnapshot){
    let lastDocumentSnapshot = null;
    const messages = [];
    querySnapshot.forEach(documentSnapshot => {
      lastDocumentSnapshot = documentSnapshot;
      const payload = { isSent: documentSnapshot.sentTime !== null, id: documentSnapshot.id, ...documentSnapshot.data() }
      messages.push(payload);
    })
    return { messages, lastDocumentSnapshot }
  }

  /**
   * This function will trigger for ofline storage as well
   * 
   * @param {string} roomId 
   * @param {function} callback - a callback for this real-time function. It requires one parameter `messages`
   */
  getMessagesWithRealTimeUpdate(roomId, callback){
    const messagesRef = this.getMessageReference(roomId);
    const filteredMessagesRef = messagesRef.orderBy("sentTime", "desc").limit(this.messagePaginationLimit);
    return filteredMessagesRef.onSnapshot({ includeMetadataChanges: true }, snapshot => {
      const { messages, lastDocumentSnapshot } = this.parseQuerySnapshotToMessages(snapshot);
      this.lastDocumentSnapshot = lastDocumentSnapshot;
      callback(messages, lastDocumentSnapshot);
    })
  }

  /**
   * 
   * @param {string} roomId 
   * @param {string} senderEmail 
   * @param {string} message
   * @returns {Promise} `true` if insert is successful, throw an error if result is not success
   */
  static sendMessage(roomId, senderEmail, message){
    const sentTime = moment().unix();
    const payload = { 
      senderEmail, message, sentTime, serverDeliveredTime: firebase.firestore.FieldValue.serverTimestamp(),
      read: { isRead: false }
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