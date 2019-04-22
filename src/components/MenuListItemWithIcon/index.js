import React from "react";
import { TouchableOpacity, View, StyleSheet } from "react-native";
import { Text } from "react-native-paper";
import { default as EvilIcons } from "react-native-vector-icons/EvilIcons";

export default class MenuListItemWithIcon extends React.Component{
  render(){
    return(
      <TouchableOpacity onPress={this.props.onPress}>
        <View style={styles.listItemContainer}>
          {this.props.icon}
          <View style={styles.listDescriptionContainer}>
            <Text style={{ marginLeft: 16 }}>{this.props.title}</Text>
            <EvilIcons name="chevron-right" size={24} style={{ color: "#5E8864" }}/>
          </View>
        </View>
      </TouchableOpacity>
    )
  }
}

MenuListItemWithIcon.defaultProps = {
  onPress: () => {}, icon: null, title: null
}

styles = StyleSheet.create({
  listItemContainer: {
    borderBottomWidth: 1,
    borderBottomColor: "#E8EEE8",
    backgroundColor: "white",
    flexDirection: "row",
    padding: 16,
    alignItems: "center"
  },
  listDescriptionContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between"
  }
})