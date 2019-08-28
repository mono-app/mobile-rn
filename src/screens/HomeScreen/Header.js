import React from "react";
import { withNavigation } from "react-navigation";
import { Appbar, Menu } from "react-native-paper";

const INITIAL_STATE = { isMenuVisible: false }

function Header(props){
  const [ isMenuVisible, setIsMenuVisible ] = React.useState(false);

  const toggleOpen = () => setIsMenuVisible(!isMenuVisible);
  const handleMenuClose = () => setIsMenuVisible(false);
  const handleAddContactPress = () => {
    handleMenuClose();
    props.navigation.navigate("AddContact");
  }

  return(
    <Appbar.Header style={{ backgroundColor: "transparent" }}>
      <Appbar.Content></Appbar.Content>
      <Menu
        visible={isMenuVisible}
        onDismiss={handleMenuClose}
        anchor={<Appbar.Action icon="add" onPress={toggleOpen}/>}>
        <Menu.Item title="New Chat"/>
        <Menu.Item title="Add Contact" onPress={handleAddContactPress}/>
      </Menu>
    </Appbar.Header>
  )
}
export default withNavigation(Header);