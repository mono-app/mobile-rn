import React from 'react';
import firebase from 'react-native-firebase';
import VerifyPhoneAPI from "src/api/verifyphone";
import PeopleAPI from "src/api/people"
import TranslationAPI from "src/api/translation";
import OfflineDatabase from "src/api/database/offline";
import AppNavigator from "src/navigators/AppNavigator";
import { AppState } from "react-native";
import { createAppContainer } from 'react-navigation';
import { DefaultTheme, Provider as PaperProvider } from 'react-native-paper';
import { CurrentUserProvider } from "src/api/people/CurrentUser";
import { TutorialProvider } from "src/api/Tutorial";

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

  const handleAppStateChange = (nextAppState) => {
    const firebaseUser = firebase.auth().currentUser;
    if(firebaseUser !== null && firebaseUser.uid) {
      if(nextAppState === "active"){
        PeopleAPI.setOnlineStatus(firebaseUser.uid, "Online");
      }else if(nextAppState === "background"){
        PeopleAPI.setOnlineStatus(firebaseUser.uid, "Offline");
      }else if(nextAppState === "inactive"){
        PeopleAPI.setOnlineStatus(firebaseUser.uid, "Offline");
        VerifyPhoneAPI.cancelRequest()
      }
    }
  }

  React.useEffect(() => {
    TranslationAPI.initialize();
    OfflineDatabase.initialize();
    
    const firebaseUser = firebase.auth().currentUser;
    if(firebaseUser !== null && firebaseUser.uid) {
      PeopleAPI.setOnlineStatus(firebaseUser.uid, "Online");
    }
    firebase.firestore().settings({ persistence: true });
    AppState.addEventListener("change", handleAppStateChange);
    return function cleanup(){
      AppState.removeEventListener("change", handleAppStateChange) 
    }
  }, [])


  return(
    <PaperProvider theme={theme}>
      <CurrentUserProvider>
        <TutorialProvider>
          <AppContainer/>
        </TutorialProvider>
      </CurrentUserProvider>
    </PaperProvider>
  )
}
export default App;