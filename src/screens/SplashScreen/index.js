import React from "react";
import firebase from "react-native-firebase";
import AuthenticationAPI from "src/api/authentication";
import NotificationAPI from "src/api/notification";
import NavigatorAPI from "src/api/navigator";
import PeopleAPI from "src/api/people";
import MessagingToken from "src/entities/messagingToken";
import { withCurrentUser } from "src/api/people/CurrentUser"

import CustomSnackbar from "src/components/CustomSnackbar";
import { View, ActivityIndicator } from "react-native";

function SplashScreen(props){
  const { navigation } = props;
  const [ errorMessage, setErrorMessage ] = React.useState(null);

  const handleDismiss = () => setErrorMessage(null);

  const goto = (routeName) => {
    const navigator = new NavigatorAPI(navigation);
    navigator.resetTo(routeName);
  }

  const redirect = async () => {
    try{
      // await firebase.auth().signOut();
      await AuthenticationAPI.initializeSession();
      props.setCurrentUserId(firebase.auth().currentUser.uid);

      // save messaging token
      const tokenOwner = await PeopleAPI.getCurrentUser();
      const token = await NotificationAPI.generateToken();
      const messagingToken = new MessagingToken(token, tokenOwner);
      await NotificationAPI.storeToken(messagingToken);

      goto("MainTabNavigator");
    }catch(err){
      if(err.code === "auth/need-setup") goto("AccountSetup");
      else if(err.code === "auth/not-found") goto("SignIn");
      else setErrorMessage(err.message);
    }
  }

  React.useEffect(() => {
    NotificationAPI.initialize();
    redirect();
  }, [])

  return(
    <React.Fragment>
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <ActivityIndicator size="large" animating={true} color="#0EAD69"/>
      </View>

      <CustomSnackbar isError={true} message={errorMessage} onDismiss={handleDismiss}/>
    </React.Fragment>
  )
}

export default withCurrentUser(SplashScreen);