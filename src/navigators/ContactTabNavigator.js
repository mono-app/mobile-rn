import React from "react";
import { createStackNavigator } from "react-navigation";

import ContactScreen from "../screens/ContactScreen";
import AddContactScreen from "../screens/AddContactScreen";
import PeopleInformationScreen from "../screens/PeopleInformationScreen";
import ChatScreen from "../screens/ChatScreen";
import PeopleDetailScreen from "../screens/PeopleDetailScreen";

export default ContactTabNavigator =  createStackNavigator({
  ContactHome: { screen: ContactScreen },
  ContactAddContact: { screen: AddContactScreen },
  ContactPeopleInformation: { screen: PeopleInformationScreen },
  Chat: { screen: ChatScreen },
  PeopleDetail: { screen: PeopleDetailScreen }
}, {
  initialRouteName: "ContactHome",
  defaultNavigationOptions: { headerStyle: { elevation: 0 }},
  navigationOptions: ({ navigation }) => {
    const { routeName } = navigation.state.routes[navigation.state.index];
    return { tabBarVisible: routeName !== "Chat" }
  }
})
