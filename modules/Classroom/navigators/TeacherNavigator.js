import React from "react";
import { createStackNavigator } from "react-navigation";

import EditSingleFieldScreen from "modules/Classroom/screens/EditSingleFieldScreen";
import TeacherHomeScreen from "modules/Classroom/screens/Teacher/TeacherHomeScreen";
import MyProfileScreen from "modules/Classroom/screens/Teacher/MyProfileScreen";
import StatusChangeScreen from "src/screens/StatusChangeScreen";
import TaskListScreen from "modules/Classroom/screens/Teacher/TaskListScreen"
import ClassListScreen from "modules/Classroom/screens/Teacher/ClassListScreen"
import ClassProfileScreen from "modules/Classroom/screens/Teacher/ClassProfileScreen"
import StudentListScreen from "modules/Classroom/screens/Teacher/StudentListScreen"
import StudentProfileScreen from "modules/Classroom/screens/Teacher/StudentProfileScreen"
import AddTaskScreen from "modules/Classroom/screens/Teacher/AddTaskScreen"

export default TeacherNavigator = createStackNavigator(
  {
    TeacherHome: { screen: TeacherHomeScreen },
    EditSingleField: { screen: EditSingleFieldScreen },
    MyProfile: { screen: MyProfileScreen },
    StatusChange : { screen: StatusChangeScreen },
    TaskList : { screen: TaskListScreen },
    ClassList : { screen: ClassListScreen },
    ClassProfile : { screen: ClassProfileScreen },
    StudentList : { screen: StudentListScreen },
    StudentProfile : { screen: StudentProfileScreen },
    AddTask: {screen: AddTaskScreen}
  },
  {
    initialRouteName: "TeacherHome"
  }
);
