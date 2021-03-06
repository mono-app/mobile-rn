import { createStackNavigator } from "react-navigation";

import HomeScreen from "modules/Moments/screens/HomeScreen";
import AddMomentScreen from "modules/Moments/screens/AddMomentScreen";
import MomentCommentsScreen from "modules/Moments/screens/CommentsScreen";
import ShareMomentScreen from "modules/Moments/screens/ShareMomentScreen";
import PhotoGridPreviewScreen from "modules/Moments/screens/PhotoGridPreviewScreen";
import DiscussionClassroomNotifNavigatorObj from "modules/Classroom/navigators/DiscussionClassroomNotifNavigatorObj"
import PeopleInformationScreen from "src/screens/PeopleInformationScreen";

export default MainNavigator = createStackNavigator({
  Home: { screen: HomeScreen, navigationOptions: { header: null } },
  AddMoment: { screen: AddMomentScreen, navigationOptions: { header: null }  },
  MomentComments: { screen: MomentCommentsScreen, navigationOptions: { header: null }  },
  ShareMoment: { screen: ShareMomentScreen, navigationOptions: { header: null }  },
  PhotoGridPreview: { screen: PhotoGridPreviewScreen },
  PeopleInformation: { screen: PeopleInformationScreen, navigationOptions: { header: null }  },
  ...DiscussionClassroomNotifNavigatorObj
}, {
  initialRouteName: "Home",
  navigationOptions: ({ navigation }) => {
    const { routeName } = navigation.state.routes[navigation.state.index];
    return { tabBarVisible: routeName !== "MomentComments" && routeName !== "MapsPicker" && routeName !== "GallerySwiper" }
  }
})