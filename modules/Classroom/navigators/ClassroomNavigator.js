import { createSwitchNavigator, createStackNavigator } from "react-navigation";
import SplashScreen from "modules/Classroom/screens/SplashScreen";
import SchoolAdminNavigator from "./SchoolAdminNavigator";
import TeacherNavigator from "./TeacherNavigator";
import StudentNavigator from "./StudentNavigator";

export default ClassroomNavigator = createSwitchNavigator(
  {
    Splash: { screen: SplashScreen },
    SchoolAdmin : { screen: SchoolAdminNavigator },
    Teacher : { screen: TeacherNavigator },
    Student : { screen: StudentNavigator },
  },
  {
    initialRouteName: "Splash"
  }
);
