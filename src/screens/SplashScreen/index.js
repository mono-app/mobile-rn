import React from "react";
import { View, ActivityIndicator } from "react-native";
import { StackActions, NavigationEvents } from "react-navigation";
import firebase from "react-native-firebase";
import SInfo from "react-native-sensitive-info";

import Navigator from "../../api/navigator";
import { GetDocument } from "../../api/database/query";
import { UserCollection } from "../../api/database/collection";
import { Document } from "../../api/database/document";

export default class SplashScreen extends React.Component{

  handleScreenDidFocus = () => {
    const firebaseUser = firebase.auth().currentUser;
    const navigator = new Navigator(this.props.navigation);
    if(firebaseUser !== null){
      console.log(firebaseUser.email);
      SInfo.setItem("currentUserEmail", firebaseUser.email, {}).then(email => {
        const userCollection = new UserCollection();
        const userDocument = new Document(email);
        const getQuery = new GetDocument();
        getQuery.setGetConfiguration("default")
        return getQuery.executeQuery(userCollection, userDocument);
      }).then(doc => {
        if(doc.exists){
          const userData = doc.data();
          const routeNameForReset = (userData.isCompleteSetup)? "MainTabNavigator": "AccountSetup";
          navigator.resetTo(routeNameForReset, StackActions);
        }
      }).catch(err => console.error(err));
    }else{
      navigator.resetTo("SignIn", StackActions);
    }
  }

  constructor(props){
    super(props);

    this.handleScreenDidFocus = this.handleScreenDidFocus.bind(this);
  }

  render(){
    return(
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <NavigationEvents onDidFocus={this.handleScreenDidFocus}/>
        <ActivityIndicator size="large" animating={true} color="#0EAD69"/>
      </View>
    )
  }
}