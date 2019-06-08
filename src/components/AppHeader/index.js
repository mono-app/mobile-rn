import React from "react";
import { Appbar } from "react-native-paper";

export default class AppHeader extends React.PureComponent{
  handleBackPress = () => this.props.navigation.goBack();

  constructor(props){
    super(props);
    this.handleBackPress = this.handleBackPress.bind(this);
  }

  render(){
    return(
      <Appbar.Header style={this.props.style}>
        <Appbar.BackAction onPress={this.handleBackPress}/>
        <Appbar.Content title={this.props.title}/>
      </Appbar.Header>
    )
  }
}

AppHeader.defaultProps = { navigation: null, title: null, style: null }