import React from "react";
import { StackActions, SwitchActions } from "react-navigation";
import Navigator from "src/api/navigator";

export default class SplashClass extends React.PureComponent {

  componentDidMount(){
   
    this.props.navigation.navigate("Teacher");
  }

  render() {
    return null;
  }
}
