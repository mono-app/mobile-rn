import React from "react";
import Logger from "src/api/logger";
import firebase from "react-native-firebase";
import { AppState } from "react-native";
import { withCurrentUser } from "src/api/people/CurrentUser";

import NotificationPopup from "react-native-push-notification-popup";
import Logo from "assets/logo.png";

function FriendRequest(props){
  const { currentUser } = props;
  const [ currentAppState, setCurrentAppState ] = React.useState("active");
  const isFirstTime = React.useRef(true);
  const popup = React.useRef(null);
  const friendRequestListener = React.useRef(null);
  const stateListener = React.useRef((nextAppState) => setCurrentAppState(nextAppState));

  const showNotification = () => {
    Logger.log("FriendRequest.showNotification#currentAppState", currentAppState);
    Logger.log("FriendRequest.showNotification#isFirstTime", isFirstTime.current);
    Logger.log("FriendRequest.showNotification#currentUser", currentUser.email);
    if(currentAppState === "active" && currentUser.email !== undefined){
      Logger.log("FriendRequest.showNotification#currentUser", currentUser.email);
      const db = firebase.firestore();
      const friendRequestRef = db.collection("friendRequest").doc(currentUser.email).collection("people");
      friendRequestListener.current = friendRequestRef.onSnapshot((querySnapshot) => {
        let notificationBody = null;
        if(querySnapshot.size === 1) notificationBody = "Frans Huang mengirimkan permintaan pertemanan. Lihat sekarang!";
        else if(querySnapshot.size > 1) notificationBody = `Kamu memiliki ${querySnapshot.size} perminataan pertemanan. Lihat sekarang!`;

        Logger.log("FriendRequest.showNotification", !isFirstTime.current)
        if(popup.current !== undefined && querySnapshot.size > 0 && !isFirstTime.current){
          Logger.log("FriendRequest.showNotification#popup", popup.current);
          popup.current.show({
            onPress: () => console.log("Pressed"), slideOutTime: 5000,
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
  }, [currentUser.email]);

  Logger.log("FriendRequest#isFirstTime", isFirstTime.current);
  return  <NotificationPopup ref={popup}/>
}
export default withCurrentUser(FriendRequest);