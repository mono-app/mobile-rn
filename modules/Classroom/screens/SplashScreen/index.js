import React from "react";
import { StackActions, SwitchActions } from "react-navigation";
import Navigator from "src/api/navigator";

export default class SplashClass extends React.PureComponent {

  componentDidMount(){
    // const navigator = new Navigator(this.props.navigation);

    // navigator.navigateTo("Teacher", {backBehavior: "order"});
    this.props.navigation.navigate("Teacher");
  }

  render() {
    return null;
  }
}
