import React from "react";
import PropTypes from "prop-types";
import { withTheme } from "react-native-paper";
import { StyleSheet } from "react-native";

import { IconButton } from "react-native-paper";

function SpeakerButton(props){
  const { colors } = props.theme;
  const [ isActive, setIsActive ] = React.useState(false);
  
  const iconName = (isActive)? "volume-up": "volume-off";
  const iconColor = (isActive)? colors.primary: colors.disabled;

  const styles = StyleSheet.create({
    default: { marginHorizontal: 0 }
  })

  const handlePress = () => {
    props.onPress(!isActive);
    setIsActive(!isActive);
  }

  return (
    <IconButton 
      style={[ styles.default, props.style ]} icon={iconName} size={24} 
      color={iconColor} onPress={handlePress}/>
  )
}

SpeakerButton.propTypes = { style: PropTypes.object, onPress: PropTypes.func }
SpeakerButton.defaultProps = { style: {}, onPress: () => {} }
export default withTheme(SpeakerButton);