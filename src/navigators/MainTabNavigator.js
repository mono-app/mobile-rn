import React from "react";
import { createBottomTabNavigator } from "react-navigation";

import { Text } from "react-native-paper";
import { default as MaterialIcons } from "react-native-vector-icons/MaterialIcons";
import { default as FontAwesome } from "react-native-vector-icons/FontAwesome";

import HomeTabNavigator from "./HomeTabNavigator.js";
import ContactTabNavigator from "./ContactTabNavigator";
import SettingTabNavigator from "./SettingTabNavigator.js";
import AppTabNavigator from "./AppTabNavigator";
import { default as MomentTabNavigator } from "modules/Moments/navigators/MainNavigator";
import { CurrentRoomsProvider } from "src/api/rooms/CurrentRooms";
import NotificationListener from "src/components/NotificationListener"
import InAppNotifications from "src/components/InAppNotifications";

const MainTabNavigator = createBottomTabNavigator({
  HomeTab: HomeTabNavigator,
  ContactTab: ContactTabNavigator,
  AppTab: AppTabNavigator,
  MomentsTab: MomentTabNavigator,
  SettingsTab: SettingTabNavigator,
}, {
  initialRouteName: "HomeTab",
  tabBarOptions: { 
    activeTintColor: "#0EAD69",
    style: { borderTopWidth: 0, elevation: 8, height: 60, padding: 8 }
  },
  defaultNavigationOptions: ({ navigation }) => ({
    tabBarIcon: ({ focused, horizontal, tintColor }) => {
      const { routeName } = navigation.state;
      let icon;
      switch(routeName){
        case "HomeTab": icon = (<MaterialIcons name="home" size={24} color={tintColor}/>); break;
        case "ContactTab": icon = (<MaterialIcons name="contacts" size={24} color={tintColor}/>); break;
        case "AppTab": icon = (<MaterialIcons name="apps" size={24} color={tintColor}/>); break;
        case "MomentsTab": icon = (<FontAwesome name="circle-o-notch" size={24} color={tintColor}/>); break;
        case "SettingsTab": icon = (<MaterialIcons name="settings" size={24} color={tintColor}/>); break;
      }
      return icon;
    },
    tabBarLabel: ({ focused, tintColor }) => {
      const { routeName } = navigation.state;
      let label;
      switch(routeName){
        case "HomeTab": label = "Home"; break;
        case "ContactTab": label = "Contact"; break;
        case "AppTab": label = "App"; break;
        case "MomentsTab": label = "Moments"; break;
        case "SettingsTab": label = "Settings"; break;
      }
      return <Text style={{ color: tintColor, textAlign: "center" }}>{label}</Text>
    }
  })
})

export default class MainNavigator extends React.PureComponent {
  static router = MainTabNavigator.router

  render(){
    return(
    <CurrentRoomsProvider>
      <MainTabNavigator navigation={this.props.navigation}/>
      <NotificationListener/>
      <InAppNotifications type="friend-request"/>
    </CurrentRoomsProvider>
    )
  }
}