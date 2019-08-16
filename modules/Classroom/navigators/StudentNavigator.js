import React from "react";
import { createStackNavigator } from "react-navigation";

import StudentHomeScreen from "modules/Classroom/screens/Student/StudentHomeScreen";
import MyProfileScreen from "modules/Classroom/screens/Student/MyProfileScreen";
import MyClassesScreen from "modules/Classroom/screens/Student/MyClassesScreen";
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
import GallerySwiperScreen from "modules/Classroom/screens/GallerySwiperScreen"

export default StudentNavigator = createStackNavigator(
  {
    StudentHome: { screen: StudentHomeScreen },
    MyProfile: { screen: MyProfileScreen },
    MyClasses: { screen: MyClassesScreen },
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
    GallerySwiper: {screen: GallerySwiperScreen},

  },
  {
    initialRouteName: "StudentHome"
  }
);