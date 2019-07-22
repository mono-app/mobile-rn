import React from "react";
import { createStackNavigator } from "react-navigation";

import HomeScreen from "../screens/HomeScreen";
import SchoolAdminHomeScreen from "../screens/SchoolAdminHomeScreen";
import AddClassScreen from "../screens/AddClassScreen";
import SplashScreen from "../screens/SplashScreen";

export default (ClassroomNavigator = createStackNavigator(
  {
    Splash: { screen: SplashScreen, navigationOptions:{header:null} },
    Home: { screen: HomeScreen },
    SchoolAdminHome: { screen: SchoolAdminHomeScreen },
    AddClass: { screen: AddClassScreen}
  },
  {
    initialRouteName: "Splash"
  }
));   
