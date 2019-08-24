import React from "react";
import { withTheme } from "react-native-paper";

import { Text, TouchableOpacity, StyleSheet, ActivityIndicator } from "react-native";

function Button(props){
  const styles = StyleSheet.create({
    button: {
      marginBottom: 16,
      alignItems: 'center',
      backgroundColor: props.theme.colors.primary,
      padding: 16,
      paddingLeft: 32,
      paddingRight: 32,
      borderWidth: 1,
      borderColor: '#fff',
      borderRadius: 8,
    }
  })

  return(
    <TouchableOpacity
      style={{ ...styles.button, ...props.style }}
      onPress={props.onPress}>
      {props.isLoading?(
        <ActivityIndicator size="small" color="white"/>
      ):(
        <Text style={{ color: 'white', fontWeight: '500' }}>{props.text}</Text>
      )}
    </TouchableOpacity>
  )
}
Button.defaultProps = { style: {}, onPress: () => {}, isLoading: false, text: "" }
export default withTheme(Button);
