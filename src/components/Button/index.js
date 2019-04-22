import React from "react";
import { Text, TouchableOpacity, StyleSheet, ActivityIndicator } from "react-native";

export default class Button extends React.Component{
  render(){
    const overrideStyle = this.props.style? this.props.style: {};
    return(
      <TouchableOpacity
        style={{ ...styles.button, ...overrideStyle }}
        onPress={this.props.onPress}>
        {this.props.isLoading?(
          <ActivityIndicator size="small" color="white"/>
        ):(
          <Text style={{ color: 'white', fontWeight: '500' }}>{this.props.text}</Text>
        )}
      </TouchableOpacity>
    )
  }
}

Button.defaultProps = { isLoading: false }

const styles = StyleSheet.create({
  button: {
    marginBottom: 16,
    alignItems: 'center',
    backgroundColor: '#0EAD69',
    padding: 16,
    paddingLeft: 32,
    paddingRight: 32,
    borderWidth: 1,
    borderColor: '#fff',
    borderRadius: 8,
  }
})