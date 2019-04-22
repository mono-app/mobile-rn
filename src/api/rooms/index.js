import { RoomsCollection } from "../database/collection";
import { GetDocument, AddDocument } from "../database/query";
import firebase from "react-native-firebase";

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
  constructor(){
    super();
    this.createRoomIfNotExists = this.createRoomIfNotExists.bind(this);
  }

  /**
   * 
   * @param {array} audiences
   */
  createRoomIfNotExists(audiences=[]){
    return this.isRoomExists("private", audiences).then(({ isExists, documentId }) => {
      if(isExists) return documentId;
      else{
        const payload = { type: "private", audiences: {} };
        audiences.forEach(audience => payload.audiences[audience] = true);

        const roomsCollection = new RoomsCollection();
        const addDocument = new AddDocument();
        return addDocument.executeQuery(roomsCollection, null, { ...payload }).then(doc => doc.id);
      }
    })
  }
}