import React from "react";
import { createStackNavigator } from "react-navigation";

import StudentHomeScreen from "modules/Classroom/screens/Student/StudentHomeScreen";
import MyProfileScreen from "modules/Classroom/screens/Student/MyProfileScreen";

export default StudentNavigator = createStackNavigator(
  {
    StudentHome: { screen: StudentHomeScreen },
    MyProfile: { screen: MyProfileScreen },
  },
  {
    initialRouteName: "StudentHome"
  }
);
