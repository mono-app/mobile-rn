import React from "react";
import { createSwitchNavigator } from "react-navigation";
import SplashScreen from "modules/Classroom/screens/SplashScreen";
import SchoolAdminNavigator from "./SchoolAdminNavigator";
import TeacherNavigator from "./TeacherNavigator";

export default ClassroomNavigator = createSwitchNavigator(
  {
    Splash: { screen: SplashScreen },
    SchoolAdmin : { screen: SchoolAdminNavigator },
    Teacher : { screen: TeacherNavigator }
  },
  {
    initialRouteName: "Splash"
  }
);
