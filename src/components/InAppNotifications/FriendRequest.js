import React from "react";
import Logger from "src/api/logger";
import firebase from "react-native-firebase";
import { AppState } from "react-native";
import { withCurrentUser } from "src/api/people/CurrentUser";
import { withNavigation } from "react-navigation";

import NotificationPopup from "react-native-push-notification-popup";
import Logo from "assets/logo.png";

function FriendRequest(props){
  const { currentUser, navigation } = props;
  const [ currentAppState, setCurrentAppState ] = React.useState("active");
  const isFirstTime = React.useRef(true);
  const popup = React.useRef(null);
  const friendRequestListener = React.useRef(null);
  const stateListener = React.useRef((nextAppState) => setCurrentAppState(nextAppState));

  const handleSingleRequestPress = (requestorId, source) => {
    Logger.log("FriendRequest.handleSingleRequestPress#requestorId", requestorId);
    const params = { peopleId: requestorId, source }
    navigation.navigate({ routeName: "PeopleInformation", params, key: "HomeTabNavigator" });
  }

  const showNotification = () => {
    Logger.log("FriendRequest.showNotification#currentAppState", currentAppState);
    Logger.log("FriendRequest.showNotification#isFirstTime", isFirstTime.current);
    Logger.log("FriendRequest.showNotification#currentUser", currentUser.id);
    if(currentAppState === "active" && currentUser.id !== undefined){
      Logger.log("FriendRequest.showNotification#currentUser", currentUser.id);
      const db = firebase.firestore();
      const friendRequestRef = db.collection("friendRequest").doc(currentUser.id).collection("people");
      friendRequestListener.current = friendRequestRef.onSnapshot((querySnapshot) => {
        const newFriendRequest = [];
        querySnapshot.docChanges.forEach((change) => {
          if(change.type === "modified") newFriendRequest.push(change.doc);
        });

        Logger.log("FriendRequest.showNotification#newFriendRequest", newFriendRequest.map((documentSnapshot) => documentSnapshot.data()));

        let notificationBody = null;
        let handlePress = () => {};
        if(newFriendRequest.length === 1) {
          const requestorData = newFriendRequest[0].data();
          const requestorRef = newFriendRequest[0];
          notificationBody = `${requestorData.applicationInformation.nickName} mengirimkan permintaan pertemanan. Lihat sekarang!`;
          handlePress = () => handleSingleRequestPress(requestorRef.id, requestorData.source);
        }else if(newFriendRequest.length > 1) {
          notificationBody = `Kamu memiliki ${newFriendRequest.size} perminataan pertemanan. Lihat sekarang!`;
        }
        
        Logger.log("FriendRequest.showNotification", newFriendRequest.length);
        if(popup.current !== undefined && newFriendRequest.length > 0 && !isFirstTime.current){
          Logger.log("FriendRequest.showNotification#popup", popup.current);
          popup.current.show({
            onPress: handlePress, slideOutTime: 5000,
            appTitle: "Mono App", appIconSource: Logo, body: notificationBody,
            timeText: "Now", title: "Permintaan Teman Baru",
          })
        };
        isFirstTime.current = false;
      }, (err) => Logger.log("FriendRequest.showNotification#err", err));
    }
  }

  const hideNotification = () => {
    if(friendRequestListener.current) friendRequestListener.current();
  }

  React.useEffect(() => {
    AppState.addEventListener("change", stateListener.current);
    showNotification();
    return function cleanup(){
      AppState.removeEventListener("change", stateListener.current);
      hideNotification();
    }
  }, [currentUser.id]);

  Logger.log("FriendRequest#isFirstTime", isFirstTime.current);
  return  <NotificationPopup ref={popup}/>
}
export default withNavigation(withCurrentUser(FriendRequest));