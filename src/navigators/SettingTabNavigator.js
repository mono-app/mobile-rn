import { createStackNavigator } from "react-navigation";

import SettingsScreen from "src/screens/SettingsScreen";
import AccountScreen from "src/screens/AccountScreen";
import MyQRScreen from "src/screens/MyQRScreen";
import EditSingleFieldScreen from "src/screens/EditSingleFieldScreen";
import StatusChangeScreen from "src/screens/StatusChangeScreen";
import DiscussionClassroomNotifNavigatorObj from "modules/Classroom/navigators/DiscussionClassroomNotifNavigatorObj"
import ScanQRCodeScreen from "src/screens/ScanQRCodeScreen";
import PeopleInformationScreen from "src/screens/PeopleInformationScreen";
import PrivacyScreen from "src/screens/PrivacyScreen";
import BlockedUsersScreen from "src/screens/BlockedUsersScreen";
import HiddenUsersScreen from "src/screens/HiddenUsersScreen";
import MomentNavigatorObj from "modules/Moments/navigators/MomentNavigatorObj";
import ChatSettingsScreen from "src/screens/ChatSettingsScreen"
import GeneralSettingsScreen from "src/screens/GeneralSettingsScreen"
import ChatSolidColorPickerScreen from "src/screens/ChatSolidColorPickerScreen"
import ContactSupportScreen from "src/screens/ContactSupportScreen";
import HelpScreen from "src/screens/HelpScreen";

export default SettingTabNavigator = createStackNavigator({
  Home: { screen: SettingsScreen, navigationOptions: { header: null } },
  Account: { screen: AccountScreen, navigationOptions: { header: null }},
  Privacy: {screen: PrivacyScreen, navigationOptions: { header: null }},
  ChatSettings: {screen: ChatSettingsScreen, navigationOptions: { header: null }},
  GeneralSettings: {screen: GeneralSettingsScreen, navigationOptions: { header: null }},
  BlockedUsers: {screen: BlockedUsersScreen, navigationOptions: { header: null }},
  HiddenUsers: {screen: HiddenUsersScreen, navigationOptions: { header: null }},
  MyQR: { screen: MyQRScreen, navigationOptions: { header: null }},
  Help: { screen: HelpScreen, navigationOptions: { header: null }},
  ChatSolidColorPicker: { screen: ChatSolidColorPickerScreen, navigationOptions: { header: null } },
  ScanQRCode: { screen: ScanQRCodeScreen, navigationOptions: { header: null }},
  ContactSupport: { screen: ContactSupportScreen, navigationOptions: { header: null} },
  PeopleInformation: { screen: PeopleInformationScreen, navigationOptions: { header: null }},
  EditSingleField: { screen: EditSingleFieldScreen, navigationOptions: { header: null } },
  StatusChange: { screen: StatusChangeScreen, navigationOptions: { header: null } },
  ...DiscussionClassroomNotifNavigatorObj,
  ...MomentNavigatorObj
}, {
  initialRouteName: "Home",
  navigationOptions: ({ navigation }) => {
    const { routeName } = navigation.state.routes[navigation.state.index];
    return { tabBarVisible: (routeName !== "MapsPicker"  && routeName !== "GallerySwiper") }
  }
})