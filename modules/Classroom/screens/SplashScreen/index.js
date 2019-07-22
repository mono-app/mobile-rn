import React from "react";
import { StackActions } from "react-navigation";
import Navigator from "src/api/navigator";

export default class SplashClass extends React.PureComponent {

  async componentDidMount(){
    const navigator = new Navigator(this.props.navigation);

    navigator.resetTo("SchoolAdminHome", StackActions);
  }

  render() {
    return null;
  }
}
