import firebase from "react-native-firebase";
import Logger from "src/api/logger";
import PeopleAPI from "src/api/people";
import { FriendRequestCollection, FriendListCollection, PeopleCollection, UserCollection, BlockedCollection, HideCollection } from "src/api/database/collection";
import { Document } from "src/api/database/document";

export default class FriendsAPI{

  static normalizeFriend(documentSnapshot){
    return { id: documentSnapshot.id, ...documentSnapshot.data() }
  }

  async getFriendStatus(userId, friendId){
    const db = firebase.firestore();
    const friendListCollection = new FriendListCollection();
    const peopleCollection = new PeopleCollection();
    const userDocument = new Document(userId);
    const peopleDocument = new Document(friendId);
    const friendListRef = db.collection(friendListCollection.getName()).doc(userDocument.getId());
    const peopleRef = friendListRef.collection(peopleCollection.getName()).doc(peopleDocument.getId());
    const peopleDocumentSnapshot = await peopleRef.get();

    // if available in friendList, it means you are friends with that person;
    // if not, check if you are requesting a friend request to that person or not;
    // if I am not requesting, check if the other party is requestiong or not;
    if(peopleDocumentSnapshot.exists) {
      const data = peopleDocumentSnapshot.data()
      if(data.status ==="blocked"){
        return Promise.resolve("blocked");
      }else if(data.status === "hide"){
        return Promise.resolve("hide");
      }else{
        return Promise.resolve("friend");
      }
    }else{
      const friendRequestCollection = new FriendRequestCollection();
      const userFriendRequestRef = db.collection(friendRequestCollection.getName()).doc(peopleDocument.getId());
      const userRef = userFriendRequestRef.collection(peopleCollection.getName()).doc(userDocument.getId())
      const userDocumentSnapshot = await userRef.get();

      // I am sending a request to the people, so my friend status is requesting
      if(userDocumentSnapshot.exists) return Promise.resolve("requesting");
      else{
        const peopleFriendRequestRef = db.collection(friendRequestCollection.getName()).doc(userDocument.getId());
        const peopleRef = peopleFriendRequestRef.collection(peopleCollection.getName()).doc(peopleDocument.getId());
        const peopleDocumentSnapshot = await peopleRef.get();

        // I am geeting the friend request from user, so my friend status is pedingAccept
        if(peopleDocumentSnapshot.exists) return Promise.resolve("pendingAccept");
        else {
          const blockedCollection = new BlockedCollection()
          const blockedDocRef = friendListRef.collection(blockedCollection.getName()).doc(friendId)
          const blockedSnapshot = await blockedDocRef.get()
          if(blockedSnapshot.exists){
            return Promise.resolve("blocked");
          }else{
            const hideCollection = new HideCollection()
            const hideDocRef = friendListRef.collection(hideCollection.getName()).doc(friendId)
            const hideSnapshot = await hideDocRef.get()
            if(hideSnapshot.exists){
              return Promise.resolve("hide");
            }
          }

          return Promise.resolve("stranger");

        }
        
      }
    }
  }

  /**
   * 
   * @param {String} peopleId 
   */
  static async getFriends(peopleId){
    const db = firebase.firestore();
    const friendListCollection = new FriendListCollection();
    const peopleCollection = new PeopleCollection();
    const userCollection = new UserCollection();
    const userDocument = new Document(peopleId);
    const friendListRef = db.collection(friendListCollection.getName()).doc(userDocument.getId());
    const peopleRef = friendListRef.collection(peopleCollection.getName());
    const querySnapshot = await peopleRef.get();
    
    if(querySnapshot.empty) return Promise.resolve([]);
    else{
      const arrayOfPromise = querySnapshot.docs.map(async (snap) => {
        const user = await PeopleAPI.getDetail(snap.id);
        return Promise.resolve({...user, source: snap.data().source})
      });

      const userDocuments = await Promise.all(arrayOfPromise);
      userDocuments.sort((a, b) => ((a.name && b.name)&&a.name.toLowerCase() > b.name.toLowerCase()) ? 1 : -1)
      return Promise.resolve(userDocuments);
    }
  }

