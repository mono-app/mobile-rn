import React from "react";
import { withNavigation } from "react-navigation";
import { Appbar, Menu, Text } from "react-native-paper";
import Tooltip from 'react-native-walkthrough-tooltip';
import Icon from 'react-native-vector-icons/FontAwesome';
import { withTranslation } from 'react-i18next';

function Header(props){
  const [ isMenuVisible, setIsMenuVisible ] = React.useState(false);

  const toggleOpen = () => setIsMenuVisible(!isMenuVisible);
  const handleMenuClose = () => setIsMenuVisible(false);
  const handleAddContactPress = () => {
    handleMenuClose();
    props.navigation.navigate("AddContact");
  }

  React.useEffect(() => {
  }, [])

  return(
    <Appbar.Header style={{ backgroundColor: "transparent" }}>
      <Appbar.Content></Appbar.Content>
      <Tooltip
        isVisible={props.showTutorialHomeAddContact}
        placement="bottom"
        showChildInTooltip={false}
        content={<Text>{props.t("addFriendHelpLabel")}</Text>}
        onClose={() => props.homeScreenTutorial.show(2)}>
        <Icon name="user-plus" style={{marginRight: 16}} size={22} onPress={handleAddContactPress}/> 
      </Tooltip>
        {/* <Menu
          visible={isMenuVisible}
          onDismiss={handleMenuClose}
          anchor={<Appbar.Action icon="add" onPress={toggleOpen}/>}>
          <Menu.Item title="New Chat"/>
          <Menu.Item title="Add Contact" onPress={handleAddContactPress}/>
        </Menu> */}
    </Appbar.Header>
  )
}
export default withTranslation()(withNavigation(Header))