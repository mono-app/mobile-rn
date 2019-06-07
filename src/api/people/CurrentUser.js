import SInfo from "react-native-sensitive-info";
import firebase from "react-native-firebase";
import moment from "moment";

import { Document } from "src/api/database/document";
import { UserCollection } from "Src/api/database/collection";

export default class CurrentUser{
  static changeListener = null;

  static getCreationTime(){ return SInfo.getItem("creationTime", {}).then(creationTime => Promise.resolve(moment(creationTime * 1000))); }
  static getCurrentUserEmail(){ return SInfo.getItem("currentUserEmail", {}) }

  static getApplicationInformation(){
    return SInfo.getItem("applicationInformation", {}).then(jsonData => {
      const applicationInformation = JSON.parse(jsonData);
      if(applicationInformation.profilePicture){
        if(applicationInformation.profilePicture.downloadUrl) applicationInformation.profilePicture = applicationInformation.profilePicture.downloadUrl;
      }else applicationInformation.profilePicture = null;
      return Promise.resolve(applicationInformation);
    })
  }

  static getPersonalInformation(){
    return SInfo.getItem("personalInformation", {}).then(jsonData => {
      const personalInformation = JSON.parse(jsonData);
      return Promise.resolve(personalInformation);
    })
  }

  static async getDetail(){
    const applicationInformation = await CurrentUser.getApplicationInformation();
    const personalInformation = await CurrentUser.getPersonalInformation();
    const currentUserEmail = await CurrentUser.getCurrentUserEmail();
    const creationTime = await CurrentUser.getCreationTime();
    return Promise.resolve({ id: currentUserEmail, applicationInformation, personalInformation, creationTime });
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
      SInfo.setItem("applicationInformation", JSON.stringify(userData.applicationInformation), {}),
      SInfo.setItem("personalInformation", JSON.stringify(userData.personalInformation), {})
    ]
    return Promise.all(promises);
  }

  static clear(){
    const promises = [
      SInfo.deleteItem("currentUserEmail", {}),
      SInfo.deleteItem("creationTime", {}),
      SInfo.deleteItem("applicationInformation", {}),
      SInfo.deleteItem("personalInformation", {})
    ]
    return Promise.all(promises);
  }

  static async listenChanges(){
    if(CurrentUser.changeListener !== null){
      const db = firebase.firestore();
      const currentUserEmail = await CurrentUser.getCurrentUserEmail();
      const userCollection = new UserCollection();
      const userDocument = new Document(currentUserEmail);
      const userRef = db.collection(userCollection.getName()).doc(userDocument.getId());
      CurrentUseAPI.changeListener = userRef.onSnapshot({ includeMetadataChanges: true }, documentSnapshot => {
        const userData = documentSnapshot.data();
        if(userData.applicationInformation.profilePicture){
          userData.applicationInformation.profilePicture = userData.applicationInformation.profilePicture.downloadUrl;
        }
        CurrentUser.storeBasicInformation(userData);
      })
    }
  }

}