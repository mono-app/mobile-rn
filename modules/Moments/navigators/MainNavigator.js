import { createStackNavigator } from "react-navigation";
import HomeScreen from "../screens/HomeScreen";
import AddMomentScreen from "../screens/AddMomentScreen";

export default MainNavigator = createStackNavigator({
  Home: { screen: HomeScreen },
  AddMoment: { screen: AddMomentScreen }
}, {
  initialRouteName: "AddMoment",
  defaultNavigationOptions: { headerStyle: { elevation: 0 } },
})