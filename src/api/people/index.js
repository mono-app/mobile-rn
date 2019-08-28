import React from "react";
import firebase from "react-native-firebase";
import moment from "moment";
import uuid from "uuid/v4";
import Logger from "src/api/logger";
import StorageAPI from "src/api/storage";
import CurrentUserAPI from "src/api/people/CurrentUser";
import { StackActions } from "react-navigation";
import { UserCollection, RoomsCollection, StatusCollection } from "src/api/database/collection";
import { Document } from "src/api/database/document";

export default class PeopleAPI{
  constructor(currentUserEmail=null){
    this.currentUserEmail = currentUserEmail;
  }

  /**
   * 
   * @param {DocumentSnapshot} documentSnapshot 
   */
  static normalizePeople(documentSnapshot){
    const newPeople = documentSnapshot.data();
    newPeople.email = JSON.parse(JSON.stringify(documentSnapshot.id));

    if(newPeople.isCompleteSetup) {
      if(newPeople.applicationInformation.profilePicture !== undefined){
        newPeople.profilePicture = JSON.parse(JSON.stringify(newPeople.applicationInformation.profilePicture.downloadUrl));
      }else newPeople.profilePicture = "https://picsum.photos/200/200/?random";
    }
    return newPeople;
  }

  /**
   * 
   * @param {String} monoId 
   */
  static async getByMonoId(monoId){
    const db = firebase.firestore();
    const userCollection = new UserCollection();
    const collectionRef = db.collection(userCollection.getName());
    const queryPath = new firebase.firestore.FieldPath("applicationInformation", "id");
    const userQuery = collectionRef.where(queryPath, "==", monoId);
    const querySnapshot = await userQuery.get();
    const normalizedPeople = querySnapshot.docs.map((documentSnapshot) => PeopleAPI.normalizePeople(documentSnapshot));
    return Promise.resolve(normalizedPeople);
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

  static async storeMessagingToken(peopleEmail, messagingToken){
    const db = firebase.firestore();
    const usersCollection = new UserCollection();
    const userDocument = new Document(peopleEmail);
    const userRef = db.collection(usersCollection.getName()).doc(userDocument.getId());
    await userRef.update({ "tokenInformation.messagingToken": messagingToken });
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
   * @param {String} email 
   * @param {String} source - default value `default`, available value `cache`, `server`, `default`
   * @returns {Promise} - object of user in firebase, or null if cannot find
   */
  static async getDetail(email=null, source="default"){
    if(email){
      const userCollection = new UserCollection();
      const userDocument = new Document(email);
      const db = new firebase.firestore();
      const userRef = db.collection(userCollection.getName()).doc(userDocument.getId());
      const documentSnapshot = await userRef.get({ source });
      if(documentSnapshot.exists){
        const userData = PeopleAPI.normalizePeople(documentSnapshot);
        return Promise.resolve(userData);
      }else return Promise.resolve(null);
    }else return Promise.resolve(null);
  }

  /**
   * Get currentUserEmail from local database.
   * @returns {Promise} - a promise that contains a `currentUserEmail` variable. return your currentUserEmail
   */
  async getCurrentUserEmail(){
    const currentUserEmail = await CurrentUserAPI.getCurrentUserEmail();
    this.currentUserEmail = JSON.parse(JSON.stringify(currentUserEmail));
    return Promise.resolve(currentUserEmail);
  }

  static async setOnlineStatus(peopleEmail, status){
    const db = firebase.firestore();
    const usersCollection = new UserCollection();
    const userDocument = new Document(peopleEmail);
    const userRef = db.collection(usersCollection.getName()).doc(userDocument.getId());
    const batch = db.batch();
    batch.update(userRef, { "lastOnline.status": status });
    batch.update(userRef, { "lastOnline.timestamp": moment().unix() });
    await batch.commit();
    return Promise.resolve(true);
  }

}