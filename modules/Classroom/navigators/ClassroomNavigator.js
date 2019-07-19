import React from "react";
import { createStackNavigator } from "react-navigation";

import HomeScreen from "../screens/HomeScreen";
import SchoolAdminHomeScreen from "../screens/SchoolAdminHomeScreen";

export default ClassroomNavigator =  createStackNavigator({
  Home: { screen: HomeScreen },
  SchoolAdminHome: { screen: SchoolAdminHomeScreen }
}, {
  initialRouteName: "SchoolAdminHome",
})
