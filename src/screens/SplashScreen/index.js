import React from "react";
import firebase from "react-native-firebase";
import { View, ActivityIndicator } from "react-native";
import { StackActions, NavigationEvents } from "react-navigation";

import CurrentUserAPI from "src/api/people/CurrentUser";
import PeopleAPI from "src/api/people";
import Navigator from "src/api/navigator";

export default class SplashScreen extends React.Component{
  handleScreenDidFocus = async () => {
    const firebaseUser = firebase.auth().currentUser;
    const navigator = new Navigator(this.props.navigation);
    if(firebaseUser !== null){
      const userData = await new PeopleAPI().getDetail(firebaseUser.email);
      if(userData){
        await CurrentUserAPI.storeBasicInformation(userData);
        CurrentUserAPI.listenChanges();

        const routeNameForReset = (userData.isCompleteSetup)? "MainTabNavigator": "AccountSetup";
        navigator.resetTo(routeNameForReset, StackActions);
      }else throw "Cannot find user in the database. Application error.";
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