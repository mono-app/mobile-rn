import React from "react";
import firebase from "react-native-firebase";
import { View, ActivityIndicator } from "react-native";
import { StackActions } from "react-navigation";

import Navigator from "src/api/navigator";
import { withCurrentUser } from "src/api/people/CurrentUser";

function SplashScreen(props){
  React.useEffect(() => {
    const init = async () => {
      // handle notification
      try{
        const isNotificationEnabled = await firebase.messaging().hasPermission();
        if(!isNotificationEnabled) await firebase.messaging().requestPermission();

        // Creating notification channel for Android
        const channel = new firebase.notifications.Android.Channel('message-notification', 'Message Notification', firebase.notifications.Android.Importance.Default)
        firebase.notifications().android.createChannel(channel);

      }catch(err){ console.log("User reject notification", err); }

      const firebaseUser = firebase.auth().currentUser;
      const navigator = new Navigator(props.navigation);
      if(firebaseUser !== null){
        props.setCurrentUserEmail(firebaseUser.email, props.navigation);
      }else{
        navigator.resetTo("SignIn", StackActions);
      }
    }
    init();
  }, [])

  return(
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      <ActivityIndicator size="large" animating={true} color="#0EAD69"/>
    </View>
  )
}

export default withCurrentUser(SplashScreen);