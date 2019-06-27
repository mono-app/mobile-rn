import SInfo from "react-native-sensitive-info";
import firebase from "react-native-firebase";
import moment from "moment";
import uuid from "uuid/v4";
import { StackActions } from "react-navigation";

import StorageAPI from "src/api/storage";
import CurrentUserAPI from "src/api/people/CurrentUser";
import { UserCollection, RoomsCollection, StatusCollection } from "src/api/database/collection";
import { Document } from "src/api/database/document";
import { GetDocument } from "src/api/database/query";

export default class PeopleAPI{
  constructor(currentUserEmail=null){
    this.currentUserEmail = currentUserEmail;
  }

  /**
   * 
   * @param {String} monoId 
   * @param {boolean} includeSelf
   */
  async getByMonoId(monoId, includeSelf=false){
    const db = firebase.firestore();
    const userCollection = new UserCollection();
    const collectionRef = db.collection(userCollection.getName());
    const queryPath = new firebase.firestore.FieldPath("applicationInformation", "id");
    const userQuery = collectionRef.where(queryPath, "==", monoId);
    const querySnapshot = await userQuery.get();
    const currentUserEmail = await CurrentUserAPI.getCurrentUserEmail();
    const foundPeople = querySnapshot.docs.filter(documentSnapshot => documentSnapshot.id !== currentUserEmail)
                                          .map(documentSnapshot => { 
                                            return { id: documentSnapshot.id, ...documentSnapshot.data() }
                                          });
    return Promise.resolve(foundPeople);
  }

  /**
   * 
   * @param {String} email 
   * @param {Navigator} navigator 
   */
  async handleSignedIn(email, navigator){
    const userData = await this.getDetail(email);
    if(userData){
      await CurrentUserAPI.storeBasicInformation(userData);
      CurrentUserAPI.listenChanges();

      const routeNameForReset = (userData.isCompleteSetup)? "MainTabNavigator": "AccountSetup";
      navigator.resetTo(routeNameForReset, StackActions);
    }else throw "Cannot find user in the database. Application error.";
  }

  /**
   * 
   * @param {String} peopleEmail 
   * @param {String} storagePath - Firebase Storage Path
   */
  changeProfilePicture(peopleEmail=null, imagePath){
    const selectedPeopleEmail = (peopleEmail === null)? this.currentUserEmail: peopleEmail;
    if(selectedPeopleEmail){
      let profilePictureUrl = null;
      const storagePath = `/main/profilePicture/${uuid()}.png`;
      return StorageAPI.uploadFile(storagePath, imagePath).then(downloadUrl => {
        profilePictureUrl = `${downloadUrl}`;
        const db = firebase.firestore();
        const batch = db.batch();

        const userCollection = new UserCollection();
        const userDocument = new Document(selectedPeopleEmail);
        const userRef = db.collection(userCollection.getName()).doc(userDocument.getId());
        batch.update(userRef, { "applicationInformation.profilePicture": {storagePath, downloadUrl} })
        batch.update(userRef, { "statistic.totalProfilePictureChanged": firebase.firestore.FieldValue.increment(1) });
        return batch.commit();
      }).then(() => profilePictureUrl);
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
      return getDocumentQuery.executeQuery(userCollection, userDocument).then(documentSnapshot => {
        if(documentSnapshot.exists){
          const userData = { id: documentSnapshot.id, ...documentSnapshot.data() };
          const { applicationInformation } = userData;
          const profilePicture = applicationInformation.profilePicture? applicationInformation.profilePicture.downloadUrl: "https://picsum.photos/200/200/?random";
          userData.applicationInformation.profilePicture = profilePicture;
          return Promise.resolve(userData);
        }else return Promise.resolve(null);
      })
    }else return Promise.resolve(null);
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