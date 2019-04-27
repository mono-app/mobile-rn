import React from "react";
import { createStackNavigator } from "react-navigation";

import HomeScreen from "../screens/HomeScreen";
import AddContactScreen from "../screens/AddContactScreen";
import PeopleInformationScreen from "../screens/PeopleInformationScreen";
import PeopleSearchResult from "../screens/PeopleSearchResult";
import FriendRequestListScreen from "../screens/FriendRequestListScreen";
import FriendRequestDetailScreen from "../screens/FriendRequestDetailScreen";
import ChatScreen from "../screens/ChatScreen";

export default HomeTabNavigator = createStackNavigator({
  Home: { screen: HomeScreen },
  HomeAddContact: { screen: AddContactScreen },
  PeopleSearchResult: { screen: PeopleSearchResult },
  PeopleInformation: { screen: PeopleInformationScreen },
  FriendRequestList: { screen: FriendRequestListScreen },
  FriendRequestDetail: { screen: FriendRequestDetailScreen },
  Chat: { screen: ChatScreen }
}, {
  initialRouteName: "Home",
  defaultNavigationOptions: { headerStyle: { elevation: 0 } },
  navigationOptions: ({ navigation }) => {
    const { routeName } = navigation.state.routes[navigation.state.index];
    return { tabBarVisible: routeName !== "Chat" }
  }
})