  /**
   * Get all the friends in the list with real time update
   * 
   * @param {string} peopleId 
   * @param {function} callback - a callback function that accepts array of friends as its parameters
   * @returns {function} - unsubscribe function from the listener
   */
  static getFriendsWithRealTimeUpdate(peopleId, callback){
    const db = firebase.firestore();
    const userCollection = new UserCollection();
    const friendListCollection = new FriendListCollection();
    const peopleCollection = new PeopleCollection();
    const userDocument = new Document(peopleId);
    const friendListRef = db.collection(friendListCollection.getName()).doc(userDocument.getId());
    const peopleRef = friendListRef.collection(peopleCollection.getName());
    return peopleRef.onSnapshot(async (querySnapshot) => {
    
      if(!querySnapshot.empty) {
        const friendList = querySnapshot.docs
        const filteredFriendList = friendList.filter(documentSnapshot => {
          const data = documentSnapshot.data()
          return (!data.status || (data.status && data.status !== "blocked" && data.status !== "blocked-by" &&  data.status !== "hide"))
        })
         const promises = filteredFriendList.map((documentSnapshot) => {
          const userDocument = new Document(documentSnapshot.id);
          const userRef = db.collection(userCollection.getName()).doc(userDocument.getId());
          return userRef.get();
        })
        const friends = await Promise.all(promises);

        //filter if friend is exist in users
        const filteredFriends = friends.filter(documentSnapshot=>{
          return (documentSnapshot.data() && documentSnapshot.data().isCompleteSetup)
        })

        const normalizedFriends = filteredFriends.map((documentSnapshot) => {
          return FriendsAPI.normalizeFriend(documentSnapshot);
        });

        Logger.log("FriendsAPI.getFriendsWithRealTimeUpdate", (filteredFriendList, normalizedFriends));
        callback(normalizedFriends)
      }else callback([]);
    })
  }

  static async getBlockedUsers(peopleId){
    const db = firebase.firestore();
    const friendListCollection = new FriendListCollection();
    const blockedCollection = new BlockedCollection();
    const userDocument = new Document(peopleId);
    const friendListRef = db.collection(friendListCollection.getName()).doc(userDocument.getId());
    const peopleRef = friendListRef.collection(blockedCollection.getName());
    const querySnapshot = await peopleRef.get();
    
    if(querySnapshot.empty) return Promise.resolve([]);
    else{
      const arrayOfPromise = querySnapshot.docs.map(async (snap) => {
        const user = await PeopleAPI.getDetail(snap.id);
        return Promise.resolve({...user, source: snap.data().source})
      });

      const userDocuments = await Promise.all(arrayOfPromise);
      userDocuments.sort((a, b) => ((a.name && b.name)&&a.name.toLowerCase() > b.name.toLowerCase()) ? 1 : -1)
      return Promise.resolve(userDocuments);
    }
  }

  static async getHiddenUsers(peopleId){
    const db = firebase.firestore();
    const friendListCollection = new FriendListCollection();
    const hideCollection = new HideCollection();
    const userDocument = new Document(peopleId);
    const friendListRef = db.collection(friendListCollection.getName()).doc(userDocument.getId());
    const peopleRef = friendListRef.collection(hideCollection.getName());
    const querySnapshot = await peopleRef.get();
    
    if(querySnapshot.empty) return Promise.resolve([]);
    else{
      const arrayOfPromise = querySnapshot.docs.map(async (snap) => {
        const user = await PeopleAPI.getDetail(snap.id);
        return Promise.resolve({...user, source: snap.data().source})
      });

      const userDocuments = await Promise.all(arrayOfPromise);
      userDocuments.sort((a, b) => ((a.name && b.name)&&a.name.toLowerCase() > b.name.toLowerCase()) ? 1 : -1)
      return Promise.resolve(userDocuments);
    }
  }


  /**
   * 
   * @param {String} peopleId 
   * @param {function} callback - return QuerySnapshot
   * @returns {function} - use the return value to unsubscribe.
   */
  static getFriendRequestWithRealTimeUpdate(peopleId, callback){
    const db = firebase.firestore();
    const userCollection = new UserCollection();
    const friendRequestCollection = new FriendRequestCollection();
    const peopleCollection = new PeopleCollection();
    const userDocument = new Document(peopleId);
    const friendRequestRef = db.collection(friendRequestCollection.getName()).doc(userDocument.getId());
    const peopleRef = friendRequestRef.collection(peopleCollection.getName());
    return peopleRef.onSnapshot({ includeMetadataChanges: true }, async querySnapshot => {
      if(!querySnapshot.empty) {
        const promises = querySnapshot.docs.map((documentSnapshot) => {
          const userDocument = new Document(documentSnapshot.id);
          const userRef = db.collection(userCollection.getName()).doc(userDocument.getId());
          return userRef.get();
        })
        const friends = await Promise.all(promises);
        const normalizedFriends = friends.map((documentSnapshot) => {
          return PeopleAPI.normalizePeople(documentSnapshot);
        });
        callback(normalizedFriends)
      }else callback([]);
    })
  }

