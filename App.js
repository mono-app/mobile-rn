import React from 'react';
import firebase from 'react-native-firebase';
import { AppState } from "react-native";
import { createAppContainer } from 'react-navigation';
import { DefaultTheme, Provider as PaperProvider } from 'react-native-paper';
import { CurrentUserProvider } from "src/api/people/CurrentUser";
import NotificationListener from "src/components/NotificationListener"
import CurrentUserAPI from "src/api/people/CurrentUser";
import PeopleAPI from "src/api/people";

import AppNavigator from "/src/navigators/AppNavigator";

console.disableYellowBox = true;

const AppContainer = createAppContainer(AppNavigator);


function App(){
  const theme = {
    ...DefaultTheme,
    colors: {
      ...DefaultTheme.colors,
      primary: '#0EAD69',
    }
  };

  // const handleAppStateChange = async (nextAppState) => {
  //   const currentUserEmail = await CurrentUserAPI.getCurrentUserEmail();
  //   if(nextAppState === "active"){
  //     await PeopleAPI.setOnlineStatus(currentUserEmail, "Online");
  //   }else if(nextAppState === "background" || nextAppState === "inactive"){
  //     await PeopleAPI.setOnlineStatus(currentUserEmail, "Offline");
  //   }
  // }

  // React.useEffect(() => {
  //   CurrentUserAPI.getCurrentUserEmail().then(currentUserEmail => {
  //     return PeopleAPI.setOnlineStatus(currentUserEmail, "Online");
  //   })
  //   firebase.firestore().settings({ persistence: true });
  //   AppState.addEventListener("change", handleAppStateChange);

  //   return function cleanup(){
  //     AppState.removeEventListener("change", handleAppStateChange) 
  //   }
  // })

  return(
    <PaperProvider theme={theme}>
      <CurrentUserProvider>
        <AppContainer/>
      </CurrentUserProvider>
    </PaperProvider>
  )
}
export default App;