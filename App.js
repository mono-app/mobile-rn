import React from 'react';
import firebase from 'react-native-firebase';
import VerifyPhoneAPI from "src/api/verifyphone";
import PeopleAPI from "src/api/people"
import OfflineDatabase from "src/api/database/offline";
import AppNavigator from "src/navigators/AppNavigator";
import { AppState } from "react-native";
import { createAppContainer } from 'react-navigation';

import { DefaultTheme, Provider as PaperProvider } from 'react-native-paper';
import { CurrentUserProvider } from "src/api/people/CurrentUser";
import { CurrentRoomsProvider } from "src/api/rooms/CurrentRooms";
import { TutorialProvider } from "src/api/Tutorial";
import { initReactI18next } from 'react-i18next';
// import { Platform, NativeModules } from 'react-native'

import i18next from 'i18next';
import translationId from "src/api/translation/id"
import translationEn from "src/api/translation/en"

console.disableYellowBox = true;

const AppContainer = createAppContainer(AppNavigator);
// const deviceLanguage = Platform.OS === 'ios' ? NativeModules.SettingsManager.settings.AppleLocale: NativeModules.I18nManager.localeIdentifier;
const deviceLanguage = "id-ID";
const languageDetector = {
  type: 'languageDetector',
  async: true,
  detect: cb => cb(deviceLanguage),
  init: () => {},
  cacheUserLanguage: () => {},
};

i18next.use(languageDetector).use(initReactI18next)
  .init({
    fallbackLng: 'en_US',
    debug: true,
    resources: {
      en_US: {
        translation: translationEn,
      },
      in_ID: {
        translation: translationId,
      },
    },
  });

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

  React.useEffect(() => {
    OfflineDatabase.initialize();
    
    const firebaseUser = firebase.auth().currentUser;
    if(firebaseUser !== null && firebaseUser.email) {
      PeopleAPI.setOnlineStatus(firebaseUser.email, "Online");
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
            <CurrentRoomsProvider>
              <AppContainer/>
            </CurrentRoomsProvider>
          </TutorialProvider>
      </CurrentUserProvider>
    </PaperProvider>
  )
}
export default App;