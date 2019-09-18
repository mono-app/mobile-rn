import React from "react";
import { createStackNavigator } from "react-navigation";
import { CurrentStudentProvider } from "modules/Classroom/api/student/CurrentStudent"
import StudentHomeScreen from "modules/Classroom/screens/Student/StudentHomeScreen";
import MyProfileScreen from "modules/Classroom/screens/Student/MyProfileScreen";
import MyClassScreen from "modules/Classroom/screens/Student/MyClassScreen";
import MyArchiveClassScreen from "modules/Classroom/screens/Student/MyArchiveClassScreen";
import ClassDetailsScreen from "modules/Classroom/screens/Student/ClassDetailsScreen";
import StudentListScreen from "modules/Classroom/screens/Student/StudentListScreen";
import StudentProfileScreen from "modules/Classroom/screens/Student/StudentProfileScreen";
import ClassFilesScreen from "modules/Classroom/screens/Student/ClassFilesScreen"
import TaskListScreen from "modules/Classroom/screens/Student/TaskListScreen"
import TaskDetailsScreen from "modules/Classroom/screens/Student/TaskDetailsScreen"
import TaskSubmissionListScreen from "modules/Classroom/screens/Student/TaskSubmissionListScreen"
import DiscussionsScreen from "modules/Classroom/screens/DiscussionsScreen"
import DiscussionCommentScreen from "modules/Classroom/screens/DiscussionCommentScreen"
import AddDiscussionScreen from "modules/Classroom/screens/AddDiscussionScreen"
import TaskSubmissionScreen from "modules/Classroom/screens/Student/TaskSubmissionScreen"
import AddTaskSubmissionScreen from "modules/Classroom/screens/Student/AddTaskSubmissionScreen"
import AnnouncementScreen from "modules/Classroom/screens/Student/AnnouncementScreen"
import StatusChangeScreen from "src/screens/StatusChangeScreen";
import ShareDiscussionScreen from "modules/Classroom/screens/ShareDiscussionScreen"

const MyNavigator = createStackNavigator(
  {
    StudentHome: { screen: StudentHomeScreen },
    MyProfile: { screen: MyProfileScreen },
    MyClass: { screen: MyClassScreen },
    MyArchiveClass: { screen: MyArchiveClassScreen },
    ClassDetails: { screen: ClassDetailsScreen },
    StudentList: { screen: StudentListScreen },
    StudentProfile: { screen: StudentProfileScreen },
    ClassFiles: {screen: ClassFilesScreen},
    TaskList: {screen: TaskListScreen},
    TaskDetails: {screen: TaskDetailsScreen},
    TaskSubmissionList: {screen: TaskSubmissionListScreen},
    Discussions: {screen: DiscussionsScreen},
    DiscussionComment: {screen: DiscussionCommentScreen},
    AddDiscussion: {screen: AddDiscussionScreen},
    TaskSubmission: {screen: TaskSubmissionScreen},
    AddTaskSubmission: {screen: AddTaskSubmissionScreen},
    Announcement: {screen: AnnouncementScreen},
    StatusChange: {screen: StatusChangeScreen},
    ShareDiscussion: {screen: ShareDiscussionScreen},

  },
  {
    initialRouteName: "StudentHome"
  }
);

export default class StudentNavigator extends React.PureComponent{
  static router = MyNavigator.router;
  render(){
    return (
      <CurrentStudentProvider>
        <MyNavigator navigation={this.props.navigation}/>
      </CurrentStudentProvider>
    )
  }
}