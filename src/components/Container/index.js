import React from "react";
import { View } from "react-native";

export default function Container(props){
  return (
    <View style={{ display: "flex", flexDirection: "column", flexGrow: 1 }}>
      {props.children}
    </View>
  )
}