import { createSwitchNavigator } from "react-navigation";
import SplashScreen from "modules/Classroom/screens/SplashScreen";
import SchoolAdminNavigator from "./SchoolAdminNavigator";
import TeacherNavigator from "./TeacherNavigator";
import StudentNavigator from "./StudentNavigator";
import NotificationNavigator from "./NotificationNavigator";
import DiscussionCommentScreen from "modules/Classroom/screens/DiscussionCommentScreen"

export default ClassroomNavigator = createSwitchNavigator(
  {
    Splash: { screen: SplashScreen },
    SchoolAdmin : { screen: SchoolAdminNavigator },
    Teacher : { screen: TeacherNavigator },
    Student : { screen: StudentNavigator },
    DiscussionComment: {screen: DiscussionCommentScreen},
    NotificationClassroom: {screen: NotificationNavigator},
  },
  {
    initialRouteName: "Splash"
  }
);
