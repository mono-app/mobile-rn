import React from "react";
import { createStackNavigator } from "react-navigation";

import HomeScreen from "../screens/HomeScreen";
import SchoolAdminHomeScreen from "../screens/SchoolAdminHomeScreen";
import SchoolAdminAddScreen from "../screens/SchoolAdminAddScreen";
import AddClassScreen from "../screens/AddClassScreen";
import AddTeacherScreen from "../screens/AddTeacherScreen";
import AddStudentScreen from "../screens/AddStudentScreen";
import SplashScreen from "../screens/SplashScreen";
import SchoolAdminDataMasterScreen from "../screens/SchoolAdminDataMasterScreen";
import ClassListScreen from "../screens/ClassListScreen";
import TeacherListScreen from "../screens/TeacherListScreen";
import StudentListScreen from "../screens/StudentListScreen";
import TeacherProfileScreen from "../screens/TeacherProfileScreen";
import StudentProfileScreen from "../screens/StudentProfileScreen";
import ClassProfileScreen from "../screens/ClassProfileScreen";

export default ClassroomNavigator = createStackNavigator(
  {
    Splash: { screen: SplashScreen, navigationOptions: { header: null } },
    Home: { screen: HomeScreen },
    SchoolAdminHome: { screen: SchoolAdminHomeScreen },
    SchoolAdminAdd: { screen: SchoolAdminAddScreen },
    AddClass: { screen: AddClassScreen },
    AddTeacher: { screen: AddTeacherScreen },
    AddStudent: { screen: AddStudentScreen },
    SchoolAdminDataMaster: { screen: SchoolAdminDataMasterScreen },
    ClassList: { screen:  ClassListScreen},
    TeacherList: { screen:  TeacherListScreen},
    StudentList: { screen: StudentListScreen },
    TeacherProfile: { screen: TeacherProfileScreen },
    StudentProfile: { screen: StudentProfileScreen },
    ClassProfile: { screen: ClassProfileScreen }
  },
  {
    initialRouteName: "Splash"
  }
);
