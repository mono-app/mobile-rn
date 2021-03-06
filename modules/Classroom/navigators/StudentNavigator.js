import React from "react";
import { createStackNavigator } from "react-navigation";
import { CurrentStudentProvider } from "modules/Classroom/api/student/CurrentStudent"
import { TutorialClassroomProvider } from "modules/Classroom/api/TutorialClassroom"
import StudentHomeScreen from "modules/Classroom/screens/Student/StudentHomeScreen";
import MyProfileScreen from "modules/Classroom/screens/Student/MyProfileScreen";
import MyClassScreen from "modules/Classroom/screens/Student/MyClassScreen";
import MyArchiveClassScreen from "modules/Classroom/screens/Student/MyArchiveClassScreen";
import ClassDetailsScreen from "modules/Classroom/screens/Student/ClassDetailsScreen";
import StudentListScreen from "modules/Classroom/screens/Student/StudentListScreen";
import StudentProfileScreen from "modules/Classroom/screens/Student/StudentProfileScreen";
import ClassFilesScreen from "modules/Classroom/screens/Student/ClassFilesScreen"
import TaskListScreen from "modules/Classroom/screens/Student/TaskListScreen"
import ExpiredTaskListScreen from "modules/Classroom/screens/Student/ExpiredTaskListScreen"
import TaskDetailsScreen from "modules/Classroom/screens/Student/TaskDetailsScreen"
import TaskSubmissionListScreen from "modules/Classroom/screens/Student/TaskSubmissionListScreen"
import TaskSubmissionScreen from "modules/Classroom/screens/Student/TaskSubmissionScreen"
import AddTaskSubmissionScreen from "modules/Classroom/screens/Student/AddTaskSubmissionScreen"
import AnnouncementScreen from "modules/Classroom/screens/Student/AnnouncementScreen"
import StatusChangeScreen from "src/screens/StatusChangeScreen";
import MyDiscussionsScreen from "modules/Classroom/screens/MyDiscussionsScreen";

const MyNavigator = createStackNavigator(
  {
    StudentHome: { screen: StudentHomeScreen, navigationOptions: { header: null}},
    MyProfile: { screen: MyProfileScreen, navigationOptions: { header: null} },
    MyClass: { screen: MyClassScreen, navigationOptions: { header: null} },
    MyArchiveClass: { screen: MyArchiveClassScreen, navigationOptions: { header: null} },
    ClassDetails: { screen: ClassDetailsScreen, navigationOptions: { header: null} },
    StudentList: { screen: StudentListScreen, navigationOptions: { header: null} },
    StudentProfile: { screen: StudentProfileScreen, navigationOptions: { header: null} },
    ClassFiles: {screen: ClassFilesScreen, navigationOptions: { header: null}},
    TaskList: {screen: TaskListScreen, navigationOptions: { header: null}},
    ExpiredTaskList: {screen: ExpiredTaskListScreen, navigationOptions: { header: null}},
    TaskDetails: {screen: TaskDetailsScreen, navigationOptions: { header: null}},
    TaskSubmissionList: {screen: TaskSubmissionListScreen, navigationOptions: { header: null}},
    TaskSubmission: {screen: TaskSubmissionScreen, navigationOptions: { header: null}},
    AddTaskSubmission: {screen: AddTaskSubmissionScreen, navigationOptions: { header: null}},
    Announcement: {screen: AnnouncementScreen, navigationOptions: { header: null}},
    StatusChange: {screen: StatusChangeScreen, navigationOptions: { header: null}},
    MyDiscussions: {screen: MyDiscussionsScreen, navigationOptions: { header: null}},
  },
  {
    initialRouteName: "StudentHome"
  }
);

export default class StudentNavigator extends React.PureComponent{
  static router = MyNavigator.router;
  render(){
    return (
      <TutorialClassroomProvider>
        <CurrentStudentProvider>
          <MyNavigator navigation={this.props.navigation}/>
        </CurrentStudentProvider>
      </TutorialClassroomProvider>
    )
  }
}