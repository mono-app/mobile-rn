import React from "react";
import { View, StyleSheet } from "react-native";
import { Text } from "react-native-paper";

/**
 * @param {string} fieldName
 * @param {string} fieldValue
 */
export default class PeopleInformationContainer extends React.PureComponent{
  render(){
    return(
      <View style={styles.additionalInformationContainer}>
        <Text style={{ flex: 2, fontWeight: "500" }}>{this.props.fieldName}</Text>
        <Text style={{ flex: 3, color: "#5E8864" }}>{this.props.fieldValue}</Text>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  additionalInformationContainer: { 
    backgroundColor: "white",
    alignItems: "center",
    flexDirection: "row", 
    borderBottomWidth: 1,
    borderBottomColor: "#E8EEE8",
    padding: 16,
    paddingLeft: 16,
    paddingRight: 16
  }
})