import { createStackNavigator } from "react-navigation";

import SettingsScreen from "../screens/SettingsScreen";
import AccountScreen from "../screens/AccountScreen";
import MyQRScreen from "../screens/MyQRScreen";
import EditSingleFieldScreen from "../screens/EditSingleFieldScreen";

export default SettingTabNavigator = createStackNavigator({
  Home: { screen: SettingsScreen },
  Account: { screen: AccountScreen },
  MyQR: { screen: MyQRScreen },
  SettingEditSingleFieldScreen: { screen: EditSingleFieldScreen }
}, {
  initialRouteName: "Home",
  defaultNavigationOptions: { headerStyle: { elevation: 0 } }
})