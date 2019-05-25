import { createStackNavigator } from "react-navigation";

import SettingsScreen from "src/screens/SettingsScreen";
import AccountScreen from "src/screens/AccountScreen";
import MyQRScreen from "src/screens/MyQRScreen";
import EditSingleFieldScreen from "src/screens/EditSingleFieldScreen";
import StatusChangeScreen from "src/screens/StatusChangeScreen";
import GalleryScreen from "src/screens/GalleryScreen";

export default SettingTabNavigator = createStackNavigator({
  Home: { screen: SettingsScreen },
  Account: { screen: AccountScreen },
  MyQR: { screen: MyQRScreen },
  EditSingleField: { screen: EditSingleFieldScreen },
  SettingEditSingleFieldScreen: { screen: EditSingleFieldScreen },
  StatusChange: { screen: StatusChangeScreen },
  Gallery: { screen: GalleryScreen }
}, {
  initialRouteName: "Home",
  defaultNavigationOptions: { headerStyle: { elevation: 0 } }
})