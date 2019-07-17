import React from "react";
import { createStackNavigator } from "react-navigation";

import HomeScreen from "src/screens/HomeScreen";
import AddContactScreen from "src/screens/AddContactScreen";
import PeopleInformationScreen from "src/screens/PeopleInformationScreen";
import PeopleSearchResult from "src/screens/PeopleSearchResult";
import FriendRequestListScreen from "src/screens/FriendRequestListScreen";
import ChatScreen from "src/screens/ChatScreen";
import MyQRScreen from "src/screens/MyQRScreen";
import ScanQRCodeSCreen from "src/screens/ScanQRCodeScreen";
import WebRTCScreen from "src/screens/WebRTCScreen";

export default HomeTabNavigator = createStackNavigator({
  Home: { screen: HomeScreen },
  AddContact: { screen: AddContactScreen },
  ScanQRCode: { screen: ScanQRCodeSCreen },
  PeopleSearchResult: { screen: PeopleSearchResult },
  PeopleInformation: { screen: PeopleInformationScreen },
  FriendRequestList: { screen: FriendRequestListScreen },
  Chat: { screen: ChatScreen },
  MyQR: { screen: MyQRScreen },
  WebRTC: { screen: WebRTCScreen }
}, {
  initialRouteName: "Home",
  defaultNavigationOptions: { headerStyle: { elevation: 0 } },
  navigationOptions: ({ navigation }) => {
    const { routeName } = navigation.state.routes[navigation.state.index];
    return { tabBarVisible: (routeName !== "Chat" && routeName !== "WebRTC") }
  }
})