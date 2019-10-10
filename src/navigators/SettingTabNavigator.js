import { createStackNavigator } from "react-navigation";

import SettingsScreen from "src/screens/SettingsScreen";
import AccountScreen from "src/screens/AccountScreen";
import MyQRScreen from "src/screens/MyQRScreen";
import EditSingleFieldScreen from "src/screens/EditSingleFieldScreen";
import StatusChangeScreen from "src/screens/StatusChangeScreen";
import DiscussionClassroomNotifNavigatorObj from "modules/Classroom/navigators/DiscussionClassroomNotifNavigatorObj"
import ScanQRCodeSCreen from "src/screens/ScanQRCodeScreen";
import PeopleInformationScreen from "src/screens/PeopleInformationScreen";
import PrivacyScreen from "src/screens/PrivacyScreen";
import BlockedUsersScreen from "src/screens/BlockedUsersScreen";
import HiddenUsersScreen from "src/screens/HiddenUsersScreen";

export default SettingTabNavigator = createStackNavigator({
  Home: { screen: SettingsScreen },
  Account: { screen: AccountScreen },
  Privacy: {screen: PrivacyScreen},
  BlockedUsers: {screen: BlockedUsersScreen},
  HiddenUsers: {screen: HiddenUsersScreen},
  MyQR: { screen: MyQRScreen },
  ScanQRCode: { screen: ScanQRCodeSCreen },
  PeopleInformation: { screen: PeopleInformationScreen },
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