import firebase from "react-native-firebase";
import uuid from "uuid/v4";
import geohash from 'ngeohash'
import StorageAPI from "src/api/storage";
import CurrentUserAPI from "src/api/people/CurrentUser";
import Logger from "src/api/logger";
import { StackActions } from "react-navigation";
import { UserCollection, FriendListCollection, BlockedByCollection } from "src/api/database/collection";
import { Document } from "src/api/database/document";
import { getDistance } from 'geolib';

import { getConnection } from "typeorm";
import { Document as DocumentSchema } from "src/api/database/models";

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
    Logger.log("PeopleAPI.normalizePeople#newPeople", newPeople);
    if(documentSnapshot.exists) {
      newPeople.email = JSON.parse(JSON.stringify(documentSnapshot.id));
      if(newPeople.isCompleteSetup) {
        if(newPeople.applicationInformation.profilePicture !== undefined){
          newPeople.profilePicture = JSON.parse(JSON.stringify(newPeople.applicationInformation.profilePicture.downloadUrl));
        }else newPeople.profilePicture = "https://picsum.photos/200/200/?random";
      }
    }
    return newPeople;
  }

  static normalizeOffline(offlineUser){
    Logger.log("PeopleAPI.normalizeOffline#offlineUser", offlineUser);
    const newPeople = JSON.parse(offlineUser.jsonValue);
    newPeople.email = JSON.parse(JSON.stringify(offlineUser.id));
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
  static async getByMonoId(currentUserEmail, monoId){
    const db = firebase.firestore();
    const userCollection = new UserCollection();
    const collectionRef = db.collection(userCollection.getName());
    const queryPath = new firebase.firestore.FieldPath("applicationInformation", "id");
    const userQuery = collectionRef.orderBy(queryPath,"asc").startAt(monoId).endAt(monoId+"~");
    const querySnapshot = await userQuery.get();
    
    const normalizedPeople = querySnapshot.docs.map((documentSnapshot) => {
      return PeopleAPI.normalizePeople(documentSnapshot)
    });
    const friendListCollection = new FriendListCollection()
    const blockedByCollection = new BlockedByCollection()
    const friendListDocRef = db.collection(friendListCollection.getName()).doc(currentUserEmail)
    const peopleQuerySnapshot = await friendListDocRef.collection(blockedByCollection.getName()).get()

    const blockedByDocList = peopleQuerySnapshot.docs

    const blockedByIdList = blockedByDocList.map(obj=> obj.id)

    // is user blocked?
    const filteredPeople = normalizedPeople.filter(data => {
      return !blockedByIdList.includes(data.email)
    })

    return Promise.resolve(filteredPeople);
  }

  static async isExists(email){
    const db = firebase.firestore();
    const userCollection = new UserCollection();
    const userRef = db.collection(userCollection.getName()).doc(email);
    const documentSnapshot = await userRef.get();
    return Promise.resolve(documentSnapshot.exists);
  }

  static async isMonoIdAvailable(monoId){
    const db = firebase.firestore();
    const userCollection = new UserCollection();
    const userQuerySnapshot = await db.collection(userCollection.getName()).where("applicationInformation.id","==",monoId).get();
    return Promise.resolve(userQuerySnapshot.empty);
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
    await userRef.update({ "tokenInformation.messagingToken": messagingToken, isLogin: true });
  }

  /**
   * 
   * @param {String} peopleEmail 
   * @param {String} storagePath - Firebase Storage Path
   */
  static changeProfilePicture(peopleEmail, imagePath){
    let profilePictureUrl = null;
    const storagePath = `/main/profilePicture/${uuid()}.png`;
    return StorageAPI.uploadFile(storagePath, imagePath).then((downloadUrl) => {
      profilePictureUrl = `${downloadUrl}`;
      const db = firebase.firestore();
      const batch = db.batch();

      const userCollection = new UserCollection();
      const userDocument = new Document(peopleEmail);
      const userRef = db.collection(userCollection.getName()).doc(userDocument.getId());
      batch.update(userRef, { "applicationInformation.profilePicture": {storagePath, downloadUrl} })
      batch.update(userRef, { "statistic.totalProfilePictureChanged": firebase.firestore.FieldValue.increment(1) });
      return batch.commit();
    }).then(() => profilePictureUrl);
  }

  /**
   * 
   * @param {String} email 
   * @param {String} source - default value `default`, available value `cache`, `server`, `default`
   * @returns {Promise} - object of user in firebase, or null if cannot find
   */
  static async getDetail(email=null){
    try{
      const connection = await getConnection();
      const repository = connection.getRepository("Document");
      const user = await repository.findOne({ id: email, collection: "users" });
      Logger.log("PeopleAPI.getDetail#user", user);
      Logger.log("PeopleAPI.getDetail#email", email);
      if(user === undefined) return Promise.resolve(await PeopleAPI.getFromServer(email));
      else return Promise.resolve(await PeopleAPI.normalizeOffline(user));
    }catch(err){ 
      Logger.log("PeopleAPI.getDetail#err", err);
      if(err.name === "RepositoryNotFoundError"){
        return Promise.resolve(await PeopleAPI.getFromServer(email));
      }else Promise.reject(err);
    }
  }

  static async saveOffline(userData){
    Logger.log("PeopleAPI.saveOffline#userData", userData);
    
    const mUser = new DocumentSchema();
    mUser.id = userData.email;
    mUser.collection = "users";
    mUser.jsonValue = JSON.stringify(userData);

    const connection = await getConnection();
    const userRepository = connection.getRepository("Document");
    await userRepository.save(mUser);
  }

  static async getFromServer(email, syncOffline=true){
    Logger.log("PeopleAPI.getFromServer#email", email);
    const userCollection = new UserCollection();
    const userDocument = new Document(email);
    const db = firebase.firestore();
    const userRef = db.collection(userCollection.getName()).doc(userDocument.getId());
    const documentSnapshot = await userRef.get();
    if(documentSnapshot.exists){
      const userData = PeopleAPI.normalizePeople(documentSnapshot);
      if(syncOffline) await PeopleAPI.saveOffline(userData);
      return Promise.resolve(userData);
    }else return Promise.resolve(null);
  }

  static getDetailWithRealTimeUpdate(email, callback){
    const db = firebase.firestore();
    const userCollection = new UserCollection();
    const userRef = db.collection(userCollection.getName()).doc(email);
    return userRef.onSnapshot((documentSnapshot)=>{
      const data = PeopleAPI.normalizePeople(documentSnapshot)
      callback(data)
    })
  }

  static async setOnlineStatus(peopleEmail, status){
    const db = firebase.firestore();
    const usersCollection = new UserCollection();
    const userDocument = new Document(peopleEmail);
    const userRef = db.collection(usersCollection.getName()).doc(userDocument.getId());
    const batch = db.batch();
    batch.update(userRef, { "lastOnline.status": status });
    batch.update(userRef, { "lastOnline.timestamp": firebase.firestore.FieldValue.serverTimestamp() });
    await batch.commit();
    return Promise.resolve(true);
  }

  static async updateCurrentLocation(peopleEmail, data){
    const db = firebase.firestore();
    const usersCollection = new UserCollection();
    const userDocument = new Document(peopleEmail);
    const userRef = db.collection(usersCollection.getName()).doc(userDocument.getId());
    const latitude = data.coords.latitude
    const longitude = data.coords.longitude
    const geoHash = geohash.encode(latitude, longitude);

    await userRef.update( { "location": {...data, geoHash } });
    return Promise.resolve(true);
  }

  static async getNearbyPeoples(userEmail,latitude, longitude, distance){
    // distance in meters
    const db = firebase.firestore();
    const usersCollection = new UserCollection();
    const userRef = db.collection(usersCollection.getName())
    const geoHash = geohash.encode(latitude, longitude).substring(0,5)

    const userSnapshot = await userRef.orderBy('location.geoHash','asc').startAt(geoHash).endAt(geoHash+"~").get()
    const userDocuments = (await userSnapshot.docs).map((snap) => {
      const peopleLat = snap.data().location.coords.latitude
      const peopleLong = snap.data().location.coords.longitude
      const meters = getDistance({ latitude, longitude },
        { latitude: peopleLat, longitude: peopleLong })

      return {...PeopleAPI.normalizePeople(snap), distance: meters}
    });

    const filteredUsersByDistance = userDocuments.filter((user)=>{
      return (user.distance <= distance&& user.email !== userEmail)
    })
    // sort from nearest
    filteredUsersByDistance.sort((a, b) => (a.distance < b.distance) ? 1 : -1)

    let result = []
    if(filteredUsersByDistance.length > 51){
      result = filteredUsersByDistance.slice(0, 50);
    }else{
      result = filteredUsersByDistance
    }

    return Promise.resolve(result);
  }

  static async updateUserForLogout(email){
    // set messaging token to null
    // set user status to logout
    try{
      const db = firebase.firestore();
      const usersCollection = new UserCollection();
      const userRef = db.collection(usersCollection.getName()).doc(email)
      await userRef.update({tokenInformation: null, isLogin: false})
    }catch{
      return Promise.resolve(false)
    }
    return Promise.resolve(true)
  }

 

}