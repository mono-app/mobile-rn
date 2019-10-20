import React from 'react';
import firebase from 'react-native-firebase';
import VerifyPhoneAPI from "src/api/verifyphone";
import OfflineSyncAPI from "src/api/sync";
import OfflineDatabase from "src/api/database/offline";
import AppNavigator from "src/navigators/AppNavigator";
import { AppState } from "react-native";
import { createAppContainer } from 'react-navigation';
import { DefaultTheme, Provider as PaperProvider } from 'react-native-paper';
import { CurrentUserProvider } from "src/api/people/CurrentUser";
import { TutorialProvider } from "src/api/Tutorial";
import PeopleAPI from "src/api/people"

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
    if(firebaseUser !== null && firebaseUser.email) {
      if(nextAppState === "active"){
        PeopleAPI.setOnlineStatus(firebaseUser.email, "Online");
      }else if(nextAppState === "background"){
        PeopleAPI.setOnlineStatus(firebaseUser.email, "Offline");
      }else if(nextAppState === "inactive"){
        PeopleAPI.setOnlineStatus(firebaseUser.email, "Offline");
        VerifyPhoneAPI.cancelRequest()
      }
    }
  }

  const initOffline = async () => {
    await OfflineDatabase.openConnection();
    OfflineSyncAPI.listen();
  }

  React.useEffect(() => {
    initOffline();

    const firebaseUser = firebase.auth().currentUser;
    if(firebaseUser !== null && firebaseUser.email) {
      PeopleAPI.setOnlineStatus(firebaseUser.email, "Online");
    }
    firebase.firestore().settings({ persistence: true, cacheSizeBytes: -1 });
    AppState.addEventListener("change", handleAppStateChange);
    return function cleanup(){
      AppState.removeEventListener("change", handleAppStateChange);
      OfflineSyncAPI.removeListeners();
      OfflineDatabase.closeConnection();
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