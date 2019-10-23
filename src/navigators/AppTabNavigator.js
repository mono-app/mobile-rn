import React from "react";
import { createStackNavigator } from "react-navigation";

import AppListScreen from "src/screens/AppListScreen";
import ClassroomNavigator from "modules/Classroom/navigators/ClassroomNavigator";
import NewsNavigator from "modules/News/navigators/NewsNavigator";
import MomentNavigatorObj from "modules/Moments/navigators/MomentNavigatorObj"
import DiscussionClassroomNotifNavigatorObj from "modules/Classroom/navigators/DiscussionClassroomNotifNavigatorObj"
import ChatScreen from "src/screens/ChatScreen";
import GroupChatScreen from "src/screens/GroupChatScreen";
import AddDiscussionScreen from "modules/Classroom/screens/AddDiscussionScreen"
import DiscussionsScreen from "modules/Classroom/screens/DiscussionsScreen"
// import PeopleNearbyScreen from "src/screens/PeopleNearbyScreen";
import PeopleInformationScreen from "src/screens/PeopleInformationScreen";
import IntroductionClassroomScreen from "modules/Classroom/screens/IntroductionScreen";

export default AppTabNavigator =  createStackNavigator({
  Home: { screen: AppListScreen, navigationOptions: { header: null } },
  Classroom: { screen: ClassroomNavigator, navigationOptions: { header: null }},
  // News: { screen: NewsNavigator, navigationOptions: { headerTitle: "News" }},
  IntroductionClassroom: { screen: IntroductionClassroomScreen, navigationOptions: { header: null} },
  Chat: { screen: ChatScreen, navigationOptions: { header: null} },
  GroupChat: { screen: GroupChatScreen, navigationOptions: { header: null} },
  AddDiscussion: {screen: AddDiscussionScreen, navigationOptions: { header: null}},
  Discussions: {screen: DiscussionsScreen, navigationOptions: { header: null}},
  // PeopleNearby: { screen: PeopleNearbyScreen },
  PeopleInformation: { screen: PeopleInformationScreen, navigationOptions: { header: null } },
  ...MomentNavigatorObj,
  ...DiscussionClassroomNotifNavigatorObj,
  
}, {
  initialRouteName: "Home",
  navigationOptions: ({ navigation }) => {
    const { routeName } = navigation.state.routes[navigation.state.index];
    return { tabBarVisible: (routeName !== "MapsPicker"  && routeName !== "GallerySwiper" && routeName !== "Chat" && routeName !== "GroupChat" && routeName !== "IntroductionClassroom") }
  }
})
