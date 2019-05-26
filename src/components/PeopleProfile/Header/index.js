import React from "react";
import { View, StyleSheet } from "react-native";
import { Text } from "react-native-paper";

import SquareAvatar from "src/components/Avatar/Square";

/**
 * @param {string} nickName
 * @param {string} status
 */
export default class PeopleProfileHeader extends React.Component{
  render(){
    return(
      <View style={styles.profileContainer}>
        <SquareAvatar source={{uri: this.props.profilePicture, cache:"force-cahce" }} />
        <View style={styles.profileDescriptionContainer}>
          <Text style={{ fontSize: 16, fontWeight: "500", marginBottom: 4}}>{this.props.nickName}</Text>
          <Text style={{ fontSize: 12}}>{this.props.status}</Text>
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  profileContainer: {
    backgroundColor: "white",
    flexDirection: "row",
    alignItems: "flex-start",
    padding: 16,
    paddingTop: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#E8EEE8"
  },
  profileDescriptionContainer: { width: 0, flexGrow: 1 },
})