import React from "react";
import { View } from "react-native";
import { Text } from "react-native-paper";

export default class SchoolAdminHomeScreen extends React.Component{
  static navigationOptions = { header: null }
  render(){
    return(
      <View>
        <Text>This is School Admin Home Screen</Text>
      </View>
    )
  }
}