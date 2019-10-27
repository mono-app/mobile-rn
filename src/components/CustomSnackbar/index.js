import React from "react";
import PropTypes from "prop-types";
import { StyleSheet } from "react-native";
import { Snackbar } from "react-native-paper";

function CustomSnackbar(props){
  const { isError } = props
  const [ message, setMessage ] = React.useState(props.message)

  const handleDismissSnackbar = () => setMessage(null) 

  return (
    <Snackbar visible={!!message} onDismiss={handleDismissSnackbar}
      style={{ backgroundColor: (isError)? "#EF6F6C":"#0ead69" }} duration={Snackbar.DURATION_SHORT}>
      {message}
    </Snackbar>
  )
}

CustomSnackbar.propTypes = { 
  message: PropTypes.string.isRequired,
  show: PropTypes.bool.isRequired,
}
CustomSnackbar.defaultProps = { message: null, isError: false, show: false }
export default CustomSnackbar