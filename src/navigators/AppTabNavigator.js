import React from "react";
import { createStackNavigator, createSwitchNavigator } from "react-navigation";

import AppListScreen from "../screens/AppListScreen";
import ClassroomNavigator from "modules/Classroom/navigators/ClassroomNavigator";
import NewsNavigator from "modules/News/navigators/NewsNavigator";

export default AppTabNavigator =  createStackNavigator({
  Home: { screen: AppListScreen },
  Classroom: { screen: ClassroomNavigator, navigationOptions: { header: null }},
  News: { screen: NewsNavigator, navigationOptions: { headerTitle: "News" }},
}, {
  initialRouteName: "Home",
})
