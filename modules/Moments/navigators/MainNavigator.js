import { createStackNavigator } from "react-navigation";
import HomeScreen from "../screens/HomeScreen";
import AddMomentScreen from "../screens/AddMomentScreen";
import GalleryScreen from "../screens/GalleryScreen";
import CommentsScreen from "../screens/CommentsScreen";

export default MainNavigator = createStackNavigator({
  Home: { screen: HomeScreen },
  AddMoment: { screen: AddMomentScreen },
  Gallery: { screen: GalleryScreen },
  Comments: { screen: CommentsScreen }
}, {
  initialRouteName: "Home",
  defaultNavigationOptions: { headerStyle: { elevation: 0 } },
  navigationOptions: ({ navigation }) => {
    const { routeName } = navigation.state.routes[navigation.state.index];
    return { tabBarVisible: routeName !== "Comments" }
  }
})