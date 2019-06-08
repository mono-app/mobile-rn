import firebase from "react-native-firebase";

import { FriendRequestCollection, FriendListCollection, PeopleCollection } from "src/api/database/collection";
import { GetDocument } from "src/api/database/query";
import { Document } from "src/api/database/document";
import { DocumentListener } from "src/api/database/listener";

export default class FriendsAPI{

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
    if(peopleDocumentSnapshot.exists) return Promise.resolve("friend");
    else{
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
        else return Promise.resolve("stranger");
      }
    }
  }

  /**
   * 
   * @param {String} peopleEmail 
   */
  static getFriends(peopleEmail){
    const friendListCollection = new FriendListCollection();
    const userDocument = new Document(peopleEmail);
    const getQuery = new GetDocument();

    getQuery.setGetConfiguration("default");
    return getQuery.executeQuery(friendListCollection, userDocument).then(documentSnapshot => {
      if(!documentSnapshot.exists) return [];
      else return documentSnapshot.data().friends;
    });
  }

  /**
   * Get all the friends in the list with real time update
   * 
   * @param {string} peopleEmail 
   * @param {function} callback - a callback function that accepts array of friends as its parameters
   * @returns {function} - unsubscribe function from the listener
   */
  getFriendsWithRealTimeUpdate(peopleEmail, callback){
    const friendListCollection = new FriendListCollection();
    const userDocument = new Document(peopleEmail);
    const listener = new DocumentListener();
    return listener.listen(friendListCollection, userDocument, doc => {
      if(doc.exists) callback(doc.data().friends);
      else callback([]);
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
    const friendRequestCollection = new FriendRequestCollection();
    const peopleCollection = new PeopleCollection();
    const userDocument = new Document(peopleEmail);
    const friendRequestRef = db.collection(friendRequestCollection.getName()).doc(userDocument.getId());
    const peopleRef = friendRequestRef.collection(peopleCollection.getName());
    return peopleRef.onSnapshot({ includeMetadataChanges: true }, querySnapshot => {
      callback(querySnapshot);
    })
  }

  // /**
  //  * 
  //  * @param {string} peopleEmail - email address of the people. 
  //  * @returns {Promise} - return a list of friends in the `peopleEmail` friend requests list.
  //  */
  // getRequestList(peopleEmail){
  //   const friendRequestCollection = new FriendRequestCollection();
  //   const userDocument = new Document(peopleEmail);
  //   const getFriendRequestQuery = new GetDocument();
  //   getFriendRequestQuery.setGetConfiguration("default");
  //   return getFriendRequestQuery.executeQuery(friendRequestCollection, userDocument).then(doc => {
  //     if(doc.exists) return doc.data().friends;
  //     return [];
  //   });
  // }

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
      const batch = db.batch();
      const friendListCollection = new FriendListCollection();
      const peopleCollection = new PeopleCollection();
      const userDocument = new Document(peopleEmail);
      const peopleDocument = new Document(friendEmail);
      const userFriendListRef = db.collection(friendListCollection.getName()).doc(userDocument.getId());
      const peopleFriendListRef = db.collection(friendListCollection.getName()).doc(peopleDocument.getId());
      const userPeopleRef = userFriendListRef.collection(peopleCollection.getName()).doc(peopleDocument.getId());
      const peoplePeopleRef = peopleFriendListRef.collection(peopleCollection.getName()).doc(userDocument.getId());
      
      batch.set(userPeopleRef, { creationTime: firebase.firestore.FieldValue.serverTimestamp(), source });
      batch.set(peoplePeopleRef, { creationTime: firebase.firestore.FieldValue.serverTimestamp(), source });
      batch.update(userFriendListRef, { totalFriends: firebase.firestore.FieldValue.increment(1) });
      batch.update(peopleFriendListRef, { totalFriends: firebase.firestore.FieldValue.increment(1) });

      await Promise.all(batch.commit(), this.cancelRequest(friendEmail, peopleEmail));
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
}