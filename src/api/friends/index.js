import firebase from "react-native-firebase";
import Logger from "src/api/logger";
import PeopleAPI from "src/api/people";
import { FriendRequestCollection, FriendListCollection, PeopleCollection, UserCollection, BlockedCollection, HideCollection } from "src/api/database/collection";
import { Document } from "src/api/database/document";

export default class FriendsAPI{

  static normalizeFriend(documentSnapshot){
    return { email: documentSnapshot.id, ...documentSnapshot.data() }
  }

  async getFriendStatus(userEmail, friendEmail){
    const db = firebase.firestore();
    const friendListCollection = new FriendListCollection();
    const peopleCollection = new PeopleCollection();
    const userDocument = new Document(userEmail);
    const peopleDocument = new Document(friendEmail);
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
          const blockedDocRef = friendListRef.collection(blockedCollection.getName()).doc(friendEmail)
          const blockedSnapshot = await blockedDocRef.get()
          if(blockedSnapshot.exists){
            return Promise.resolve("blocked");
          }else{
            const hideCollection = new HideCollection()
            const hideDocRef = friendListRef.collection(hideCollection.getName()).doc(friendEmail)
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
   * @param {String} peopleEmail 
   */
  static async getFriends(peopleEmail){
    const db = firebase.firestore();
    const friendListCollection = new FriendListCollection();
    const peopleCollection = new PeopleCollection();
    const userCollection = new UserCollection();
    const userDocument = new Document(peopleEmail);
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
   * @param {string} peopleEmail 
   * @param {function} callback - a callback function that accepts array of friends as its parameters
   * @returns {function} - unsubscribe function from the listener
   */
  static getFriendsWithRealTimeUpdate(peopleEmail, callback){
    const db = firebase.firestore();
    const userCollection = new UserCollection();
    const friendListCollection = new FriendListCollection();
    const peopleCollection = new PeopleCollection();
    const userDocument = new Document(peopleEmail);
    const friendListRef = db.collection(friendListCollection.getName()).doc(userDocument.getId());
    const peopleRef = friendListRef.collection(peopleCollection.getName());
    return peopleRef.onSnapshot(async (querySnapshot) => {
    
      if(!querySnapshot.empty) {
        const friendList = querySnapshot.docs
        const filteredFriendList = friendList.filter(documentSnapshot => {
          const data = documentSnapshot.data()

          return (!data.status || (data.status && data.status !== "blocked" &&  data.status !== "hide"))
        })

        const promises = filteredFriendList.map((documentSnapshot) => {
          const userDocument = new Document(documentSnapshot.id);
          const userRef = db.collection(userCollection.getName()).doc(userDocument.getId());
          return userRef.get();
        })
        const friends = await Promise.all(promises);


        const normalizedFriends = friends.map((documentSnapshot) => {
          return PeopleAPI.normalizePeople(documentSnapshot);
        });
        Logger.log("FriendsAPI.getFriendsWithRealTimeUpdate", (friends, normalizedFriends));

        callback(normalizedFriends)
      }else callback([]);
    })
  }

  /**
   * 
   * @param {String} peopleEmail 
   * @param {function} callback - return QuerySnapshot
   * @returns {function} - use the return value to unsubscribe.
   */
  static getFriendRequestWithRealTimeUpdate(peopleEmail, callback){
    const db = firebase.firestore();
    const userCollection = new UserCollection();
    const friendRequestCollection = new FriendRequestCollection();
    const peopleCollection = new PeopleCollection();
    const userDocument = new Document(peopleEmail);
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
   * @param {string} peopleEmail - the one that rejecting
   * @param {string} friendEmail - the one that being rejected
   */
  async rejectRequest(peopleEmail, friendEmail){
    const result = await this.cancelRequest(friendEmail, peopleEmail)
    return Promise.resolve(result);
  }

  /**
   * 
   * @param {string} peopleEmail - the one that accepting
   * @param {string} friendEmail - the one that being accepted
   * @param {Object} source - where do you get the contact? { id: <string>, value: <string> }
   */
  async acceptRequest(peopleEmail, friendEmail, source){
   
    try{
      const db = firebase.firestore();
      const friendListCollection = new FriendListCollection();
      const peopleCollection = new PeopleCollection();
      const userDocument = new Document(peopleEmail);
      const peopleDocument = new Document(friendEmail);
      const userFriendListRef = db.collection(friendListCollection.getName()).doc(userDocument.getId());
      const peopleFriendListRef = db.collection(friendListCollection.getName()).doc(peopleDocument.getId());
      const userPeopleRef = userFriendListRef.collection(peopleCollection.getName()).doc(peopleDocument.getId());
      const peoplePeopleRef = peopleFriendListRef.collection(peopleCollection.getName()).doc(userDocument.getId());
      
      
      const promises = [ 
        userPeopleRef.set({ creationTime: firebase.firestore.FieldValue.serverTimestamp(), source }),
        peoplePeopleRef.set({ creationTime: firebase.firestore.FieldValue.serverTimestamp(), source })
      ];

      promises.push(this.cancelRequest(friendEmail, peopleEmail))

      await Promise.all(promises);
      return Promise.resolve(true);
    }catch(err){
      console.log(err);
      return Promise.resolve(false);
    }
  }

  async setFriends(peopleEmail, friendEmail, source){
    // used for add new friend from barcode scan (auto become friend without friendRequest)
    try{
      const db = firebase.firestore();
      const friendListCollection = new FriendListCollection();
      const peopleCollection = new PeopleCollection();
      const userDocument = new Document(peopleEmail);
      const peopleDocument = new Document(friendEmail);


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
   * @param {string} peopleEmail - the one that cancelling
   * @param {string} friendEmail - the one that being cancelled
   */
  async cancelRequest(peopleEmail, friendEmail){
    try{
      const db = firebase.firestore();
      const friendRequestCollection = new FriendRequestCollection();
      const peopleCollection = new PeopleCollection();
      const userDocument = new Document(peopleEmail);
      const peopleDocument = new Document(friendEmail);
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
   * @param {string} peopleEmail - the one that adding
   * @param {string} friendEmail - the one that being added
   * @param {Object} source - where do you get the contact? { id: <string>, value: <string> }
   */
  async sendRequest(peopleEmail, friendEmail, source){
    try{
      const db = firebase.firestore();
      const friendRequestCollection = new FriendRequestCollection();
      const peopleCollection = new PeopleCollection();
      const friendDocument = new Document(friendEmail);
      const userDocument = new Document(peopleEmail);
      const friendRequestRef = db.collection(friendRequestCollection.getName()).doc(friendDocument.getId());
      const peopleRef = friendRequestRef.collection(peopleCollection.getName()).doc(userDocument.getId());
      await peopleRef.set({ creationTime: firebase.firestore.FieldValue.serverTimestamp(), source });
      return Promise.resolve(true);
    }catch(err){ 
      console.log(err);
      return Promise.resolve(false); 
    }
  }

  static async blockUsers(currentUserEmail, peopleEmail){
    const db = firebase.firestore();
    const friendListCollection = new FriendListCollection();
    const blockedCollection = new BlockedCollection();
    const friendListDocRef = db.collection(friendListCollection.getName()).doc(currentUserEmail);
    const blockedDocRef = friendListDocRef.collection(blockedCollection.getName()).doc(peopleEmail)
    const blockedSnapshot = await blockedDocRef.get()
    if(!blockedSnapshot.exists){
      await blockedDocRef.set({creationTime: firebase.firestore.FieldValue.serverTimestamp()})
    }
    //update status friendList
    const peopleCollection = new PeopleCollection();

    const peopleDocRef = friendListDocRef.collection(peopleCollection.getName()).doc(peopleEmail)

    const peopleSnapshot = await peopleDocRef.get()

    if(peopleSnapshot.exists){
      await peopleDocRef.update({status: "blocked"})
    }

    return Promise.resolve(true)
  }

  static async unblockUsers(currentUserEmail, peopleEmail){
    const db = firebase.firestore();
    const friendListCollection = new FriendListCollection();
    const blockedCollection = new BlockedCollection();
    const friendListDocRef = db.collection(friendListCollection.getName()).doc(currentUserEmail);
    const blockedDocRef = friendListDocRef.collection(blockedCollection.getName()).doc(peopleEmail)
    const blockedSnapshot = await blockedDocRef.get()
    if(blockedSnapshot.exists){
      await blockedDocRef.delete()
    }

    //update status friendList
    const peopleCollection = new PeopleCollection();

    const peopleDocRef = friendListDocRef.collection(peopleCollection.getName()).doc(peopleEmail)

    const peopleSnapshot = await peopleDocRef.get()
  
    if(peopleSnapshot.exists){
      await peopleDocRef.update({status: "friend"})
    }

    return Promise.resolve(true)
  }

  static async hideUsers(currentUserEmail, peopleEmail){
    const db = firebase.firestore();
    const friendListCollection = new FriendListCollection();
    const hideCollection = new HideCollection();
    const friendListDocRef = db.collection(friendListCollection.getName()).doc(currentUserEmail);
    const hideDocRef = friendListDocRef.collection(hideCollection.getName()).doc(peopleEmail)
    const hideSnapshot = await hideDocRef.get()
    if(!hideSnapshot.exists){
      await hideDocRef.set({creationTime: firebase.firestore.FieldValue.serverTimestamp()})
    }

    //update status friendList
    const peopleCollection = new PeopleCollection();

    const peopleDocRef = friendListDocRef.collection(peopleCollection.getName()).doc(peopleEmail)

    const peopleSnapshot = await peopleDocRef.get()

    if(peopleSnapshot.exists){
      await peopleDocRef.update({status: "hide"})
    }

    return Promise.resolve(true)
  }

  static async unhideUsers(currentUserEmail, peopleEmail){
    const db = firebase.firestore();
    const friendListCollection = new FriendListCollection();
    const hideCollection = new HideCollection();
    const friendListDocRef = db.collection(friendListCollection.getName()).doc(currentUserEmail);
    const hideDocRef = friendListDocRef.collection(hideCollection.getName()).doc(peopleEmail)
    const hideSnapshot = await hideDocRef.get()
    if(hideSnapshot.exists){
      await hideDocRef.delete()
    }
    //update status friendList
    const peopleCollection = new PeopleCollection();

    const peopleDocRef = friendListDocRef.collection(peopleCollection.getName()).doc(peopleEmail)

    const peopleSnapshot = await peopleDocRef.get()
  
    if(peopleSnapshot.exists){
      await peopleDocRef.update({status: "friend"})
    }

    return Promise.resolve(true)
  }

}