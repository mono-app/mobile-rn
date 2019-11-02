import React from "react";
import PropTypes from "prop-types";
import { Snackbar } from "react-native-paper";
import { View } from "react-native";

function CustomSnackbar(props){
  const { message, isError } = props

  return (
    <Snackbar visible={!!message} onDismiss={props.onDismiss}
      style={{ backgroundColor: (isError)? "#EF6F6C":"#0ead69" }} duration={Snackbar.DURATION_SHORT}>
      {message}
    </Snackbar>
  )
}

CustomSnackbar.propTypes = { 
  message: PropTypes.string,
  isError: PropTypes.bool,
  onDismiss: PropTypes.func.isRequired
}
CustomSnackbar.defaultProps = { message: null, isError: false }
export default CustomSnackbar