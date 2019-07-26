import React from "react";
import { Appbar, Menu } from "react-native-paper";

const INITIAL_STATE = { isMenuVisible: false }

export default class Header extends React.PureComponent{
 
  handleBackPress = () => this.props.navigation.dismiss();
  
  constructor(props){
    super(props);
    this.state = INITIAL_STATE;
    this.handleBackPress = this.handleBackPress.bind(this);
  }

  render(){
    return(
      <Appbar.Header style={{ backgroundColor: "white" }}>
          <Appbar.BackAction onPress={this.handleBackPress}/>
        <Appbar.Content title={this.props.title}/>
      </Appbar.Header>
    )
  }
}