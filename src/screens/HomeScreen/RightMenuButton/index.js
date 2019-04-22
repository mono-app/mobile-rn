import React from "react";
import { TouchableOpacity, StyleSheet } from "react-native";
import Menu, { MenuItem } from 'react-native-material-menu';
import { default as MaterialCommunityIcons } from "react-native-vector-icons/MaterialCommunityIcons";


export default class RightMenuButton extends React.Component{
  handleMenuPress = () => this.menuButton.show();
  handleAddContact = () => {
    this.menuButton.hide();
    this.props.navigation.navigate("HomeAddContact", { sourceTabName: "Home" });
  }

  constructor(props){
    super(props);

    this.handleMenuPress = this.handleMenuPress.bind(this);
    this.handleAddContact = this.handleAddContact.bind(this);
  }

  render(){
    const rightMenuButton = (
      <TouchableOpacity style={{ marginRight: 16 }} onPress={this.handleMenuPress}>
        <MaterialCommunityIcons name="plus-circle-outline" size={24}/>
      </TouchableOpacity>
    )

    return(
      <Menu ref={i => this.menuButton = i} button={rightMenuButton}>
        <MenuItem>New Chat</MenuItem>
        <MenuItem onPress={this.handleAddContact}>Add Contact</MenuItem>     
      </Menu>
    )
  }
}

const styles = StyleSheet.create({
})