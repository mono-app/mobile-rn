import { createStackNavigator } from "react-navigation";

import HomeScreen from "modules/Moments/screens/HomeScreen";
import AddMomentScreen from "modules/Moments/screens/AddMomentScreen";
import GalleryScreen from "modules/Moments/screens/GalleryScreen";
import MomentCommentsScreen from "modules/Moments/screens/CommentsScreen";
import ShareMomentScreen from "modules/Moments/screens/ShareMomentScreen";
import PhotoGridPreviewScreen from "modules/Moments/screens/PhotoGridPreviewScreen";
import DiscussionClassroomNotifNavigatorObj from "modules/Classroom/navigators/DiscussionClassroomNotifNavigatorObj"

export default MainNavigator = createStackNavigator({
  Home: { screen: HomeScreen },
  AddMoment: { screen: AddMomentScreen },
  Gallery: { screen: GalleryScreen },
  MomentComments: { screen: MomentCommentsScreen },
  ShareMoment: { screen: ShareMomentScreen },
  PhotoGridPreview: { screen: PhotoGridPreviewScreen },
  ...DiscussionClassroomNotifNavigatorObj
}, {
  initialRouteName: "Home",
  navigationOptions: ({ navigation }) => {
    const { routeName } = navigation.state.routes[navigation.state.index];
    return { tabBarVisible: routeName !== "MomentComments" && routeName !== "MapsPicker" && routeName !== "GallerySwiper" }
  }
})