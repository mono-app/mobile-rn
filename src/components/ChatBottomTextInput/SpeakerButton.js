import React from "react";
import PropTypes from "prop-types";
import Logger from "src/api/logger";
import { withTheme } from "react-native-paper";
import { StyleSheet } from "react-native";

import { ActivityIndicator } from "react-native";
import { IconButton } from "react-native-paper";
import { OTSubscriber } from "opentok-react-native";

function SpeakerButton(props){
  const { isLoading } = props;
  const { colors } = props.theme;
  const [ isActive, setIsActive ] = React.useState(false);
  const [ showSubscriber, setShowSubscriber ] = React.useState(false);
  
  const iconName = (isActive)? "volume-up": "volume-off";
  const iconColor = (isActive)? colors.primary: colors.disabled;

  const styles = StyleSheet.create({
    default: { marginHorizontal: 0 }
  })

  const handleError = (err) => Logger.log("SpeakerButton.handleError#err", err);
  const handlePress = () => {
    setShowSubscriber(!showSubscriber);
    setIsActive(!isActive);
  }

  const subscriberEventHandlers = { error: handleError, otrnError: handleError }

  if(isLoading) return <ActivityIndicator size="small" color={colors.disabled} style={[ styles.default, props.style ]}/>
  return (
    <React.Fragment>
      {showSubscriber?(
        <OTSubscriber eventHandlers={subscriberEventHandlers} properties={{ subscribeToVideo: false, subscribeToAudio: true }}/>
      ):null}
      <IconButton 
        style={[ styles.default, props.style ]} icon={iconName} size={24} 
        color={iconColor} onPress={handlePress}/>
    </React.Fragment>
  )
}

SpeakerButton.propTypes = { style: PropTypes.object, onPress: PropTypes.func }
SpeakerButton.defaultProps = { style: {}, onPress: () => {} }
export default withTheme(SpeakerButton);