import React from "react";
import { Appbar, Menu } from "react-native-paper";

const INITIAL_STATE = { isMenuVisible: false }

export default class Header extends React.PureComponent{
  toggleOpen = () => this.setState({ isMenuVisible: !this.state.isMenuVisible })
  handleMenuClose = () => this.setState({ isMenuVisible: false });
  handleAddContactPress = () => {
    this.handleMenuClose();
    this.props.navigation.navigate("AddContact");
  }
  
  constructor(props){
    super(props);

    this.state = INITIAL_STATE;
    this.toggleOpen = this.toggleOpen.bind(this);
    this.handleMenuClose = this.handleMenuClose.bind(this);
    this.handleAddContactPress = this.handleAddContactPress.bind(this);
  }

  render(){
    return(
      <Appbar.Header style={{ backgroundColor: "transparent" }}>
        <Appbar.Content title="All Chats"/>
        <Menu
          visible={this.state.isMenuVisible}
          onDismiss={this.handleMenuClose}
          anchor={<Appbar.Action icon="add" onPress={this.toggleOpen}/>}>
          <Menu.Item title="New Chat"/>
          <Menu.Item title="Add Contact" onPress={this.handleAddContactPress}/>
        </Menu>
      </Appbar.Header>
    )
  }
}