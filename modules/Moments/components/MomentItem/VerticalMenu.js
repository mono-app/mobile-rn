import React from "react";
import PropTypes from "prop-types";

import { Menu } from "react-native-paper";
import { TouchableOpacity } from "react-native";
import { default as MaterialCommunityIcons } from "react-native-vector-icons/MaterialCommunityIcons";

function VerticalMenu(props){
  const [ isVisible, setIsVisible ] = React.useState(false);

  const toggleOpen = () => setIsVisible(!isVisible);
  const handleMenuClose = () => setIsVisible(false);
  const handleDeleteMomentPress = () => {
    handleMenuClose();
    props.onDeleteMomentPress();
  }

  return (
    <Menu 
      visible={isVisible} onDismiss={handleMenuClose}
      anchor={
        <TouchableOpacity onPress={toggleOpen}>
          <MaterialCommunityIcons name="dots-vertical" size={24} style={{padding:4}}/>
        </TouchableOpacity>
      }>
      <Menu.Item title="Delete Moment" onPress={handleDeleteMomentPress}/>
    </Menu>
  );
}

VerticalMenu.propTypes = {
  onDeleteMomentPress: PropTypes.func.isRequired
}
VerticalMenu.defaultProps = { onDeleteMomentPress: () => {} }
export default VerticalMenu;