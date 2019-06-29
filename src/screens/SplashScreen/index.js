import React from "react";
import firebase from "react-native-firebase";
import { View, ActivityIndicator } from "react-native";
import { StackActions } from "react-navigation";

import PeopleAPI from "src/api/people";
import Navigator from "src/api/navigator";

export default class SplashScreen extends React.Component{
  static navigationOptions = { header: null };
  
  constructor(props){
    super(props);
    this.notificationListener = null;
  }

  async componentDidMount(){
    // handle notification
    try{
      const isNotificationEnabled = await firebase.messaging().hasPermission();
      if(!isNotificationEnabled) await firebase.messaging().requestPermission();

      // Creating notification channel for Android
      const channel = new firebase.notifications.Android.Channel('message-notification', 'Message Notification', firebase.notifications.Android.Importance.Default)
      firebase.notifications().android.createChannel(channel);

    }catch(err){ console.log("User reject notification", err); }

    const firebaseUser = firebase.auth().currentUser;
    const navigator = new Navigator(this.props.navigation);
    if(firebaseUser !== null){
      new PeopleAPI().handleSignedIn(firebaseUser.email, navigator);
    }else{
      navigator.resetTo("SignIn", StackActions);
    }
  }

  render(){
    return(
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <ActivityIndicator size="large" animating={true} color="#0EAD69"/>
      </View>
    )
  }
}