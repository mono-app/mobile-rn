import React from "react";
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

  const handlePress = () => setIsActive(!isActive);

  return (
    <IconButton 
      style={[ styles.default, props.style ]} icon={iconName} size={24} 
      color={iconColor} onPress={handlePress}/>
  )
}
SpeakerButton.defaultProps = { style: {} }
export default withTheme(SpeakerButton);