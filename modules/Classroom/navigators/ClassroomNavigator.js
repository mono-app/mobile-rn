import React from "react";
import { createStackNavigator } from "react-navigation";

import HomeScreen from "../screens/HomeScreen";

export default ClassroomNavigator =  createStackNavigator({
  Home: { screen: HomeScreen }
}, {
  initialRouteName: "Home",
})
