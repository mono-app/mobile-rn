import SInfo from "react-native-sensitive-info";
import firebase from "react-native-firebase";
import moment from "moment";

import { UserCollection, RoomsCollection } from "../database/collection";
import { Document } from "../database/document";
import { GetDocument, SearchDocumentByField } from "../database/query";

export default class PeopleAPI{
  constructor(){
    this.currentUserEmail = null;
  }

  /**
   * 
   * @param {String} email 
   * @param {String} source - default value `default`, available value `cache`, `server`, `default`
   * @returns {Promise} - object of user in firebase, or null if cannot find
   */
  getDetail(email, source="default"){
    const userCollection = new UserCollection();
    const userDocument = new Document(email);
    const getDocumentQuery = new GetDocument();
    getDocumentQuery.setGetConfiguration(source);
    return getDocumentQuery.executeQuery(userCollection, userDocument).then(doc => {
      if(doc.exists) return doc.data();
      else return null;
    })
  }

  /**
   * Get currentUserEmail from local database.
   * @returns {Promise} - a promise that contains a `currentUserEmail` variable. return your currentUserEmail
   */
  getCurrentUserEmail(){
    return SInfo.getItem("currentUserEmail", {}).then(currentUserEmail => {
      this.currentUserEmail = currentUserEmail;
      return currentUserEmail;
    })
  }

  async getRoomsWithRealtimeUpdate(callback){
    const currentUserEmail = await this.getCurrentUserEmail();
    const roomCollection = new RoomsCollection();
    const searchField = new firebase.firestore.FieldPath("audiences", currentUserEmail);
    const db = firebase.firestore();
    const roomRef = db.collection(roomCollection.getName()).where(searchField, "==", true);
    roomRef.onSnapshot({ includeMetadataChanges: true }, async querySnapshot => {
      let rooms = [];
      await Promise.all(querySnapshot.docs.map(async doc => {
        let room = doc.data();
        if(room.type === "private"){
          // we are assuming that the audiences for private will only have 2 audiences.
          const audienceEmail = Object.keys(room.audiences).filter(audience => currentUserEmail !== audience)[0];
          const audience = await this.getDetail(audienceEmail);
          delete room.audiences;
          room = { audience, ...room, id: doc.id };
          rooms.push(room);
        }
      }));

      // Sort based on lastMessage.sentTime
      rooms.sort((a, b) => {
        const firstSentItem = parseInt(new moment(a.lastMessage.sentTime).format("x"));
        const secondSentItem = parseInt(new moment(b.lastMessage.sentTime).format("x"));

        if(firstSentItem> secondSentItem) return -1
        else if(firstSentItem < secondSentItem) return 1
        else return 0;
      });
      callback(rooms);
    })
  }
}