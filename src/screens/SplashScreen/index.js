import React from "react";
import firebase from "react-native-firebase";
import { View, ActivityIndicator } from "react-native";
import { StackActions, NavigationActions} from "react-navigation";
import NavigatorAPI from "src/api/navigator";
import { withCurrentUser } from "src/api/people/CurrentUser";
import PeopleAPI from "src/api/people"

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
        firebase.notifications().android.createChannel(new firebase.notifications.Android.Channel('discussion-notification', 'Discussion Notification', firebase.notifications.Android.Importance.Default));
        firebase.notifications().android.createChannel(new firebase.notifications.Android.Channel('friendrequest-notification', 'Friend Request Notification', firebase.notifications.Android.Importance.Default));

      }catch(err){ console.log("User reject notification", err); }

      const firebaseUser = firebase.auth().currentUser;
      if(firebaseUser !== null) {
        props.setCurrentUserEmail(firebaseUser.email, props.navigation);
        const fcmToken = await firebase.messaging().getToken();
        if (fcmToken) {
            await PeopleAPI.storeMessagingToken(firebaseUser.email,fcmToken)
        }
      }
      else {
        props.navigation.dispatch(StackActions.reset({
          index: 0, actions: [ NavigationActions.navigate({ routeName: "SignIn" }) ],
          key: null
        }))
      }
    }
    init();
  }, []);

  // assuming user is signed in, then navigate to MainTabNavigator or AccountSetup
  // withCurrentUser will fetch user data, and useEffect will be triggered if props.currentUser.isCompleteSetup change
  React.useEffect(() => {

    if(props.isLoggedIn) {

      if(props.currentUser.phoneNumber !== undefined && props.currentUser.isCompleteSetup !== undefined){

        let routeNameForReset = "MainTabNavigator";
        if(props.currentUser.phoneNumber && props.currentUser.phoneNumber.isVerified){
          
          if(props.currentUser.isCompleteSetup){
            routeNameForReset = "MainTabNavigator"
          } else {
            routeNameForReset = "AccountSetup"
          }

          const navigator = new NavigatorAPI(props.navigation);
          navigator.resetTo(routeNameForReset);  
        }else{
          firebase.auth().signOut();
          props.navigation.dispatch(StackActions.reset({
            index: 0, actions: [ NavigationActions.navigate({ routeName: "SignIn" }) ],
            key: null
          }))
        }
      }
    }

  }, [props.currentUser.isCompleteSetup, props.isLoggedIn])

  return(
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      <ActivityIndicator size="large" animating={true} color="#0EAD69"/>
    </View>
  )
}

export default withCurrentUser(SplashScreen);