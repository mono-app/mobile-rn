import React from "react";
import { View, StyleSheet, TouchableOpacity } from "react-native";
import { Avatar, Text, Paragraph } from "react-native-paper";

export default class ResultItem extends React.Component{
  render(){
    return(
      <TouchableOpacity onPress={this.props.onPress}>
        <View style={styles.userContainer}>
          <Avatar.Text size={48} label="FH" style={{ marginRight: 16 }}/>
          <View>
            <Text style={{ fontWeight: "700" }}>{this.props.name}</Text>
            <Paragraph style={{ color: "#5E8864" }}>{this.props.status || "No Status"}</Paragraph>
          </View>
        </View>
      </TouchableOpacity>
    )
  }
}

const styles = StyleSheet.create({
  userContainer: {
    padding:16,
    borderBottomWidth:1,
    borderBottomColor: "#E8EEE8",
    flexDirection: "row",
    alignItems: "center",
  }
})