import React from "react";
<<<<<<< Updated upstream
import firebase from "react-native-firebase";
=======
import firebase from "react-native-firebase"
>>>>>>> Stashed changes
import AuthenticationAPI from "src/api/authentication";
import NotificationAPI from "src/api/notification";
import NavigatorAPI from "src/api/navigator";
import { View, ActivityIndicator } from "react-native";
import { withCurrentUser } from "src/api/people/CurrentUser"

function SplashScreen(props){
  const { navigation } = props;

  const goto = (routeName) => {
    const navigator = new NavigatorAPI(navigation);
    navigator.resetTo(routeName);
  }

  const redirect = async () => {
    try{
      // await firebase.auth().signOut();
      await AuthenticationAPI.initializeSession();
      props.setCurrentUserId(firebase.auth().currentUser.uid)
      goto("MainTabNavigator");
    }catch(err){
      if(err.code === "auth/need-setup") goto("AccountSetup");
      else if(err.code === "auth/not-found") goto("SignIn");
      else throw err;
    }
  }

  React.useEffect(() => {
    NotificationAPI.initialize();
    redirect();
  }, [])

  return(
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      <ActivityIndicator size="large" animating={true} color="#0EAD69"/>
    </View>
  )
}

export default withCurrentUser(SplashScreen);