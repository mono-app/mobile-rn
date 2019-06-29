import React from 'react';
import firebase from 'react-native-firebase';
import { AppState } from "react-native";
import { createAppContainer } from 'react-navigation';
import { DefaultTheme, Provider as PaperProvider } from 'react-native-paper';

import CurrentUserAPI from "src/api/people/CurrentUser";
import PeopleAPI from "src/api/people";

import AppNavigator from "/src/navigators/AppNavigator";

console.disableYellowBox = true;

const AppContainer = createAppContainer(AppNavigator);
export default class App extends React.Component{
  handleAppStateChange = async (nextAppState) => {
    const currentUserEmail = await CurrentUserAPI.getCurrentUserEmail();
    if(nextAppState === "active"){
      await PeopleAPI.setOnlineStatus(currentUserEmail, "Online");
    }else if(nextAppState === "background" || nextAppState === "inactive"){
      await PeopleAPI.setOnlineStatus(currentUserEmail, "Offline");
    }
  }

  constructor(props){
    super(props);
    this.handleAppStateChange = this.handleAppStateChange.bind(this);
  }

  componentDidMount(){
    CurrentUserAPI.getCurrentUserEmail().then(currentUserEmail => {
      return PeopleAPI.setOnlineStatus(currentUserEmail, "Online");
    })
    firebase.firestore().settings({ persistence: true });
    AppState.addEventListener("change", this.handleAppStateChange);
  }
  
  componentWillUnmount(){ AppState.removeEventListener("change", this.handleAppStateChange) }

  render(){
    const theme = {
      ...DefaultTheme,
      colors: {
        ...DefaultTheme.colors,
        primary: '#0EAD69'
      }
    };

    return(
      <PaperProvider theme={theme}>
        <AppContainer/>
      </PaperProvider>
    )
  }
}

