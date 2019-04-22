import React from 'react';
import { createAppContainer } from 'react-navigation';
import { Provider as PaperProvider } from 'react-native-paper';

import AppNavigator from "./src/navigators/AppNavigator";
import firebase from 'react-native-firebase';

console.disableYellowBox = true;

const AppContainer = createAppContainer(AppNavigator);
export default class App extends React.Component{
  componentDidMount(){
    firebase.firestore().settings({ persistence: true });
  }
  
  render(){
    return(
      <PaperProvider>
        <AppContainer/>
      </PaperProvider>
    )
  }
}

