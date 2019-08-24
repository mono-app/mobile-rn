import { createStackNavigator } from "react-navigation";

import SplashScreen from "src/screens/SplashScreen";
import AccountSetupScreen from "src/screens/SignUpScreen/AccountSetup";
import SignInScreen from 'src/screens/SignInScreen';

import SignUpScreen from "src/screens/SignUpScreen";
import VerifyPhoneScreen from "src/screens/SignUpScreen/VerifyPhoneScreen";

import MainTabNavigator from "src/navigators/MainTabNavigator";

export default createStackNavigator({
  Splash: { screen: SplashScreen },
  AccountSetup: { screen: AccountSetupScreen },
  SignIn: { screen: SignInScreen },
  SignUp: { screen: SignUpScreen },
  VerifyPhone: { screen: VerifyPhoneScreen },
  MainTabNavigator: { screen: MainTabNavigator, navigationOptions: { header: null }}
}, { initialRouteName: "Splash", defaultNavigationOptions: { header: null } });

