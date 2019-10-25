import React from "react";
import { Badge } from "react-native-paper";

function UnreadCountBadge(props){
  const { isActive } = props;
  return (isActive)? <Badge style={[{backgroundColor:"red", color:"white"}, props.style]}></Badge>: null
}

UnreadCountBadge.defaultProps = { style: {} }
export default UnreadCountBadge