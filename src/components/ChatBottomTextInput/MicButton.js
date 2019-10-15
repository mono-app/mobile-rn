import React from "react";
import PropTypes from "prop-types";
import Logger from "src/api/logger";
import { withTheme } from "react-native-paper";
import { StyleSheet } from "react-native";

import { IconButton } from "react-native-paper";
import { OTPublisher } from "opentok-react-native";
import { ActivityIndicator } from "react-native";

function MicButton(props){
  const { colors } = props.theme;
  const [ isActive, setIsActive ] = React.useState(false);
  const [ isLoading, setIsLoading ] = React.useState(true);
  const [ showPublisher, setShowPublisher ] = React.useState(false);
  
  const iconName = (isActive)? "mic": "mic-off";
  const iconColor = (isActive)? colors.primary: colors.disabled;

  const styles = StyleSheet.create({
    default: { marginHorizontal: 0 }
  });

  const publisherEventHandlers = {
    error: handleError, otrnError: handleError,
    streamCreated: handleStreamCreated
  }

  const handleError = (err) => Logger.log("MicButton.handleError#err", err);
  const handleStreamCreated = () => setIsActive(!isActive);
  const handlePress = () => {
    setShowPublisher(!showPublisher);
    handleStreamCreated();
  }

  Logger.log("MicButton#showPublisher", showPublisher);

  if(isLoading) return <ActivityIndicator style={[ styles.default, props.style ]} size="small" color={colors.disabled}/>
  return (
    <React.Fragment>
      {showPublisher?(
        <OTPublisher 
          eventHandlers={publisherEventHandlers}
          properties={{ publishAudio: true, publishVideo: false, videoTrack: false }}/>
      ):null}
      <IconButton 
        style={[ styles.default, props.style ]} icon={iconName} size={24} 
        color={iconColor} onPress={handlePress}/>
    </React.Fragment>
  )
}
MicButton.propTypes = { style: PropTypes.object, onPress: PropTypes.func }
MicButton.defaultProps = { style: {}, onPress: () => {} }
export default withTheme(MicButton);