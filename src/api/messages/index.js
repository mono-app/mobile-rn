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
    const randomNumber = Math.floor(Math.random() * contents.length);
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
  static getMessagesWithRealTimeUpdate(roomId, callback, limit=1){
    const messagesRef = MessagesAPI.getMessageReference(roomId);
    const filteredMessagesRef = messagesRef.orderBy("sentTime", "desc").limit(limit);
    return filteredMessagesRef.onSnapshot((querySnapshot) => {
      // let lastDocumentSnapshot = null;
      callback(MessagesAPI.normalizeMessages(querySnapshot));

      // const addedMessages = [];
      // const modifiedMessages = [];
      // querySnapshot.docChanges.forEach((changes) => {
      //   if(changes.type === "added") {
      //     lastDocumentSnapshot = changes.doc;
      //     addedMessages.push(MessagesAPI.normalizeMessage(changes.doc))
      //   }else if(changes.type === "modified"){
      //     modifiedMessages.push(MessagesAPI.normalizeMessage(changes.doc))
      //   }else return null;
      // });
      // callback({ addedMessages, modifiedMessages }, lastDocumentSnapshot);
    })
  }

  static async getMessages(roomId){
    const messagesRef = MessagesAPI.getMessageReference(roomId);
    const messagesSnapshot = await messagesRef.orderBy("sentTime", "desc").get();
    const { messages, _ } = MessagesAPI.normalizeMessages(messagesSnapshot);
    return messages;
  }

  static appendDateSeparator(messages){
    const clonnedMessages = [];
    let currentDate = null;
    messages.forEach((message) => {
      if(message.type === "date-separator") return;
      if(!message.sentTime) console.log(message.sentTime, message.content, message.type, message.id, message);
      const messageSentTime = (!message.sentTime)? new moment().format("DD MMMM YYYY"): new moment.unix(message.sentTime.seconds).format("DD MMMM YYYY");
      
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
    const { messages, lastDocumentSnapshot } = MessagesAPI.normalizeMessages(querySnapshot);
    return Promise.resolve({ messages, lastDocumentSnapshot });
  }

  static normalizeMessage(documentSnapshot){
    const messageData = documentSnapshot.data();
    const isSent = messageData.sentTime !== null;
    const sentTime = isSent? messageData.sentTime: firebase.firestore.Timestamp.fromMillis(new moment().valueOf());
    return { id: documentSnapshot.id, isSent: true, ...messageData, sentTime }
  }

  static normalizeMessages(querySnapshot){
    let lastDocumentSnapshot = null;
    const messages = [];
    querySnapshot.forEach((documentSnapshot) => {
      lastDocumentSnapshot = documentSnapshot;
      const message = MessagesAPI.normalizeMessage(documentSnapshot)
      messages.push(message);
    })
    return { messages, lastDocumentSnapshot }
  }
  /**
   * 
   * @param {string} roomId 
   * @param {string} senderId 
   * @param {string} message
   * @returns {Promise} `true` if insert is successful, throw an error if result is not success
   */
  static sendMessage(roomId, senderId, message, type="text", details={}){
    const localSentTime = firebase.firestore.Timestamp.fromMillis(new moment().valueOf())
    const sentTime = firebase.firestore.FieldValue.serverTimestamp();
    const payload = { 
      senderId, content: message, sentTime, readBy: {}, localSentTime, type, details
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
   * @param {String} peopleId 
   */
  static async markAsRead(roomId, peopleId){
    const db = firebase.firestore();
    const roomsCollection = new RoomsCollection();
    const roomDocument = new Document(roomId);
    const roomRef = db.collection(roomsCollection.getName()).doc(roomDocument.getId());
    
    const documentSnapshot = await roomRef.get()
    const readBy = (documentSnapshot.data().readBy)?documentSnapshot.data().readBy:{}
    // if field read by is null or readBy not null but readBy[peopleId] is false (haven't read)
    if((readBy && readBy[peopleId]===false) || !readBy || !readBy[peopleId]){
      readBy[peopleId]=true
      roomRef.update({readBy: readBy,"lastMessage.readTime": firebase.firestore.FieldValue.serverTimestamp()})
      return Promise.resolve(true);
    }
   
    return Promise.resolve(false);
  }

  static async setMessageStatusClicked(roomId, messageId){
    const db = firebase.firestore();
    const roomsCollection = new RoomsCollection();
    const messagesCollection = new MessagesCollection();
    const roomRef = db.collection(roomsCollection.getName()).doc(roomId);
    const messageRef = roomRef.collection(messagesCollection.getName()).doc(messageId);
    messageRef.update({ isClicked: true })
  }
}