import firebase from "react-native-firebase";
import uuid from "uuid/v4";
import geohash from 'ngeohash'
import StorageAPI from "src/api/storage";
import Logger from "src/api/logger";
import Database from "src/api/database";
import User from "src/entities/user";
import Email from "src/entities/email";
import ApplicationInformation from "src/entities/applicationInformation";
import PersonalInformation from "src/entities/personalInformation";
import CustomError from "src/entities/error";
import { UserCollection, FriendListCollection, BlockedByCollection } from "src/api/database/collection";
import { Document } from "src/api/database/document";
import { getDistance } from 'geolib';

export default class PeopleAPI{
  constructor(currentUserId=null){
    this.currentUserId = currentUserId;
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
      const userRef = database.collection("users").doc(user.id);
      await userRef.set({ 
        email: user.email,
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
      newPeople.id = JSON.parse(JSON.stringify(documentSnapshot.id));

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
  static async getByMonoId(currentUserId, monoId){
    const db = firebase.firestore();
    const userCollection = new UserCollection();
    const collectionRef = db.collection(userCollection.getName());
    const queryPath = new firebase.firestore.FieldPath("applicationInformation", "monoId");
    const userQuery = collectionRef.orderBy(queryPath,"asc").startAt(monoId).endAt(monoId+"~");
    const querySnapshot = await userQuery.get();
    
    const normalizedPeople = querySnapshot.docs.map((documentSnapshot) => {
      return PeopleAPI.normalizePeople(documentSnapshot)
    });
    const friendListCollection = new FriendListCollection()
    const blockedByCollection = new BlockedByCollection()
    const friendListDocRef = db.collection(friendListCollection.getName()).doc(currentUserId)
    const peopleQuerySnapshot = await friendListDocRef.collection(blockedByCollection.getName()).get()

    const blockedByDocList = peopleQuerySnapshot.docs

    const blockedByIdList = blockedByDocList.map(obj=> obj.id)

    // is user blocked?
    const filteredPeople = normalizedPeople.filter(data => {
      return !blockedByIdList.includes(data.id)
    })

    return Promise.resolve(filteredPeople);
  }

  /**
   * 
   * @param {boolean} online 
   */
  static async getCurrentUser(online=true){
    const user = firebase.auth().currentUser;
    if(!user) throw new CustomError("user/not-logged-in", "Your are not logged in. Cannot perform any action");
    else return await PeopleAPI.getDetailById(user.uid, online);
  }

  /**
   * 
   * @param {User} user 
   * @param {ApplicationInformation} applicationInfo 
   * @param {PersonalInformation} personalInformation
   */
  static async setupApplication(user, applicationInformation, personalInformation){
    if(typeof(user) !== "object") throw new CustomError("user/programmer", "Ops! Something went wrong");
    if(typeof(applicationInformation) !== "object") throw new CustomError("user/programmer", "Ops! Something went wrong");
    if(typeof(personalInformation) !== "object") throw new CustomError("user/programmer", "Ops! Something went wrong");
    if(!(user instanceof User)) throw new CustomError("user/programmer", "Ops! Something went wrong");
    if(!(applicationInformation instanceof ApplicationInformation)) throw new CustomError("user/programmer", "Ops! Something went wrong");
    if(!(personalInformation instanceof PersonalInformation)) throw new CustomError("user/programmer", "Ops! Something went wrong");
    if(!user.id) throw new CustomError("user/programmer", "Ops! Something went wrong");
                 
    await Database.update( async (db) => {
      const usersCollection = new UserCollection();
      const userDocument = new Document(user.id);
      await db.collection(usersCollection.getName()).doc(userDocument.getId()).update({
        personalInformation: personalInformation.data, 
        applicationInformation: applicationInformation.data, 
        isCompleteSetup: true
      });
    });
    return Promise.resolve(true)
  }

  /**
   * 
   * @param {Email} email 
   */
  static async isEmailExists(email){
    if(typeof(email) === "string") email = new Email(email);
    else if(typeof(email) === "object" && !(email instanceof Email)) throw new CustomError("user/programming", "Please tell your programmer about this.");
 
    try{
      await PeopleAPI.getDetailByEmail(email, true);
      return Promise.resolve(true);
    }catch(err){
      if(err.code === "user/not-found") return Promise.resolve(false);
      else throw err;
    }
  }

  /**
   * 
   * @param {string} monoId 
   */
  static async isMonoIdExists(monoId, online=true){
    try{
      await PeopleAPI.getDetailByMonoId(monoId, online);
      return Promise.resolve(true);
    }catch(err){
      if(err.code === "user/not-found") return Promise.resolve(false);
      else throw err;
    }
  }

  /**
   * 
   * @param {Email} email 
   */
  static async ensureUniqueEmail(email){
    const isEmailExists = await PeopleAPI.isEmailExists(email);
    if(isEmailExists) throw new CustomError("user/duplicate", "Please choose another email address");
    else return Promise.resolve(true);
  }

  /**
   * 
   * @param {string} monoId}
   */
  static async ensureUniqueMonoId(monoId, online=true){
    const isMonoIdExists = await PeopleAPI.isMonoIdExists(monoId, online);
    if(isMonoIdExists) throw new CustomError("user/duplicate-mono-id", "Please choose another Mono ID");
    else return Promise.resolve(true);
  }

  /**
   * 
   * @param {String} peopleId 
   * @param {String} storagePath - Firebase Storage Path
   */
  static async changeProfilePicture(peopleId, imagePath){
    let profilePictureUrl = null;
    const storagePath = `/main/profilePicture/${uuid()}.png`;
    return StorageAPI.uploadFile(storagePath, imagePath).then((downloadUrl) => {
      profilePictureUrl = `${downloadUrl}`;
      const db = firebase.firestore();
      const batch = db.batch();

      const userCollection = new UserCollection();
      const userDocument = new Document(peopleId);
      const userRef = db.collection(userCollection.getName()).doc(userDocument.getId());
      batch.update(userRef, { "applicationInformation.profilePicture": {storagePath, downloadUrl} })
      batch.update(userRef, { "statistic.totalProfilePictureChanged": firebase.firestore.FieldValue.increment(1) });
      return batch.commit();
    }).then(() => profilePictureUrl);
  }

  /**
   * 
   * @param {string} monoId 
   * @param {string} online 
   */
  static async getDetailByMonoId(monoId, online=false){
    if(typeof(monoId) !== "string") throw new CustomError("user/programmer", "Ops! Something went wrong");
    if(online) return await PeopleAPI.getDetailOnlineByMonoId(monoId);
    else return await PeopleAPI.getDetailOfflineByMonoId(monoId);
  }

  /**
   * 
   * @param {string} monoId 
   */
  static async getDetailOnlineByMonoId(monoId){
    return await Database.get(async (database) => {
      const usersCollection = new UserCollection();
      const userSnapshot = await database.collection(usersCollection.getName()).where("applicationInformation.monoId", "==", monoId).get();
      if(userSnapshot.size === 0) throw new CustomError("user/not-found", "User not found");
      else return new User().fromSnapshot(userSnapshot.docs[0]);
    }, true);
  }

  /**
   * 
   * @param {*} monoId 
   */
  static async getDetailOfflineByMonoId(monoId){

  }

  /**
   * 
   * @param {string} id 
   * @param {boolean} online 
   */
  static async getDetailById(id, online=false){
    if(typeof(id) !== "string") throw new CustomError("user/programmer", "Ops! Something went wrong");
    if(online) return await PeopleAPI.getDetailOnlineById(id);
    else return await PeopleAPI.getDetailOfflineById(id);
  }

  /**
   * 
   * @param {string} id 
   */
  static async getDetailOnlineById(id){
    return await Database.get(async (database) => {
      const usersCollection = new UserCollection();
      const userDocument = new Document(id);
      const userSnapshot = await database.collection(usersCollection.getName()).doc(userDocument.getId()).get();
      return new User().fromSnapshot(userSnapshot);
    }, true);
  }

  /**
   * 
   * @param {string} id 
   */
  static async getDetailOfflineById(id){}

  /**
   * 
   * @param {Email} email 
   * @param {boolean} online 
   */
  static async getDetailByEmail(email, online=false){
    if(typeof(email) === "string") email = new Email(email);
    if(online) return await PeopleAPI.getDetailOnlineByEmail(email);
    else return await PeopleAPI.getDetailOfflineByEmail(email);
  }

  /**
   * 
   * @param {Email} email 
   */
  static async getDetailOnlineByEmail(email){
    return await Database.get(async (database) => {
      const usersCollection = new UserCollection();
      const userSnapshot = await database.collection(usersCollection.getName()).where("email", "==", email.address).get();
      if(userSnapshot.size === 0) throw new CustomError("user/not-found", "User not found");
      else return new User().fromSnapshot(userSnapshot.docs[0]);
    }, true)
  }

  /**
   * 
   * @param {Email} email 
   */
  static async getDetailOfflineByEmail(email){
    return null;
  }

  /**
   * 
   * @param {string} userId 
   * @param {callback} callback 
   */
  static getDetailWithRealTimeUpdate(userId, callback){
    const db = firebase.firestore();
    const userCollection = new UserCollection();
    const userRef = db.collection(userCollection.getName()).doc(userId);
    return userRef.onSnapshot((documentSnapshot)=>{
      const data = PeopleAPI.normalizePeople(documentSnapshot)
      callback(data)
    })
  }

  static async setOnlineStatus(userId, status){
    const db = firebase.firestore();
    const usersCollection = new UserCollection();
    const userDocument = new Document(userId);
    const userRef = db.collection(usersCollection.getName()).doc(userDocument.getId());
    const batch = db.batch();
    batch.update(userRef, { "lastOnline.status": status });
    batch.update(userRef, { "lastOnline.timestamp": firebase.firestore.FieldValue.serverTimestamp() });
    await batch.commit();
    return Promise.resolve(true);
  }

  static async updateCurrentLocation(userId, data){
    const db = firebase.firestore();
    const usersCollection = new UserCollection();
    const userDocument = new Document(userId);
    const userRef = db.collection(usersCollection.getName()).doc(userDocument.getId());
    const latitude = data.coords.latitude
    const longitude = data.coords.longitude
    const geoHash = geohash.encode(latitude, longitude);

    await userRef.update( { "location": {...data, geoHash } });
    return Promise.resolve(true);
  }

  static async getNearbyPeoples(userId,latitude, longitude, distance){
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
      return (user.distance <= distance&& user.id !== userId)
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

  static async updateUserForLogout(userId){
    // set messaging token to null
    // set user status to logout
    try{
      const db = firebase.firestore();
      const usersCollection = new UserCollection();
      const userRef = db.collection(usersCollection.getName()).doc(userId)
      await userRef.update({tokenInformation: null, isLogin: false})
    }catch{
      return Promise.resolve(false)
    }
    return Promise.resolve(true)
  }

 

}