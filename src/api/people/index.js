import firebase from "react-native-firebase";
import uuid from "uuid/v4";
import geohash from 'ngeohash'
import StorageAPI from "src/api/storage";
import Logger from "src/api/logger";
import Database from "src/api/database";
import User from "src/entities/user";
import Email from "src/entities/email";
import CustomError from "src/entities/error";
import { UserCollection, FriendListCollection, BlockedByCollection } from "src/api/database/collection";
import { Document } from "src/api/database/document";
import { getDistance } from 'geolib';

export default class PeopleAPI{
  constructor(currentUserEmail=null){
    this.currentUserEmail = currentUserEmail;
  }

  static async normalize(user){
    const applicationInformation = await user.applicationInformation.fetch();
    const profilePicture = await user.profilePicture.fetch();
    const statuses = await user.statuses.fetch();
    return { me: user, applicationInformation, profilePicture, statuses }
  }

  /**
   * 
   * @param {User} user 
   */
  static async createUser(user){
    if(!user.phoneNumber) throw new CustomError("user/no-phone-number", "You must provide phone number when creating");

    const userCredential = await firebase.auth().createUserWithEmailAndPassword(user.email, user.password);
    user.id = userCredential.user.uid;

    await Database.insert(async (database) => {
      const userRef = database.collection("users").doc(user.email);
      await userRef.set({ 
        isCompleteSetup: user.isCompleteSetup,
        phoneNumber: {
          value: user.phoneNumber.number, isVerified: user.phoneNumber.isVerified
        }
      })
    });
    return user;
  }

  /**
   * 
   * @param {DocumentSnapshot} documentSnapshot 
   */
  static normalizePeople(documentSnapshot){
    const newPeople = documentSnapshot.data();
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

  /**
   * 
   * @param {Email} email 
   */
  static async isExists(email){
    if(typeof(email) === "string") email = new Email(email);
    else if(typeof(email) === "object" && !(email instanceof Email)) throw new CustomError("user/programming", "Please tell your programmer about this.");
 
    const db = firebase.firestore();
    const userCollection = new UserCollection();
    const userRef = db.collection(userCollection.getName()).doc(email.address);
    const documentSnapshot = await userRef.get();
    if(documentSnapshot.exists) return Promise.resolve(true);
    else return Promise.resolve(false);
  }

  /**
   * 
   * @param {Email} email 
   */
  static async ensureUnique(email){
    const isExists = await PeopleAPI.isExists(email);
    if(isExists) throw new CustomError("user/duplicate", "Please choose another email address");
    else return Promise.resolve(true);
  }

  static async isMonoIdAvailable(monoId){
    const db = firebase.firestore();
    const userCollection = new UserCollection();
    const userQuerySnapshot = await db.collection(userCollection.getName()).where("applicationInformation.id","==",monoId).get();
    return Promise.resolve(userQuerySnapshot.empty);
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
  static async changeProfilePicture(peopleEmail, imagePath){
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
   * @param {Email} email 
   * @param {boolean} online 
   */
  static async getDetailByEmail(email, online=false){
    if(typeof(email) === "string") email = new Email(email);
    if(online) return PeopleAPI.getDetailOnlineByEmail(email);
    else return PeopleAPI.getDetailOfflineByEmail(email);
  }

  /**
   * 
   * @param {Email} email 
   */
  static async getDetailOnlineByEmail(email){
    return await Database.get(async (database) => {
      const usersCollection = new UserCollection();
      const userSnapshot = database.collection(usersCollection.getName()).where("email", "==", email.address).get();
      const [ documentSnapshot ] = userSnapshot.docs;
      
      const user = new User();
      user.fromSnapshot(documentSnapshot);
      return user;
    }, true)
  }

  /**
   * 
   * @param {Email} email 
   */
  static async getDetailOfflineByEmail(email){
    return null;
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