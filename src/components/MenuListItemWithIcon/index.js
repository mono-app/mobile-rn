import React from "react";
import PropTypes from "prop-types";
import { StyleSheet } from "react-native";

import { TouchableOpacity, View } from "react-native";
import { Text } from "react-native-paper";
import { default as EvilIcons } from "react-native-vector-icons/EvilIcons";

function MenuListItemWithIcon(props){
  const styles = StyleSheet.create({
    listItemContainer: {
      borderBottomWidth: 1, borderBottomColor: "#E8EEE8", backgroundColor: "white",
      flexDirection: "row", padding: 16, alignItems: "center"
    },
    listDescriptionContainer: { flex: 1, flexDirection: "row", alignItems: "center", justifyContent: "space-between" }
  })
  
  const handlePress = () => props.onPress(props.item);

  return(
    <TouchableOpacity onPress={handlePress}>
      <View style={styles.listItemContainer}>
        {props.item.icon}
        <View style={styles.listDescriptionContainer}>
          <Text style={{ marginLeft: 16 }}>{props.item.title}</Text>
          <EvilIcons name="chevron-right" size={24} style={{ color: "#5E8864" }}/>
        </View>
      </View>
    </TouchableOpacity>
  )
}

MenuListItemWithIcon.propTypes = {
  onPress: PropTypes.func, 
  item: PropTypes.shape({
    icon: PropTypes.element.isRequired,
    title: PropTypes.string.isRequired
  }).isRequired
}
MenuListItemWithIcon.defaultProps = { 
  onPress: () => {}, 
  item: { icon: null, title: "" } 
}
export default MenuListItemWithIcon;