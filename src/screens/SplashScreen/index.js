import React from "react";
// import firebase from "react-native-firebase"
import AuthenticationAPI from "src/api/authentication";
import NotificationAPI from "src/api/notification";
import NavigatorAPI from "src/api/navigator";
import { View, ActivityIndicator } from "react-native";

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

export default SplashScreen;