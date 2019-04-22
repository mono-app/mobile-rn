import firebase from "react-native-firebase";

import { FriendRequestCollection, FriendListCollection } from "../database/collection";
import { GetDocument, RemoveDocumentField, AddDocument } from "../database/query";
import { Document } from "../database/document";
import { DocumentListener } from "../database/listener";

export default class FriendsAPI{

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
   * @param {string} peopleEmail - email address of the people. 
   * @returns {Promise} - return a list of friends in the `peopleEmail` friend requests list.
   */
  getRequestList(peopleEmail){
    const friendRequestCollection = new FriendRequestCollection();
    const userDocument = new Document(peopleEmail);
    const getFriendRequestQuery = new GetDocument();
    getFriendRequestQuery.setGetConfiguration("default");
    return getFriendRequestQuery.executeQuery(friendRequestCollection, userDocument).then(doc => {
      if(doc.exists) return doc.data().friends;
      return [];
    });
  }

  /**
   * 
   * @param {string} peopleEmail - the one that rejecting
   * @param {string} friendEmail - the one that being rejected
   */
  rejectRequest(peopleEmail, friendEmail){
    const friendRequestCollection = new FriendRequestCollection();
    const userDocument = new Document(peopleEmail);
    const removeQuery = new RemoveDocumentField();
    return removeQuery.executeQuery(friendRequestCollection, userDocument, {
      friends: firebase.firestore.FieldValue.arrayRemove(friendEmail)
    }).then(() => {
      return true
    }).catch(err => {
      console.log(err);
      return false
    })
  }

  /**
   * 
   * @param {string} peopleEmail - the one that accepting
   * @param {string} friendEmail - the one that being accepted
   */
  acceptRequest(peopleEmail, friendEmail){
    const friendRequestCollection = new FriendRequestCollection();
    const friendListCollection = new FriendListCollection();
    const userDocument = new Document(peopleEmail);
    const friendDocument = new Document(friendEmail);
    const removeQuery = new RemoveDocumentField();
    const addQuery = new AddDocument();

    return Promise.all([
      removeQuery.executeQuery(friendRequestCollection, userDocument, {
        friends: firebase.firestore.FieldValue.arrayRemove(friendEmail)
      }),
      addQuery.executeQuery(friendListCollection, userDocument, {
        friends: firebase.firestore.FieldValue.arrayUnion(friendEmail)
      }, { merge: true }),
      addQuery.executeQuery(friendListCollection, friendDocument, {
        friends: firebase.firestore.FieldValue.arrayUnion(peopleEmail)
      }, { merge: true })
    ]).then(results => {
      return true;
    }).catch(err => {
      console.log(err);
      return false;
    })
  }

  /**
   * 
   * @param {string} peopleEmail - the one that cancelling
   * @param {string} friendEmail - the one that being cancelled
   */
  cancelRequest(peopleEmail, friendEmail){
    const friendRequestCollection = new FriendRequestCollection();
    const friendDocument = new Document(friendEmail);
    const removeQuery = new RemoveDocumentField();
    console.log(peopleEmail, friendEmail);
    return removeQuery.executeQuery(friendRequestCollection, friendDocument, {
      friends: firebase.firestore.FieldValue.arrayRemove(peopleEmail)
    }).then(results => {
      return true;
    }).catch(err => {
      console.log(err);
      return false;
    })
  }

  /**
   * 
   * @param {string} peopleEmail - the one that adding
   * @param {string} friendEmail - the one that being added
   */
  sendRequest(peopleEmail, friendEmail){
    const friendRequestCollection = new FriendRequestCollection();
    const friendDocument = new Document(friendEmail);
    const addQuery = new AddDocument();
    return addQuery.executeQuery(friendRequestCollection, friendDocument, {
      friends: firebase.firestore.FieldValue.arrayUnion(peopleEmail)
    }, { merge: true }).then(results => {
      return true;
    }).catch(err => {
      console.log(err);
      return false;
    })
  }
}