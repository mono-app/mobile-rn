import React from "react";
// import SInfo from "react-native-sensitive-info";
import firebase from "react-native-firebase";
// import moment from "moment";
// import uuid from "uuid/v4";

import NavigatorAPI from "src/api/navigator";
// import PeopleAPI from "src/api/people";
import Logger from "src/api/logger";
// import { Document } from "src/api/database/document";
import { UserCollection } from "src/api/database/collection";

const CurrentUserContext = React.createContext();
export function withCurrentUser(Component){
  const WrapperComponent = React.forwardRef((props, ref) => {
    return (
      <CurrentUserContext.Consumer>
        {(context) => <Component {...props} ref={ref}
          currentUser={context.currentUser}
          setCurrentUserEmail={context.setCurrentUserEmail} />}
      </CurrentUserContext.Consumer>
    )
  })
  return WrapperComponent;
}

export class CurrentUserProvider extends React.Component{
  constructor(props){
    super(props);
    this.state = { user: {}, setCurrentUserEmail: this.handleCurrentUserEmail }

    this.handleCurrentUserEmail = this.handleCurrentUserEmail.bind(this);
  }

  handleCurrentUserEmail = async (email, navigation) => {
    const newUser = { email };
    this.setState({ user: newUser });

    const db = firebase.firestore();
    const userCollection = new UserCollection();
    const userRef = db.collection(userCollection.getName()).doc(email); 
    userRef.onSnapshot((documentSnapshot) => {
      if(documentSnapshot.exists){
        const userData = documentSnapshot.data();
        userData.email = JSON.parse(JSON.stringify(documentSnapshot.id));
        if(userData.profilePicture !== undefined){
          userData.profilePicture = JSON.parse(JSON.stringify(userData.profilePicture.downloadUrl));
        }else userData.profilePicture = "https://picsum.photos/200/200/?random";

        this.setState({ user: userData });
        Logger.log(userData);
  
        const navigator = new NavigatorAPI(navigation);
        if(userData.isCompleteSetup) navigator.resetTo("MainTabNavigator")
        else if(!userData.isCompleteSetup) navigator.resetTo("AccountSetup")
      }
    })
  }

  render(){
    return (
      <CurrentUserContext.Provider value={this.state}>
        {this.props.children}
      </CurrentUserContext.Provider>
    )
  }
}



























// export default class CurrentUserAPI{
//   static changeListener = null;
//   static triggers = {};

//   static isCompleteSetup(){ return SInfo.getItem("isCompleteSetup", {}).then(isCompleteSetup => Promise.resolve(JSON.parse(isCompleteSetup)))}
//   static getCreationTime(){ return SInfo.getItem("creationTime", {}).then(creationTime => Promise.resolve(moment(creationTime * 1000))); }
//   static getCurrentUserEmail(){ return SInfo.getItem("currentUserEmail", {}) }
//   static removeDataChangedTrigger(triggerId){ delete CurrentUserAPI.triggers[triggerId] }
//   static addDataChangedTrigger(triggerFunction){
//     const triggerId = uuid();
//     CurrentUserAPI.triggers[triggerId] = { triggerFunction };
//     return triggerId;
//   }

//   static getApplicationInformation(){
//     return SInfo.getItem("applicationInformation", {}).then(jsonData => {
//       const applicationInformation = JSON.parse(jsonData);
//       if(applicationInformation.profilePicture){
//         if(applicationInformation.profilePicture.downloadUrl) applicationInformation.profilePicture = applicationInformation.profilePicture.downloadUrl;
//       }else applicationInformation.profilePicture = null;
//       return Promise.resolve(applicationInformation);
//     })
//   }

//   static getPersonalInformation(){
//     return SInfo.getItem("personalInformation", {}).then(jsonData => {
//       const personalInformation = JSON.parse(jsonData);
//       return Promise.resolve(personalInformation);
//     })
//   }

//   static async getDetail(){
//     const applicationInformation = await CurrentUserAPI.getApplicationInformation();
//     const personalInformation = await CurrentUserAPI.getPersonalInformation();
//     const currentUserEmail = await CurrentUserAPI.getCurrentUserEmail();
//     const creationTime = await CurrentUserAPI.getCreationTime();
//     const isCompleteSetup = await CurrentUserAPI.isCompleteSetup();
//     return Promise.resolve({ id: currentUserEmail, applicationInformation, personalInformation, creationTime, isCompleteSetup });
//   }

//   /**
//    * 
//    * @param {Object} userData - review to firebase firestore collection users data structure
//    *                            for the profilePicture, since the data is set from `PeopleAPI.getDetail()`, 
//    *                            there is no need to get the `downloadUrl` again.
//    */
//   static async storeBasicInformation(userData){
//     // Generate token for FCM
//     const messagingToken = await firebase.iid().getToken();
//     await PeopleAPI.storeMessagingToken(userData.id, messagingToken);

//     const promises = [
//       SInfo.setItem("currentUserEmail", userData.id, {}),
//       SInfo.setItem("creationTime", `${userData.creationTime}`, {}),
//       SInfo.setItem("isCompleteSetup", JSON.stringify(userData.isCompleteSetup), {}),
//       SInfo.setItem("applicationInformation", JSON.stringify(userData.applicationInformation), {}),
//       SInfo.setItem("personalInformation", JSON.stringify(userData.personalInformation), {})
//     ]
//     return Promise.all(promises);
//   }

//   static clear(){
//     const promises = [
//       SInfo.deleteItem("currentUserEmail", {}),
//       SInfo.deleteItem("creationTime", {}),
//       SInfo.deleteItem("isCompleteSetup", {}),
//       SInfo.deleteItem("applicationInformation", {}),
//       SInfo.deleteItem("personalInformation", {})
//     ]
//     return Promise.all(promises);
//   }

//   static async listenChanges(){
//     if(CurrentUserAPI.changeListener === null){
//       const db = firebase.firestore();
//       const currentUserEmail = await CurrentUserAPI.getCurrentUserEmail();
//       const userCollection = new UserCollection();
//       const userDocument = new Document(currentUserEmail);
//       const userRef = db.collection(userCollection.getName()).doc(userDocument.getId());
//       CurrentUserAPI.changeListener = userRef.onSnapshot({ includeMetadataChanges: true }, documentSnapshot => {
//         const userData = documentSnapshot.data();
//         if(userData.applicationInformation.profilePicture){
//           userData.applicationInformation.profilePicture = userData.applicationInformation.profilePicture.downloadUrl;
//         }
//         CurrentUserAPI.storeBasicInformation(userData);

//         // trigger to the listeners
//         Object.keys(CurrentUserAPI.triggers).map(triggerId => {
//           CurrentUserAPI.triggers[triggerId].triggerFunction();
//         })
//       })
//     }
//   }

// }