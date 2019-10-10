import React from 'react';
import firebase from 'react-native-firebase';
import VerifyPhoneAPI from "src/api/verifyphone";
import AppNavigator from "src/navigators/AppNavigator";
import { AppState } from "react-native";
import { createAppContainer } from 'react-navigation';
import { DefaultTheme, Provider as PaperProvider } from 'react-native-paper';
import { CurrentUserProvider } from "src/api/people/CurrentUser";

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

  const handleAppStateChange = async (nextAppState) => {
    if(nextAppState === "inactive") VerifyPhoneAPI.cancelRequest()
  }

  React.useEffect(() => {
    firebase.firestore().settings({ persistence: true });
    AppState.addEventListener("change", handleAppStateChange);
    return function cleanup(){
      AppState.removeEventListener("change", handleAppStateChange) 
    }
  })

  return(
    <PaperProvider theme={theme}>
      <CurrentUserProvider>
        <AppContainer/>
      </CurrentUserProvider>
    </PaperProvider>
  )
}
export default App;