import React from "react";
import PropTypes from "prop-types";

import FastImage from "react-native-fast-image";

function CircleAvatar(props){
  const { size, uri } = props;

  const radius = size? size/2: 25;
  const mySize = size? size: 50;

  const styles ={
    default: { width: mySize, height: mySize, borderRadius: radius }
  }

  return <FastImage style={[ styles.default, props.style]} source={{ uri: uri }}/>
}

CircleAvatar.propTypes = { 
  size: PropTypes.number.isRequired,
  style: PropTypes.any,
  uri: PropTypes.string.isRequired
}
CircleAvatar.defaultProps = { style: {} }
export default CircleAvatar;