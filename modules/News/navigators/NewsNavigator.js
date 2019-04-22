import React from "react";
import { createStackNavigator } from "react-navigation";

import ContactScreen from "../../../src/screens/ContactScreen";

export default NewsNavigator =  createStackNavigator({
  Home: { screen: ContactScreen },
}, {
  initialRouteName: "Home",
})