  /**
   * 
   * @param {string} peopleId - the one that rejecting
   * @param {string} friendId - the one that being rejected
   */
  async rejectRequest(peopleId, friendId){
    const result = await this.cancelRequest(friendId, peopleId)
    return Promise.resolve(result);
  }

  /**
   * 
   * @param {string} peopleId - the one that accepting
   * @param {string} friendId - the one that being accepted
   * @param {Object} source - where do you get the contact? { id: <string>, value: <string> }
   */
  async acceptRequest(peopleId, friendId, source){
   
    try{
      const db = firebase.firestore();
      const friendListCollection = new FriendListCollection();
      const peopleCollection = new PeopleCollection();
      const userDocument = new Document(peopleId);
      const peopleDocument = new Document(friendId);
      const userFriendListRef = db.collection(friendListCollection.getName()).doc(userDocument.getId());
      const peopleFriendListRef = db.collection(friendListCollection.getName()).doc(peopleDocument.getId());
      const userPeopleRef = userFriendListRef.collection(peopleCollection.getName()).doc(peopleDocument.getId());
      const peoplePeopleRef = peopleFriendListRef.collection(peopleCollection.getName()).doc(userDocument.getId());
      
      
      const promises = [ 
        userPeopleRef.set({ creationTime: firebase.firestore.FieldValue.serverTimestamp(), source }),
        peoplePeopleRef.set({ creationTime: firebase.firestore.FieldValue.serverTimestamp(), source })
      ];

      promises.push(this.cancelRequest(friendId, peopleId))

      await Promise.all(promises);
      return Promise.resolve(true);
    }catch(err){
      console.log(err);
      return Promise.resolve(false);
    }
  }

  async setFriends(peopleId, friendId, source){
    // used for add new friend from barcode scan (auto become friend without friendRequest)
    try{
      const db = firebase.firestore();
      const friendListCollection = new FriendListCollection();
      const peopleCollection = new PeopleCollection();
      const userDocument = new Document(peopleId);
      const peopleDocument = new Document(friendId);


      const userFriendListRef = db.collection(friendListCollection.getName()).doc(userDocument.getId());
      const peopleFriendListRef = db.collection(friendListCollection.getName()).doc(peopleDocument.getId());
      const userPeopleRef = userFriendListRef.collection(peopleCollection.getName()).doc(peopleDocument.getId());
      const peoplePeopleRef = peopleFriendListRef.collection(peopleCollection.getName()).doc(userDocument.getId());

      const userPeopleSnapshot = await userPeopleRef.get()
      const peoplePeopleSnapshot = await peoplePeopleRef.get()
      // check if already friends or not
      if(!userPeopleSnapshot.exists || !peoplePeopleSnapshot.exists){
        const promises = [ 
          userPeopleRef.set({ creationTime: firebase.firestore.FieldValue.serverTimestamp(), source }),
          peoplePeopleRef.set({ creationTime: firebase.firestore.FieldValue.serverTimestamp(), source })
        ];
        await Promise.all(promises);
      }

      return Promise.resolve(true);
    }catch(err){
      console.log(err);
      return Promise.resolve(false);
    }
  }

  /**
   * 
   * @param {string} peopleId - the one that cancelling
   * @param {string} friendId - the one that being cancelled
   */
  async cancelRequest(peopleId, friendId){
    try{
      const db = firebase.firestore();
      const friendRequestCollection = new FriendRequestCollection();
      const peopleCollection = new PeopleCollection();
      const userDocument = new Document(peopleId);
      const peopleDocument = new Document(friendId);
      const friendRequestRef = db.collection(friendRequestCollection.getName()).doc(peopleDocument.getId());
      const peopleRef = friendRequestRef.collection(peopleCollection.getName()).doc(userDocument.getId());
      await peopleRef.delete();
      return Promise.resolve(true);
    }catch(err){
      console.log(err);
      return Promise.resolve(false);
    }
  }

  /**
   * 
   * @param {string} peopleId - the one that adding
   * @param {string} friendId - the one that being added
   * @param {Object} source - where do you get the contact? { id: <string>, value: <string> }
   */
  async sendRequest(peopleId, friendId, source){
    try{
      const db = firebase.firestore();
      const friendRequestCollection = new FriendRequestCollection();
      const peopleCollection = new PeopleCollection();
      const friendDocument = new Document(friendId);
      const userDocument = new Document(peopleId);
      const friendRequestRef = db.collection(friendRequestCollection.getName()).doc(friendDocument.getId());
      const peopleRef = friendRequestRef.collection(peopleCollection.getName()).doc(userDocument.getId());
      await peopleRef.set({ creationTime: firebase.firestore.FieldValue.serverTimestamp(), source });
      return Promise.resolve(true);
    }catch(err){ 
      console.log(err);
      return Promise.resolve(false); 
    }
  }

