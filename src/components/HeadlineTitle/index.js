import React from "react";
import { StyleSheet } from "react-native";
import { Headline } from "react-native-paper";

export default function HeadlineTitle(props){
  const styles = StyleSheet.create({
    default: { fontSize: 36, lineHeight: 48, fontWeight: "900" }
  });

  return <Headline style={[ styles.default, props.style ]}>{props.children}</Headline>
}