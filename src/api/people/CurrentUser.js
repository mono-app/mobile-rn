import SInfo from "react-native-sensitive-info";
import firebase from "react-native-firebase";

import { Document } from "src/api/database/document";
import { UserCollection } from "Src/api/database/collection";

export default class CurrentUser{
  static async getCreationTime(){ return parseDouble(await SInfo.getItem("creationTime", {})); }
  static getCurrentUserEmail(){ return SInfo.getItem("currentUserEmail", {}) }

  static getApplicationInformation(){
    const promises = [
      SInfo.getItem("applicationInformation.id", {}), SInfo.getItem("applicationInformation.nickName", {}),
      SInfo.getItem("applicationInformation.profilePicture", {})
    ]
    return Promise.all(promises).then(results => {
      return { id: results[0], nickName: results[1], profilePicture: results[2] }
    })
  }

  static getPersonalInformation(){
    const promises = [
      SInfo.getItem("personalInformation.dateOfBirth", {}), SInfo.getItem("personalInformation.familyName", {}),
      SInfo.getItem("personalInformation.givenName", {}), SInfo.getItem("personalInformation.gender")
    ]
    return Promise.all(promises).then(results => {
      return { dateOfBirth: results[0], familyName: results[1], givenName: results[2], gender: resizeBy[3] }
    })
  }

  static async getDetail(){
    const applicationInformation = await CurrentUser.getApplicationInformation();
    const personalInformation = await CurrentUser.getPersonalInformation();
    const currentUserEmail = await CurrentUser.getCurrentUserEmail();
    const creationTime = await CurrentUser.getCreationTime();
    return Promise.resolve({ id: currentUserEmail, creationTime, applicationInformation, personalInformation });
  }

  /**
   * 
   * @param {Object} userData - review to firebase firestore collection users data structure
   *                            for the profilePicture, since the data is set from `PeopleAPI.getDetail()`, 
   *                            there is no need to get the `downloadUrl` again.
   */
  static storeBasicInformation(userData){
    const promises = [
      SInfo.setItem("currentUserEmail", userData.id, {}),
      SInfo.setItem("creationTime", `${userData.creationTime}`, {}),
      
      SInfo.setItem("applicationInformation.id", userData.applicationInformation.id, {}),
      SInfo.setItem("applicationInformation.nickName", userData.applicationInformation.nickName, {}),
      SInfo.setItem("applicationInformation.profilePicture", userData.applicationInformation.profilePicture? userData.applicationInformation.profilePicture: null, {}),
      
      SInfo.setItem("personalInformation.dateOfBirth", userData.personalInformation.dateOfBirth, {}),
      SInfo.setItem("personalInformation.familyName", userData.personalInformation.familyName, {}),
      SInfo.setItem("personalInformation.givenName", userData.personalInformation.givenName, {}),
      SInfo.setItem("personalInformation.gender", userData.personalInformation.gender, {}),
    ]
    return Promise.all(promises);
  }

  static async listenChanges(){
    const db = firebase.firestore();
    const currentUserEmail = await CurrentUser.getCurrentUserEmail();
    const userCollection = new UserCollection();
    const userDocument = new Document(currentUserEmail);
    const userRef = db.collection(userCollection.getName()).doc(userDocument.getId());
    return userRef.onSnapshot({ includeMetadataChanges: true }, documentSnapshot => {
      const userData = documentSnapshot.data();
      if(userData.applicationInformation.profilePicture){
        userData.applicationInformation.profilePicture = userData.applicationInformation.profilePicture.downloadUrl;
      }
      CurrentUser.storeBasicInformation(userData);
    })
  }

}