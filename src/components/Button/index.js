import React from "react";
import { withTheme } from "react-native-paper";

import { TouchableOpacity, StyleSheet, ActivityIndicator } from "react-native";
import { Text } from "react-native-paper";

function Button(props){
  const styles = StyleSheet.create({
    button: {
      display: "flex", justifyContent: 'center', flexDirection: "row",
      backgroundColor: props.theme.colors.primary, borderColor: '#fff',
      marginBottom: 16, padding: 16, paddingLeft: 32, paddingRight: 32, 
      borderRadius: 8, borderWidth: 2
    },
    disabled: { backgroundColor: props.theme.colors.disabled },
    outlined: { backgroundColor: "#fff", borderColor:props.theme.colors.primary  },
  })

  const handlePress = () => {
    if(!props.disabled) props.onPress();
  }

  return(
    <TouchableOpacity
      style={[ styles.button, props.style, ((props.disabled)? styles.disabled: {}), ((props.outlined)? styles.outlined: {} ) ]}
      onPress={handlePress} disabled={props.disabled}>
      {props.isLoading? <ActivityIndicator size="small" color="white"/>: null}
      <Text style={{ color: (props.outlined)? props.theme.colors.primary :'white', fontWeight: 'bold' }}>{props.text}</Text>
    </TouchableOpacity>
  )
}
Button.defaultProps = { style: {}, onPress: () => {}, isLoading: false, disabled: false, text: "" }
export default withTheme(Button);
