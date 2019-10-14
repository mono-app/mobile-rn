import firebase from "react-native-firebase";
import moment from "moment";
import Logger from "src/api/logger";

import { RoomsCollection, MessagesCollection } from "src/api/database/collection";
import { Document } from "src/api/database/document";

export default class MessagesAPI{

  constructor(roomId=null){
    this.roomId = roomId;
    this.lastDocumentSnapshot = null;
    this.messagePaginationLimit = 25;
  }

  static createMessageObject(payload){
    return {
      ...payload, sentTime: firebase.firestore.FieldValue.serverTimestamp(),
      localSentTime: firebase.firestore.Timestamp.fromMillis(new moment().valueOf)
    }
  }

  static welcomeMessage(){
    const contents = [
      "Ayo jangan malu-malu.",
      "Semua dimulai dari halo.",
      "Jangan lupa sapa teman kamu."
    ]
    const randomNumber = Math.floor(Math.random() * (contents.length + 1));
    const welcomeMessage = MessagesAPI.createMessageObject({ 
      type: "lets-start-chat", content: contents[randomNumber], details: {value: contents[randomNumber]} 
    });
    Logger.log("MessagesAPI.welcomeMessage#welcomeMessage", welcomeMessage);
    return [ welcomeMessage ]
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

  static appendDateSeparator(messages){
    const clonnedMessages = [];
    let currentDate = null;
    messages.forEach((message) => {
      if(message.type === "date-separator") return;
      const messageSentTime = (message.sentTime === null)? new moment().format("DD MMMM YYYY"): new moment.unix(message.sentTime.seconds).format("DD MMMM YYYY");
      
      if(currentDate === null) currentDate = messageSentTime;
      if(currentDate !== messageSentTime) {
        clonnedMessages.push({ type: "date-separator", details: {value: currentDate} });
      }
      clonnedMessages.push(message);
      currentDate = messageSentTime;
    });
    clonnedMessages.push({ type: "date-separator", details: {value: currentDate} });
    return clonnedMessages
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
      senderEmail, content: message, sentTime, readBy: {}, localSentTime, type, details
    }
    const db = firebase.firestore();
    const batch = db.batch();

    const roomsCollection = new RoomsCollection();
    const messagesCollection = new MessagesCollection();
    const roomDocument = new Document(roomId);
    const roomsRef = db.collection(roomsCollection.getName()).doc(roomDocument.getId());
    const newCollectionRef = roomsRef.collection(messagesCollection.getName()).doc();
    batch.set(newCollectionRef, payload);
    return batch.commit().then(() => Promise.resolve(true));
  }

  /**
   * @param {String} roomId
   * @param {String} messageId 
   * @param {String} peopleEmail 
   */
  static async bulkMarkAsRead(roomId, messageIdList, peopleEmail){
    const db = firebase.firestore();
    const batch = db.batch();
    const roomsCollection = new RoomsCollection();
    const roomDocument = new Document(roomId);
    const messagesCollection = new MessagesCollection();
    const roomRef = db.collection(roomsCollection.getName()).doc(roomDocument.getId());

    const userPath = new firebase.firestore.FieldPath("readBy", peopleEmail);

    const messageQuerySnapshot = await roomRef.collection(messagesCollection.getName()).where(userPath,"==",false).get()
    messageQuerySnapshot.docs.forEach(documentSnapshot=> {
      const readBy = documentSnapshot.data().readBy
      readBy[peopleEmail]=true
      batch.update(documentSnapshot.ref, {readBy: readBy});
    })

    batch.update(roomRef, { "lastMessage.readTime": moment().unix() })

    await batch.commit();

    return Promise.resolve(true);
  }
}