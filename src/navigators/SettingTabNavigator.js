import { createStackNavigator } from "react-navigation";

import SettingsScreen from "src/screens/SettingsScreen";
import AccountScreen from "src/screens/AccountScreen";
import MyQRScreen from "src/screens/MyQRScreen";
import EditSingleFieldScreen from "src/screens/EditSingleFieldScreen";
import StatusChangeScreen from "src/screens/StatusChangeScreen";
import DiscussionClassroomNotifNavigatorObj from "modules/Classroom/navigators/DiscussionClassroomNotifNavigatorObj"

export default SettingTabNavigator = createStackNavigator({
  Home: { screen: SettingsScreen },
  Account: { screen: AccountScreen },
  MyQR: { screen: MyQRScreen },
  EditSingleField: { screen: EditSingleFieldScreen },
  SettingEditSingleFieldScreen: { screen: EditSingleFieldScreen },
  StatusChange: { screen: StatusChangeScreen },
  ...DiscussionClassroomNotifNavigatorObj
}, {
  initialRouteName: "Home",
  navigationOptions: ({ navigation }) => {
    const { routeName } = navigation.state.routes[navigation.state.index];
    return { tabBarVisible: (routeName !== "MapsPicker"  && routeName !== "GallerySwiper") }
  }
})