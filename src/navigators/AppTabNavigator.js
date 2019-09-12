import React from "react";
import { createStackNavigator, createSwitchNavigator } from "react-navigation";

import AppListScreen from "../screens/AppListScreen";
import ClassroomNavigator from "modules/Classroom/navigators/ClassroomNavigator";
import NewsNavigator from "modules/News/navigators/NewsNavigator";
import MapsPickerScreen from "src/screens/MapsPickerScreen"
import GallerySwiperScreen from "src/screens/GallerySwiperScreen"

export default AppTabNavigator =  createStackNavigator({
  Home: { screen: AppListScreen },
  Classroom: { screen: ClassroomNavigator, navigationOptions: { header: null }},
  News: { screen: NewsNavigator, navigationOptions: { headerTitle: "News" }},
  MapsPicker: {screen: MapsPickerScreen},
  GallerySwiper: {screen: GallerySwiperScreen},
}, {
  initialRouteName: "Home",
  navigationOptions: ({ navigation }) => {
    const { routeName } = navigation.state.routes[navigation.state.index];
    return { tabBarVisible: (routeName !== "MapsPicker"  && routeName !== "GallerySwiper") }
  }
})
