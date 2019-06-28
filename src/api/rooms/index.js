import firebase from "react-native-firebase";

import { RoomsCollection, RoomUserMappingCollection } from "src/api/database/collection";
import { Document } from "src/api/database/document";
import { GetDocument } from "src/api/database/query";

export default class RoomsAPI{
  constructor(){
    this.isRoomExists = this.isRoomExists.bind(this);
  }

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
    const roomsRef = db.collection(roomsCollection.getName());
    const userPath = new firebase.firestore.FieldPath("audiences", firstPeopleEmail);
    const peoplePath = new firebase.firestore.FieldPath("audiences", secondPeopleEmail);
    const querySnapshot = await roomsRef.where(userPath, "==", true).where(peoplePath, "==", true).get();

    let roomId = null;
    if(querySnapshot.empty){
      const batch = db.batch();
      const newRoomRef = roomsRef.doc();
      
      const audiencesPayload = {}
      audiencesPayload[firstPeopleEmail] = true;
      audiencesPayload[secondPeopleEmail] = true;
      batch.set(newRoomRef, {
        audiences: audiencesPayload, type: "private",
        lastMessage: { message: "", sentTime: null }
      })

      const roomUserMapping = new RoomUserMappingCollection();
      const userDocument = new Document(firstPeopleEmail);
      const peopleDocument = new Document(secondPeopleEmail);
      const userMappingRef = db.collection(roomUserMapping.getName()).doc(userDocument.getId());
      const peopleMappingRef = db.collection(roomUserMapping.getName()).doc(peopleDocument.getId());

      const newRoomId = newRoomRef.id;
      batch.set(userMappingRef, { rooms: firebase.firestore.FieldValue.arrayUnion(newRoomId) }, { merge: true });
      batch.set(peopleMappingRef, { rooms: firebase.firestore.FieldValue.arrayUnion(newRoomId) }, { merge: true });
      await batch.commit();
      roomId = newRoomRef.id;
    }else roomId = querySnapshot.docs[0].id;
    return Promise.resolve(roomId);
  }
}