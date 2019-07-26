import React from "react";
import { createStackNavigator } from "react-navigation";

import HomeScreen from "../screens/HomeScreen";
import SchoolAdminHomeScreen from "../screens/SchoolAdmin/SchoolAdminHomeScreen";
import SchoolAdminAddScreen from "../screens/SchoolAdmin/SchoolAdminAddScreen";
import AddClassScreen from "../screens/SchoolAdmin/AddClassScreen";
import AddTeacherScreen from "../screens/SchoolAdmin/AddTeacherScreen";
import AddStudentScreen from "../screens/SchoolAdmin/AddStudentScreen";
import SplashScreen from "../screens/SplashScreen";
import SchoolAdminDataMasterScreen from "../screens/SchoolAdmin/SchoolAdminDataMasterScreen";
import ClassListScreen from "../screens/SchoolAdmin/ClassListScreen";
import TeacherListScreen from "../screens/SchoolAdmin/TeacherListScreen";
import StudentListScreen from "../screens/SchoolAdmin/StudentListScreen";
import TeacherProfileScreen from "../screens/SchoolAdmin/TeacherProfileScreen";
import StudentProfileScreen from "../screens/SchoolAdmin/StudentProfileScreen";
import ClassProfileScreen from "../screens/SchoolAdmin/ClassProfileScreen";
import EditSingleFieldScreen from "../screens/EditSingleFieldScreen";
import TeacherHomeScreen from "../screens/Teacher/TeacherHomeScreen";
import MyProfileScreen from "../screens/Teacher/MyProfileScreen";

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
    ClassProfile: { screen: ClassProfileScreen },
    EditSingleField: { screen: EditSingleFieldScreen },
    TeacherHome: { screen: TeacherHomeScreen },
    MyProfile: { screen: MyProfileScreen }
  },
  {
    initialRouteName: "Splash"
  }
);
