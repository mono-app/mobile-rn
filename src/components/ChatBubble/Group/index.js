import React from "react";
import PropTypes from "prop-types";
import CircleAvatar from "src/components/Avatar/Circle";
import { View, StyleSheet } from "react-native";
import PrivateBubble from "src/components/ChatBubble/Private"

function Group(props){
  const { clickable, bubbleStyle, message, enabledMore, isClicked, sentTimeString, sender } = props;

  const styles = StyleSheet.create({
    mainContainer: { display: "flex", flexDirection: "row", alignItems: "flex-end" },
  })

  const handleContentMore = () => props.onPressEnableMore(false) 
  const handlePress = () => props.onPress(message);
  const handleLongPress = () => props.onLongPress(message)

  return (
    <View style={styles.mainContainer}>
      {bubbleStyle !== "myBubble"? (
        <CircleAvatar uri={sender.profilePicture} style={[ styles.avatar, props.avatarStyle ]} size={32}/>
      ): null}
      <View style={{margin: 2}}/>
      <PrivateBubble bubbleStyle={bubbleStyle} enabledMore={enabledMore} sentTimeString={sentTimeString}
         clickable={clickable} message={message} isClicked={isClicked}
        onPressEnableMore={handleContentMore} onPress={handlePress} onLongPress={handleLongPress}/>
    </View>
  )
}

Group.defaultProps = { bubbleStyle: "myBubble" }
Group.propTypes = { 
  sender: PropTypes.object.isRequired,
  isClicked: PropTypes.bool.isRequired,
  onPress: PropTypes.func, clickable: PropTypes.bool,
  onPressEnableMore: PropTypes.func.isRequired,
  bubbleStyle: PropTypes.string.isRequired,
  message: PropTypes.object.isRequired,
  sentTimeString: PropTypes.string.isRequired,
}
Group.defaultProps = { onPress: () => {}, onLongPress: () => {}, clickable: false, isClicked: false, onPressEnableMore: () => {} }
export default Group;