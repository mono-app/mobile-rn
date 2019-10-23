import React from "react";
import { createStackNavigator } from "react-navigation";

import ContactScreen from "src/screens/ContactScreen";
import ChatScreen from "src/screens/ChatScreen";
import PeopleInformationScreen from "src/screens/PeopleInformationScreen";
import DiscussionClassroomNotifNavigatorObj from "modules/Classroom/navigators/DiscussionClassroomNotifNavigatorObj"
import MomentNavigatorObj from "modules/Moments/navigators/MomentNavigatorObj"

export default ContactTabNavigator =  createStackNavigator({
  ContactHome: { screen: ContactScreen, navigationOptions: { header: null } },
  Chat: { screen: ChatScreen },
  PeopleInformation: { screen: PeopleInformationScreen, navigationOptions: { header: null } },
  ...DiscussionClassroomNotifNavigatorObj,
  ...MomentNavigatorObj
}, {
  initialRouteName: "ContactHome",
  navigationOptions: ({ navigation }) => {
    const { routeName } = navigation.state.routes[navigation.state.index];
    return { tabBarVisible: routeName !== "MomentComments" && routeName !== "Chat" && routeName !== "MapsPicker" && routeName !== "GallerySwiper"}
  }
})