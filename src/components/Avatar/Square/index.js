import React from "react";
import { Image, StyleSheet } from "react-native";

export default class SquareAvatar extends React.Component{
  render(){
    return(
      <Image style={styles.profilePicture} source={this.props.source}/>
    )
  }
}

const styles = StyleSheet.create({
  profilePicture: { width: 70,  height: 70, borderRadius: 8, marginRight: 16 },
})