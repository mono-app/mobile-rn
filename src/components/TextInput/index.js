import React from "react";
import { TextInput as InputBox, StyleSheet } from "react-native";

function TextInput(props){
  const styles = StyleSheet.create({
    textInput: {
      marginBottom: 16, padding: 8, paddingLeft: 16, paddingRight: 16,
      backgroundColor: "white", borderWidth: 1, borderColor: '#E8EEE8', borderRadius: 8,
    }
  });

  const remainingProps = Object.assign({}, props);
  delete remainingProps.style;
  return <InputBox style={[ styles.textInput, props.style ]} {...remainingProps}/>
}
export default TextInput;
