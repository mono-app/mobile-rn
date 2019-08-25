import React from "react";
import PropTypes from "prop-types";

import SquareAvatar from "src/components/Avatar/Square";
import { View, StyleSheet } from "react-native";
import { Text } from "react-native-paper";

/**
 * @param {string} nickName
 * @param {string} status
 */
export default function PeopleProfileHeader(props){
  const styles = StyleSheet.create({
    profileDescriptionContainer: { width: 0, flexGrow: 1 },
    profileContainer: {
      backgroundColor: "white", flexDirection: "row",
      alignItems: "flex-end", padding: 16, paddingTop: 8,
      borderBottomWidth: 1, borderBottomColor: "#E8EEE8"
    }
  })

  return(
    <View style={styles.profileContainer}>
      <SquareAvatar uri={props.profilePicture} style={{ marginRight: 16 }}/>
      <View style={styles.profileDescriptionContainer}>
        <Text style={{ fontSize: 16, fontWeight: "500", marginBottom: 4}}>{props.title}</Text>
        <Text style={{ fontSize: 12}}>{props.subtitle}</Text>
      </View>
    </View>
  )
}

PeopleProfileHeader.propTypes = { 
  profilePicture: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  subtitle: PropTypes.string
}
PeopleProfileHeader.defaultProps = { profilePicture: "", title: "", subtitle: "" }