import React from "react";
import { createStackNavigator } from "react-navigation";

import SplashScreen from "../screens/SplashScreen";
import AccountSetupScreen from "../screens/SignUpScreen/AccountSetup";
import SignInScreen from '../screens/SignInScreen';

import SignUpScreen from "../screens/SignUpScreen";
import VerifyPhoneScreen from "../screens/SignUpScreen/VerifyPhoneScreen";

import MainTabNavigator from "./MainTabNavigator";

export default AppNavigator = createStackNavigator({
  Splash: { screen: SplashScreen },
  AccountSetup: { screen: AccountSetupScreen },
  SignIn: { screen: SignInScreen },
  SignUp: { screen: SignUpScreen },
  VerifyPhone: { screen: VerifyPhoneScreen },
  MainTabNavigator: { screen: MainTabNavigator, navigationOptions: { header: null }}
}, { initialRouteName: "Splash" });

