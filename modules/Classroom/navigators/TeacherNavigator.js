import React from "react";
import { createStackNavigator } from "react-navigation";
import { CurrentTeacherProvider } from "modules/Classroom/api/teacher/CurrentTeacher"

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
import DiscussionsScreen from "modules/Classroom/screens/DiscussionsScreen"
import DiscussionCommentScreen from "modules/Classroom/screens/DiscussionCommentScreen"
import AddDiscussionScreen from "modules/Classroom/screens/AddDiscussionScreen"
import ScoreDetailsScreen from "modules/Classroom/screens/Teacher/ScoreDetailsScreen"
import TaskFilesScreen from "modules/Classroom/screens/Teacher/TaskFilesScreen"
import TaskArchiveListScreen from "modules/Classroom/screens/Teacher/TaskArchiveListScreen"
import ArchiveSelectClassScreen from "modules/Classroom/screens/Teacher/ArchiveSelectClassScreen"
import AddClassFilesScreen from "modules/Classroom/screens/Teacher/AddClassFilesScreen"
import MassScoringScreen from "modules/Classroom/screens/Teacher/MassScoringScreen"
import ShareDiscussionScreen from "modules/Classroom/screens/ShareDiscussionScreen"
import DiscussionNavigatorObj from "./DiscussionNavigatorObj"

const MyNavigator = createStackNavigator(
  {
    TeacherHome: { screen: TeacherHomeScreen },
    EditSingleField: { screen: EditSingleFieldScreen },
    EditTaskSingleField: { screen: EditTaskSingleFieldScreen },
    MyProfile: { screen: MyProfileScreen },
    StatusChange : { screen: StatusChangeScreen },
    MyClass : { screen: MyClassScreen },
    ClassProfile : { screen: ClassProfileScreen },
    StudentList : { screen: StudentListScreen },
    StudentProfile : { screen: StudentProfileScreen },
    AddTask: {screen: AddTaskScreen},
    AddTaskClassPicker: {screen: AddTaskClassPickerScreen},
    TaskList: {screen: TaskListScreen},
    TaskDetails: {screen: TaskDetailsScreen},
    TaskSubmissionList: {screen: TaskSubmissionListScreen},
    ClassFiles: {screen: ClassFilesScreen},
    SubmissionDetails: {screen: SubmissionDetailsScreen},
    SubmissionScoring: {screen: SubmissionScoringScreen},
    ScoreDetails: {screen: ScoreDetailsScreen},
    TaskFiles: {screen: TaskFilesScreen},
    TaskArchiveList: {screen: TaskArchiveListScreen},
    ArchiveSelectClass: {screen: ArchiveSelectClassScreen},
    AddClassFiles: {screen: AddClassFilesScreen},
    MassScoring: {screen: MassScoringScreen},

  },
  {
    initialRouteName: "TeacherHome"
  }
);

export default class TeacherNavigator extends React.PureComponent{
  static router = MyNavigator.router;
  render(){
    return (
      <CurrentTeacherProvider>
        <MyNavigator navigation={this.props.navigation}/>
      </CurrentTeacherProvider>
    )
  }
}