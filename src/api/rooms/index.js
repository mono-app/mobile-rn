import firebase from "react-native-firebase";

import CurrentUserAPI from "src/api/people/CurrentUser";
import { RoomsCollection, RoomUserMappingCollection, MessagesCollection, Collection } from "src/api/database/collection";
import { Document } from "src/api/database/document";
import { GetDocument } from "src/api/database/query";

export default class RoomsAPI{
  constructor(){
    this.isRoomExists = this.isRoomExists.bind(this);
  }

  /**
   * @param {string} email
   * @param {Function} callback 
   */
  static getRoomsWithRealtimeUpdate(email, callback){
    const db = firebase.firestore();
    const roomsCollection = new RoomsCollection();
    const roomsRef = db.collection(roomsCollection.getName()).where("audiences", "array-contains", email);
    
    return roomsRef.orderBy("lastMessage.sentTime", "asc").onSnapshot((querySnapshot) => {
      const rooms = querySnapshot.docs.map((documentSnapshot) => {
        const normalizedRoom = RoomsAPI.normalizeRoom(documentSnapshot);
        return normalizedRoom;
      })
      callback(rooms);
    })
  }

  static async getDetail(roomId){
    const db = firebase.firestore();
    const roomsCollection = new RoomsCollection();
    const roomsDocumentRef = db.collection(roomsCollection.getName()).doc(roomId);
    const documentSnapshot = await roomsDocumentRef.get();
    const data = { id: documentSnapshot.id, ...documentSnapshot.data() };
    return Promise.resolve(data);
  }

  static normalizeRoom(documentSnapshot){
    return { id: documentSnapshot.id, ...documentSnapshot.data() }
  }

  // static async getUnreadCount(roomId){
  //   const db = firebase.firestore();
  //   const currentUserEmail = await CurrentUserAPI.getCurrentUserEmail();
  //   const roomsCollection = new RoomsCollection();
  //   const roomDocument = new Document(roomId);
  //   const messagesCollection = new MessagesCollection();
  //   const roomRef = db.collection(roomsCollection.getName()).doc(roomDocument.getId());
  //   const messageRef = roomRef.collection(messagesCollection.getName());
  //   const querySnapshot = await messageRef.where("read.isRead", "==", false).get();
  //   const unreadCount = querySnapshot.docs.filter(documentSnapshot => {
  //     if(documentSnapshot.data().senderEmail !== currentUserEmail) return true;
  //     else return false;
  //   }).length;
  //   return Promise.resolve(unreadCount);
  // }

  /**
   * 
   * @param {enum} type = the type of your room `private`
   * @param {string} audiences 
   * @return {Promise<Object>} - { isExists: <boolean>, documentId: <string> } `true` if the room is exists, together with its id or `false` if not exists
   */
  isRoomExists(type, audiences=[]){
    const roomsCollection = new RoomsCollection();
    let firebaseCollection = roomsCollection.getFirebaseReference();
    firebaseCollection = firebaseCollection.where("type", "==", type);
    audiences.forEach(audience => {
      firebaseCollection = firebaseCollection.where(
        new firebase.firestore.FieldPath("audiences", audience), "==", true
      )
    })

    const getQuery = new GetDocument();
    getQuery.setGetConfiguration("default");
    return getQuery.executeFirebaseQuery(firebaseCollection).then(snapshot => {
      if(snapshot.empty) return { isExists: false, documentId: null }
      else return { isExists: true, documentId: snapshot.docs[0].id }
    })
  }
}

export class PersonalRoomsAPI extends RoomsAPI{
  constructor(){ super(); }
  

  /**
   * 
   * @param {array} audiences
   */
  static async createRoomIfNotExists(firstPeopleEmail, secondPeopleEmail){
    const db = firebase.firestore();
    const roomsCollection = new RoomsCollection();

    const userPath = new firebase.firestore.FieldPath("audiencesQuery", firstPeopleEmail);
    const peoplePath = new firebase.firestore.FieldPath("audiencesQuery", secondPeopleEmail);
    const roomsRef = db.collection(roomsCollection.getName());
    const querySnapshot = await roomsRef.where(userPath, "==", true).where(peoplePath, "==", true).get();
    
    if(querySnapshot.empty){
      const audiencesPayload = {};
      audiencesPayload[firstPeopleEmail] = true;
      audiencesPayload[secondPeopleEmail] = true;
      const payload = { 
        audiences: [firstPeopleEmail, secondPeopleEmail], type: "chat",
        audiencesQuery: audiencesPayload, lastMessage: {message: "", sentTime: null} 
      }

      const roomRef = db.collection(roomsCollection.getName()).doc();
      roomRef.set(payload);
      return Promise.resolve({ id: roomRef.id, ...payload });
    }else return Promise.resolve(RoomsAPI.normalizeRoom(querySnapshot.docs[0]));
  }
}