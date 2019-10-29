import React from "react";
import PropTypes from "prop-types";
import Logger from "src/api/logger";
import { withTheme } from "react-native-paper";
import { StyleSheet } from "react-native";

import { ActivityIndicator } from "react-native";
import { IconButton } from "react-native-paper";
import { OTPublisher } from "opentok-react-native";

function MicButton(props){
  const { colors } = props.theme;
  const [ isActive, setIsActive ] = React.useState(false);
  const [ isConnecting, setIsConnecting ] = React.useState(true);
  
  const iconName = (isActive)? "mic": "mic-off";
  const iconColor = (isActive)? colors.primary: colors.disabled;

  const styles = StyleSheet.create({
    default: { marginHorizontal: 0 }
  });

  const handleError = (err) => Logger.log("MicButton.handleError#err", err);
  const handleStreamCreated = () => {
    Logger.log("MicButton.handleStreamCreated", "streamCreated");
    setIsConnecting(false);
  }

  const handleStreamDestroyed = () => {
    Logger.log("MicButton.handleStreamDestroyed", "streamDestroyed");
    setIsActive(false);
  }

  const handlePress = () => {   
    setIsActive(!isActive)
  }

  const publisherEventHandlers = {
    error: handleError, otrnError: handleError,
    streamCreated: handleStreamCreated, streamDestroyed: handleStreamDestroyed
  }

  return (
    <React.Fragment>
      {isActive?
        <OTPublisher 
          eventHandlers={publisherEventHandlers}
          properties={{ publishAudio: isActive, publishVideo: false, videoTrack: false }}/>
      :null}
      <IconButton 
        style={[ styles.default, props.style ]} icon={iconName} size={24} 
        color={iconColor} onPress={handlePress}/>
    </React.Fragment>
  )
}
MicButton.propTypes = { 
  style: PropTypes.object
}
MicButton.defaultProps = { style: {} }
export default withTheme(MicButton);