import React from "react";
import { createStackNavigator } from "react-navigation";

import SchoolAdminHomeScreen from "modules/Classroom/screens/SchoolAdmin/SchoolAdminHomeScreen";
import SchoolAdminAddScreen from "modules/Classroom/screens/SchoolAdmin/SchoolAdminAddScreen";
import AddClassScreen from "modules/Classroom/screens/SchoolAdmin/AddClassScreen";
import AddTeacherScreen from "modules/Classroom/screens/SchoolAdmin/AddTeacherScreen";
import AddStudentScreen from "modules/Classroom/screens/SchoolAdmin/AddStudentScreen";
import SchoolAdminDataMasterScreen from "modules/Classroom/screens/SchoolAdmin/SchoolAdminDataMasterScreen";
import ClassListScreen from "modules/Classroom/screens/SchoolAdmin/ClassListScreen";
import TeacherListScreen from "modules/Classroom/screens/SchoolAdmin/TeacherListScreen";
import StudentListScreen from "modules/Classroom/screens/SchoolAdmin/StudentListScreen";
import TeacherProfileScreen from "modules/Classroom/screens/SchoolAdmin/TeacherProfileScreen";
import StudentProfileScreen from "modules/Classroom/screens/SchoolAdmin/StudentProfileScreen";
import ClassProfileScreen from "modules/Classroom/screens/SchoolAdmin/ClassProfileScreen";
import TeacherClassListScreen from "modules/Classroom/screens/SchoolAdmin/TeacherClassListScreen";
import TeacherClassListPickerScreen from "modules/Classroom/screens/SchoolAdmin/TeacherClassListPickerScreen";
import StudentClassListScreen from "modules/Classroom/screens/SchoolAdmin/StudentClassListScreen";
import StudentClassListPickerScreen from "modules/Classroom/screens/SchoolAdmin/StudentClassListPickerScreen";
import EditSingleFieldScreen from "modules/Classroom/screens/EditSingleFieldScreen";
import ArchiveClassListScreen from "modules/Classroom/screens/SchoolAdmin/ArchiveClassListScreen";
import ArchiveClassListPickerScreen from "modules/Classroom/screens/SchoolAdmin/ArchiveClassListPickerScreen";

export default SchoolAdminNavigator = createStackNavigator(
  {
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
    TeacherClassListPicker: { screen: TeacherClassListPickerScreen },
    StudentClassList: { screen: StudentClassListScreen },
    StudentClassListPicker: { screen: StudentClassListPickerScreen },
    StudentProfile: { screen: StudentProfileScreen },
    ClassProfile: { screen: ClassProfileScreen },
    EditSingleField: { screen: EditSingleFieldScreen },
    ArchiveClassList: { screen: ArchiveClassListScreen },
    ArchiveClassListPicker: { screen: ArchiveClassListPickerScreen },
  },
  {
    initialRouteName: "SchoolAdminHome"
  }
);
