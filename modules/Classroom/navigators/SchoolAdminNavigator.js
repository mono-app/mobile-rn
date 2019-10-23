import React from "react";
import { createStackNavigator } from "react-navigation";
import { CurrentSchoolAdminProvider } from "modules/Classroom/api/schooladmin/CurrentSchoolAdmin"

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
import ArchiveClassDetailsScreen from "modules/Classroom/screens/SchoolAdmin/ArchiveClassDetailsScreen";

const MyNavigator = createStackNavigator(
  {
    SchoolAdminHome: { screen: SchoolAdminHomeScreen, navigationOptions: { header: null}},
    SchoolAdminAdd: { screen: SchoolAdminAddScreen, navigationOptions: { header: null}},
    AddClass: { screen: AddClassScreen, navigationOptions: { header: null}},
    AddTeacher: { screen: AddTeacherScreen, navigationOptions: { header: null}},
    AddStudent: { screen: AddStudentScreen, navigationOptions: { header: null}},
    SchoolAdminDataMaster: { screen: SchoolAdminDataMasterScreen, navigationOptions: { header: null}},
    ClassList: { screen:  ClassListScreen, navigationOptions: { header: null}},
    TeacherList: { screen:  TeacherListScreen, navigationOptions: { header: null}},
    StudentList: { screen: StudentListScreen, navigationOptions: { header: null}},
    TeacherProfile: { screen: TeacherProfileScreen, navigationOptions: { header: null}},
    TeacherClassList: { screen: TeacherClassListScreen, navigationOptions: { header: null}},
    TeacherClassListPicker: { screen: TeacherClassListPickerScreen, navigationOptions: { header: null}},
    StudentClassList: { screen: StudentClassListScreen, navigationOptions: { header: null}},
    StudentClassListPicker: { screen: StudentClassListPickerScreen, navigationOptions: { header: null}},
    StudentProfile: { screen: StudentProfileScreen, navigationOptions: { header: null}},
    ClassProfile: { screen: ClassProfileScreen, navigationOptions: { header: null}},
    EditSingleField: { screen: EditSingleFieldScreen, navigationOptions: { header: null}},
    ArchiveClassList: { screen: ArchiveClassListScreen, navigationOptions: { header: null}},
    ArchiveClassListPicker: { screen: ArchiveClassListPickerScreen, navigationOptions: { header: null}},
    ArchiveClassDetails: { screen: ArchiveClassDetailsScreen, navigationOptions: { header: null}}
  },
  {
    initialRouteName: "SchoolAdminHome"
  }
);

export default class SchoolAdminNavigator extends React.PureComponent{
  static router = MyNavigator.router;
  render(){
    return (
      <CurrentSchoolAdminProvider>
        <MyNavigator navigation={this.props.navigation}/>
      </CurrentSchoolAdminProvider>
    )
  }
}