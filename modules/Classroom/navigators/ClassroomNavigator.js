import React from "react";
import { createStackNavigator } from "react-navigation";

import HomeScreen from "modules/Classroom/screens/HomeScreen";
import SchoolAdminHomeScreen from "modules/Classroom/screens/SchoolAdmin/SchoolAdminHomeScreen";
import SchoolAdminAddScreen from "modules/Classroom/screens/SchoolAdmin/SchoolAdminAddScreen";
import AddClassScreen from "modules/Classroom/screens/SchoolAdmin/AddClassScreen";
import AddTeacherScreen from "modules/Classroom/screens/SchoolAdmin/AddTeacherScreen";
import AddStudentScreen from "modules/Classroom/screens/SchoolAdmin/AddStudentScreen";
import SplashScreen from "modules/Classroom/screens/SplashScreen";
import SchoolAdminDataMasterScreen from "modules/Classroom/screens/SchoolAdmin/SchoolAdminDataMasterScreen";
import ClassListScreen from "modules/Classroom/screens/SchoolAdmin/ClassListScreen";
import TeacherListScreen from "modules/Classroom/screens/SchoolAdmin/TeacherListScreen";
import StudentListScreen from "modules/Classroom/screens/SchoolAdmin/StudentListScreen";
import TeacherProfileScreen from "modules/Classroom/screens/SchoolAdmin/TeacherProfileScreen";
import StudentProfileScreen from "modules/Classroom/screens/SchoolAdmin/StudentProfileScreen";
import ClassProfileScreen from "modules/Classroom/screens/SchoolAdmin/ClassProfileScreen";
import TeacherClassListScreen from "modules/Classroom/screens/SchoolAdmin/TeacherClassListScreen";
import EditSingleFieldScreen from "modules/Classroom/screens/EditSingleFieldScreen";
import TeacherHomeScreen from "modules/Classroom/screens/Teacher/TeacherHomeScreen";
import MyProfileScreen from "modules/Classroom/screens/Teacher/MyProfileScreen";
import StatusChangeScreen from "src/screens/StatusChangeScreen";

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
    TeacherClassList: { screen: TeacherClassListScreen },
    StudentProfile: { screen: StudentProfileScreen },
    ClassProfile: { screen: ClassProfileScreen },
    EditSingleField: { screen: EditSingleFieldScreen },
    TeacherHome: { screen: TeacherHomeScreen },
    MyProfile: { screen: MyProfileScreen },
    StatusChange : { screen: StatusChangeScreen }
  },
  {
    initialRouteName: "Splash"
  }
);
