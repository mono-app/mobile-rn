import { createSwitchNavigator, createStackNavigator } from "react-navigation";
import SplashScreen from "modules/Classroom/screens/SplashScreen";
import SchoolAdminNavigator from "./SchoolAdminNavigator";
import TeacherNavigator from "./TeacherNavigator";
import StudentNavigator from "./StudentNavigator";
import IntroductionScreen from "modules/Classroom/screens/IntroductionScreen";

const IntroductionNavigator = createStackNavigator(
  {
    Introduction: { screen: IntroductionScreen },
  },
  {
    initialRouteName: "Introduction"
  }
);
export default ClassroomNavigator = createSwitchNavigator(
  {
    Splash: { screen: SplashScreen },
    Introduction: { screen: IntroductionNavigator },
    SchoolAdmin : { screen: SchoolAdminNavigator },
    Teacher : { screen: TeacherNavigator },
    Student : { screen: StudentNavigator },
  },
  {
    initialRouteName: "Splash"
  }
);
