import React from "react";
import firebase from "react-native-firebase";
import PeopleAPI from "src/api/people"
import Logger from "src/api/logger";
import NavigatorAPI from "src/api/navigator";
import { StackActions, NavigationActions} from "react-navigation";
import { withCurrentUser } from "src/api/people/CurrentUser";

import { View, ActivityIndicator } from "react-native";

function SplashScreen(props){

  const initializeNotification = async () => {
    try{
      const isNotificationEnabled = await firebase.messaging().hasPermission();
      if(!isNotificationEnabled) await firebase.messaging().requestPermission();

      const channel = new firebase.notifications.Android.Channel('message-notification', 'Message Notification', firebase.notifications.Android.Importance.Max)
      firebase.notifications().android.createChannel(channel);
      firebase.notifications().android.createChannel(new firebase.notifications.Android.Channel('discussion-notification', 'Discussion Notification', firebase.notifications.Android.Importance.Max));
      firebase.notifications().android.createChannel(new firebase.notifications.Android.Channel('friendrequest-notification', 'Friend Request Notification', firebase.notifications.Android.Importance.Max));
      firebase.notifications().android.createChannel(new firebase.notifications.Android.Channel('moment-notification', 'Moment Notification', firebase.notifications.Android.Importance.Max));
    }catch(err){ Logger.log("SplashScreen.requestNotificationPermission#err", err); }

    // in the splash, if the user is not loggedIn, you need to redirect the user to SignIn
    const firebaseUser = firebase.auth().currentUser;
    if(firebaseUser) {
      props.setCurrentUserEmail(firebaseUser.email, props.navigation);
      const fcmToken = await firebase.messaging().getToken();
      if (fcmToken) await PeopleAPI.storeMessagingToken(firebaseUser.email,fcmToken)
    }else {
      props.navigation.dispatch(StackActions.reset({
        index: 0, actions: [ NavigationActions.navigate({ routeName: "SignIn" }) ],
        key: null
      }))
    }
  }

  React.useEffect(() => {
    initializeNotification();
  }, []);

  // assuming user is signed in, then navigate to MainTabNavigator or AccountSetup
  // withCurrentUser will fetch user data, and useEffect will be triggered if props.currentUser.isCompleteSetup change
  React.useEffect(() => {
    if(props.isLoggedIn){
      if(props.currentUser.isCompleteSetup !== undefined){
        const routeNameForReset = (props.currentUser.isCompleteSetup)? "MainTabNavigator": "AccountSetup";
        const navigator = new NavigatorAPI(props.navigation);
        navigator.resetTo(routeNameForReset);
      }
    }
  }, [props.currentUser.isCompleteSetup, props.isLoggedIn])

  return(
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      <ActivityIndicator size="large" animating={true} color="#0EAD69"/>
    </View>
  )
}

export default withCurrentUser(SplashScreen)