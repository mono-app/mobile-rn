import React from "react";
import { createStackNavigator } from "react-navigation";

import AppListScreen from "../screens/AppListScreen";
import ClassroomNavigator from "modules/Classroom/navigators/ClassroomNavigator";
import NewsNavigator from "modules/News/navigators/NewsNavigator";
import MapsPickerScreen from "src/screens/MapsPickerScreen"
import GallerySwiperScreen from "src/screens/GallerySwiperScreen"
import CameraScreen from "src/screens/CameraScreen";
import DiscussionClassroomNotifNavigatorObj from "modules/Classroom/navigators/DiscussionClassroomNotifNavigatorObj"

export default AppTabNavigator =  createStackNavigator({
  Home: { screen: AppListScreen },
  Classroom: { screen: ClassroomNavigator, navigationOptions: { header: null }},
  News: { screen: NewsNavigator, navigationOptions: { headerTitle: "News" }},
  MapsPicker: {screen: MapsPickerScreen},
  GallerySwiper: {screen: GallerySwiperScreen},
  Camera: {screen: CameraScreen},
  ...DiscussionClassroomNotifNavigatorObj
}, {
  initialRouteName: "Home",
  navigationOptions: ({ navigation }) => {
    const { routeName } = navigation.state.routes[navigation.state.index];
    return { tabBarVisible: (routeName !== "MapsPicker"  && routeName !== "GallerySwiper") }
  }
})
