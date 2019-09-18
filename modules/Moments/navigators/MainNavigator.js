import { createStackNavigator } from "react-navigation";

import HomeScreen from "modules/Moments/screens/HomeScreen";
import AddMomentScreen from "modules/Moments/screens/AddMomentScreen";
import GalleryScreen from "modules/Moments/screens/GalleryScreen";
import CommentsScreen from "modules/Moments/screens/CommentsScreen";
import PhotoGridPreviewScreen from "modules/Moments/screens/PhotoGridPreviewScreen";
import CameraScreen from "src/screens/CameraScreen";
import QuickCameraScreen from "modules/Moments/screens/QuickCameraScreen";


export default MainNavigator = createStackNavigator({
  Home: { screen: HomeScreen },
  AddMoment: { screen: AddMomentScreen },
  Gallery: { screen: GalleryScreen },
  Comments: { screen: CommentsScreen },
  PhotoGridPreview: { screen: PhotoGridPreviewScreen },
  CameraMoment: {screen: CameraScreen},
  QuickCameraMoment: {screen: QuickCameraScreen},
}, {
  initialRouteName: "Home",
  navigationOptions: ({ navigation }) => {
    const { routeName } = navigation.state.routes[navigation.state.index];
    return { tabBarVisible: routeName !== "Comments" && routeName !== "QuickCameraMoment" }
  }
})