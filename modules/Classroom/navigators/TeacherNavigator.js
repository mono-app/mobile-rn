import React from "react";
import { createStackNavigator } from "react-navigation";
import { CurrentTeacherProvider } from "modules/Classroom/api/teacher/CurrentTeacher"
import { TutorialClassroomProvider } from "modules/Classroom/api/TutorialClassroom"
import EditSingleFieldScreen from "modules/Classroom/screens/EditSingleFieldScreen";
import TeacherHomeScreen from "modules/Classroom/screens/Teacher/TeacherHomeScreen";
import MyProfileScreen from "modules/Classroom/screens/Teacher/MyProfileScreen";
import StatusChangeScreen from "src/screens/StatusChangeScreen";

import MyClassScreen from "modules/Classroom/screens/Teacher/MyClassScreen"
import ClassProfileScreen from "modules/Classroom/screens/Teacher/ClassProfileScreen"
import StudentListScreen from "modules/Classroom/screens/Teacher/StudentListScreen"
import StudentProfileScreen from "modules/Classroom/screens/Teacher/StudentProfileScreen"
import AddTaskScreen from "modules/Classroom/screens/Teacher/AddTaskScreen"
import AddTaskClassPickerScreen from "modules/Classroom/screens/Teacher/AddTaskScreen/ClassPickerScreen"
import TaskListScreen from "modules/Classroom/screens/Teacher/TaskListScreen"
import TaskDetailsScreen from "modules/Classroom/screens/Teacher/TaskDetailsScreen"
import EditTaskSingleFieldScreen from "modules/Classroom/screens/Teacher/EditTaskSingleFieldScreen"
import TaskSubmissionListScreen from "modules/Classroom/screens/Teacher/TaskSubmissionListScreen"
import ClassFilesScreen from "modules/Classroom/screens/Teacher/ClassFilesScreen"
import SubmissionDetailsScreen from "modules/Classroom/screens/Teacher/SubmissionDetailsScreen"
import SubmissionScoringScreen from "modules/Classroom/screens/Teacher/SubmissionScoringScreen"
import ScoreDetailsScreen from "modules/Classroom/screens/Teacher/ScoreDetailsScreen"
import TaskFilesScreen from "modules/Classroom/screens/Teacher/TaskFilesScreen"
import TaskArchiveListScreen from "modules/Classroom/screens/Teacher/TaskArchiveListScreen"
import ArchiveSelectClassScreen from "modules/Classroom/screens/Teacher/ArchiveSelectClassScreen"
import AddClassFilesScreen from "modules/Classroom/screens/Teacher/AddClassFilesScreen"
import MassScoringScreen from "modules/Classroom/screens/Teacher/MassScoringScreen"
import MyDiscussionsScreen from "modules/Classroom/screens/MyDiscussionsScreen";

const MyNavigator = createStackNavigator(
  {
    TeacherHome: { screen: TeacherHomeScreen, navigationOptions: { header: null}},
    EditSingleField: { screen: EditSingleFieldScreen, navigationOptions: { header: null}},
    EditTaskSingleField: { screen: EditTaskSingleFieldScreen, navigationOptions: { header: null}},
    MyProfile: { screen: MyProfileScreen, navigationOptions: { header: null}},
    StatusChange : { screen: StatusChangeScreen, navigationOptions: { header: null}},
    MyClass : { screen: MyClassScreen, navigationOptions: { header: null}},
    ClassProfile : { screen: ClassProfileScreen, navigationOptions: { header: null}},
    StudentList : { screen: StudentListScreen, navigationOptions: { header: null}},
    StudentProfile : { screen: StudentProfileScreen, navigationOptions: { header: null}},
    AddTask: {screen: AddTaskScreen, navigationOptions: { header: null}},
    AddTaskClassPicker: {screen: AddTaskClassPickerScreen, navigationOptions: { header: null}},
    TaskList: {screen: TaskListScreen, navigationOptions: { header: null}},
    TaskDetails: {screen: TaskDetailsScreen, navigationOptions: { header: null}},
    TaskSubmissionList: {screen: TaskSubmissionListScreen, navigationOptions: { header: null}},
    ClassFiles: {screen: ClassFilesScreen, navigationOptions: { header: null}},
    SubmissionDetails: {screen: SubmissionDetailsScreen, navigationOptions: { header: null}},
    SubmissionScoring: {screen: SubmissionScoringScreen, navigationOptions: { header: null}},
    ScoreDetails: {screen: ScoreDetailsScreen, navigationOptions: { header: null}},
    TaskFiles: {screen: TaskFilesScreen, navigationOptions: { header: null}},
    TaskArchiveList: {screen: TaskArchiveListScreen, navigationOptions: { header: null}},
    ArchiveSelectClass: {screen: ArchiveSelectClassScreen, navigationOptions: { header: null}},
    AddClassFiles: {screen: AddClassFilesScreen, navigationOptions: { header: null}},
    MassScoring: {screen: MassScoringScreen, navigationOptions: { header: null}},
    MyDiscussions: {screen: MyDiscussionsScreen, navigationOptions: { header: null}},
  },
  {
    initialRouteName: "TeacherHome"
  }
);

export default class TeacherNavigator extends React.PureComponent{
  static router = MyNavigator.router;
  render(){
    return (
      <TutorialClassroomProvider>
        <CurrentTeacherProvider>
          <MyNavigator navigation={this.props.navigation}/>
        </CurrentTeacherProvider>
      </TutorialClassroomProvider>
    )
  }
}