import React from "react";
import { TextInput as InputBox, StyleSheet } from "react-native";

export default class TextInput extends React.Component{
  render(){
    return(
      <InputBox style={styles.textInput} {...this.props}/>
    )
  }
}

export const styles = StyleSheet.create({
  textInput: {
    marginBottom: 16,
    padding: 8,
    paddingLeft: 16,
    paddingRight: 16,
    backgroundColor: "white",
    borderWidth: 1,
    borderColor: '#E8EEE8',
    borderRadius: 8,
  }
})
