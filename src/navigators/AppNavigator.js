import { createStackNavigator } from "react-navigation";

import SplashScreen from "src/screens/SplashScreen";
import SignInScreen from 'src/screens/SignInScreen';

import AccountSetupScreen from "src/screens/AccountSetupScreen";
import ApplicationInformationSetupScreen from "src/screens/ApplicationInformationSetupScreen";
import PersonalInformationSetupScreen from "src/screens/PersonalInformationSetupScreen";

import SignUpScreen from "src/screens/SignUpScreen";
import VerifyPhoneScreen from "src/screens/SignUpScreen/VerifyPhoneScreen";

import MainTabNavigator from "src/navigators/MainTabNavigator";

export default createStackNavigator({
  Splash: { screen: SplashScreen },
  AccountSetup: { screen: AccountSetupScreen },
  ApplicationInformationSetup: { screen: ApplicationInformationSetupScreen },
  PersonalInformationSetup: { screen: PersonalInformationSetupScreen },
  SignIn: { screen: SignInScreen },
  SignUp: { screen: SignUpScreen },
  VerifyPhone: { screen: VerifyPhoneScreen },
  MainTabNavigator: { screen: MainTabNavigator, navigationOptions: { header: null }}
}, { initialRouteName: "Splash", defaultNavigationOptions: { header: null } });

