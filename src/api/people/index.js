import SInfo from "react-native-sensitive-info";
import firebase from "react-native-firebase";
import moment from "moment";

import StorageAPI from "src/api/storage";
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
   * @param {String} storagePath - Firebase Storage Path
   */
  changeProfilePicture(peopleEmail=null, storagePath){
    const selectedPeopleEmail = (peopleEmail === null)? this.currentUserEmail: peopleEmail;
    if(selectedPeopleEmail){
      const db = firebase.firestore();
      const batch = db.batch();

      const userCollection = new UserCollection();
      const userDocument = new Document(selectedPeopleEmail);
      const userRef = db.collection(userCollection.getName()).doc(userDocument.getId());
      batch.update(userRef, { "applicationInformation.profilePicture": storagePath})
      batch.update(userRef, { "statistic.totalProfilePictureChanged": firebase.firestore.FieldValue.increment(1) });
      return batch.commit();
    }
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
    }else return null;
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
      let userData = null;
      return getDocumentQuery.executeQuery(userCollection, userDocument).then(doc => {
        if(doc.exists) {
          userData = doc.data();
          if(userData.applicationInformation.profilePicture) return StorageAPI.getDownloadURL(userData.applicationInformation.profilePicture);
          else return null;
        }else return null;
      }).then(profilePicture => {
        if(profilePicture) userData.applicationInformation.profilePicture = profilePicture;
        else userData.applicationInformation.profilePicture = "https://picsum.photos/200/200/?random";
        return userData;
      })
    }else return null;
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
        const firstSentItem = a.lastMessage.sentTime? a.lastMessage.sentTime.seconds: moment().unix();
        const secondSentItem = b.lastMessage.sentTime? b.lastMessage.sentTime.seconds: moment().unix();

        if(firstSentItem > secondSentItem) return -1
        else if(firstSentItem < secondSentItem) return 1
        else return 0;
      });
      callback(rooms);
    })
  }

}