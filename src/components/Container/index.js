import React from "react";
import PropTypes from "prop-types";

import { View } from "react-native";

export default function Container(props){
  const styles = { 
    default: { display: "flex", flexDirection: "column", flexGrow: 1 }
  }
  return (
    <View style={[ styles.default, props.style ]}>
      {props.children}
    </View>
  )
}

Container.propTypes = { style: PropTypes.any }
Container.defaultProps = { style: {} }