  static async blockUsers(currentUserId, peopleId){
    const db = firebase.firestore();
    const friendListCollection = new FriendListCollection();
    const blockedCollection = new BlockedCollection();
    const friendListDocRef = db.collection(friendListCollection.getName()).doc(currentUserId);
    const blockedDocRef = friendListDocRef.collection(blockedCollection.getName()).doc(peopleId)
    const blockedSnapshot = await blockedDocRef.get()
    if(!blockedSnapshot.exists){
      await blockedDocRef.set({creationTime: firebase.firestore.FieldValue.serverTimestamp()})
    }
    //update status friendList
    const peopleCollection = new PeopleCollection();

    const peopleDocRef = friendListDocRef.collection(peopleCollection.getName()).doc(peopleId)

    const peopleSnapshot = await peopleDocRef.get()

    if(peopleSnapshot.exists){
      await peopleDocRef.update({status: "blocked"})
    }

    return Promise.resolve(true)
  }

  static async unblockUsers(currentUserId, peopleId){
    const db = firebase.firestore();
    const friendListCollection = new FriendListCollection();
    const blockedCollection = new BlockedCollection();
    const friendListDocRef = db.collection(friendListCollection.getName()).doc(currentUserId);
    const blockedDocRef = friendListDocRef.collection(blockedCollection.getName()).doc(peopleId)
    const blockedSnapshot = await blockedDocRef.get()
    if(blockedSnapshot.exists){
      await blockedDocRef.delete()
    }

    //update status friendList
    const peopleCollection = new PeopleCollection();

    const peopleDocRef = friendListDocRef.collection(peopleCollection.getName()).doc(peopleId)

    const peopleSnapshot = await peopleDocRef.get()
  
    if(peopleSnapshot.exists){
      await peopleDocRef.update({status: "friend"})
    }

    return Promise.resolve(true)
  }

  static async hideUsers(currentUserId, peopleId){
    const db = firebase.firestore();
    const friendListCollection = new FriendListCollection();
    const hideCollection = new HideCollection();
    const friendListDocRef = db.collection(friendListCollection.getName()).doc(currentUserId);
    const hideDocRef = friendListDocRef.collection(hideCollection.getName()).doc(peopleId)
    const hideSnapshot = await hideDocRef.get()
    if(!hideSnapshot.exists){
      await hideDocRef.set({creationTime: firebase.firestore.FieldValue.serverTimestamp()})
    }

    //update status friendList
    const peopleCollection = new PeopleCollection();

    const peopleDocRef = friendListDocRef.collection(peopleCollection.getName()).doc(peopleId)

    const peopleSnapshot = await peopleDocRef.get()

    if(peopleSnapshot.exists){
      await peopleDocRef.update({status: "hide"})
    }

    return Promise.resolve(true)
  }

  static async unhideUsers(currentUserId, peopleId){
    const db = firebase.firestore();
    const friendListCollection = new FriendListCollection();
    const hideCollection = new HideCollection();
    const friendListDocRef = db.collection(friendListCollection.getName()).doc(currentUserId);
    const hideDocRef = friendListDocRef.collection(hideCollection.getName()).doc(peopleId)
    const hideSnapshot = await hideDocRef.get()
    if(hideSnapshot.exists){
      await hideDocRef.delete()
    }
    //update status friendList
    const peopleCollection = new PeopleCollection();

    const peopleDocRef = friendListDocRef.collection(peopleCollection.getName()).doc(peopleId)

    const peopleSnapshot = await peopleDocRef.get()
  
    if(peopleSnapshot.exists){
      await peopleDocRef.update({status: "friend"})
    }

    return Promise.resolve(true)
  }

  static async isFriends(currentUserId, peopleId){
    const db = firebase.firestore();
    const friendListCollection = new FriendListCollection();
    const peopleCollection = new PeopleCollection();
    const friendListRef = db.collection(friendListCollection.getName()).doc(currentUserId);
    const peopleRef = friendListRef.collection(peopleCollection.getName()).doc(peopleId);
    const docSnapshot = await peopleRef.get();
    
    if(docSnapshot.exists) 
      return Promise.resolve(true) 
    else 
      return Promise.resolve(false)
  }

}