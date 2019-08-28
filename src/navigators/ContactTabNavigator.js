import React from "react";
import { createStackNavigator } from "react-navigation";

import ContactScreen from "src/screens/ContactScreen";
import ChatScreen from "src/screens/ChatScreen";
import PeopleInformationScreen from "src/screens/PeopleInformationScreen";

export default ContactTabNavigator =  createStackNavigator({
  ContactHome: { screen: ContactScreen },
  Chat: { screen: ChatScreen },
  PeopleInformation: { screen: PeopleInformationScreen }
}, {
  initialRouteName: "ContactHome",
  navigationOptions: ({ navigation }) => {
    const { routeName } = navigation.state.routes[navigation.state.index];
    return { tabBarVisible: routeName !== "Chat" }
  }
})
