import SInfo from "react-native-sensitive-info";
import firebase from "react-native-firebase";

import { UserCollection, RoomsCollection, StatusCollection } from "src/api/database/collection";
import { Document } from "src/api/database/document";
import { GetDocument } from "src/api/database/query";

export default class PeopleAPI{
  constructor(currentUserEmail=null){
    this.currentUserEmail = currentUserEmail;
  }

  /**
   * 
   * @param {String} peopleEmail 
   * @returns {Promise} - `null` if status is not found.
   */
  getLatestStatus(peopleEmail=null){
    const selectedPeopleEmail = (peopleEmail === null)? this.currentUserEmail: peopleEmail;
    if(selectedPeopleEmail){
      const db = firebase.firestore();
      const userCollection = new UserCollection();
      const userDocument = new Document(selectedPeopleEmail);
      const statusCollection = new StatusCollection();

      const userRef = db.collection(userCollection.getName()).doc(userDocument.getId());
      const statusRef = userRef.collection(statusCollection.getName());
      return statusRef.orderBy("timestamp", "desc").limit(1).get().then(querySnapshot => {
        if(querySnapshot.empty) return null;
        else return querySnapshot.docs[0].data()
      })
    }else return new Promise((resolve, reject) => resolve(null));
  }

  /**
   * 
   * @param {String} email 
   * @param {String} source - default value `default`, available value `cache`, `server`, `default`
   * @returns {Promise} - object of user in firebase, or null if cannot find
   */
  getDetail(email=null, source="default"){
    const selectedPeopleEmail = (email === null)? this.currentUserEmail: email;

    if(selectedPeopleEmail){
      const userCollection = new UserCollection();
      const userDocument = new Document(selectedPeopleEmail);
      const getDocumentQuery = new GetDocument();
      getDocumentQuery.setGetConfiguration(source);
      return getDocumentQuery.executeQuery(userCollection, userDocument).then(doc => {
        if(doc.exists) return doc.data();
        else return null;
      })
    }else return new Promise((resolve, reject) => resolve(null));
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
        const firstSentItem = a.lastMessage.sentTime.seconds;
        const secondSentItem = b.lastMessage.sentTime.seconds;

        if(firstSentItem> secondSentItem) return -1
        else if(firstSentItem < secondSentItem) return 1
        else return 0;
      });
      callback(rooms);
    })
  }

  
}