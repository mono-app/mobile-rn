import React from "react";
import PropTypes from "prop-types";
import moment from "moment";
import Logger from "src/api/logger";
import { withTheme } from "react-native-paper";
import { View, StyleSheet, TouchableOpacity, TouchableWithoutFeedback } from "react-native";
import { Text, Caption, IconButton } from "react-native-paper";
import MessageAPI from "src/api/messages";

import { default as MaterialIcons } from "react-native-vector-icons/MaterialIcons";

function ChatBubble(props){
  const { theme, clickable, bubbleStyle, message, roomId } = props;
  const { content, sentTime, isSent } = props.message;
  const [ sentTimeString, setSentTimeString ] = React.useState("");
  const [ enabledMore, setEnableMore ] = React.useState("");
  const [ isClicked, setClicked ] = React.useState(false);
  const maxContentLength = 100

  const myBubble = StyleSheet.create({
    container: { display: "flex", flexGrow: 1, flexShrink: 1, position: "relative", flexDirection: "row-reverse", alignItems: "center" },
    section: {
      maxWidth: "90%", backgroundColor: props.theme.colors.primary, paddingHorizontal: 16, paddingVertical: 8,
      borderRadius: 16, borderBottomEndRadius: 0, display: "flex", flexDirection: "row"
    },
    empty: { color: props.theme.colors.primary },
    contentColor: { color: "rgba(255, 255, 255, 1)" },
    metadataColor: { color: "rgba(255, 255, 255, .56)" },
    metadata: {
      position: "absolute", right: 16, bottom: 0, 
      flexDirection: "row", display: "flex", alignItems: "center" 
    },
  })

  const peopleBubble = StyleSheet.create({
    container: { display: "flex", flexGrow: 1, flexShrink: 1, position: "relative", flexDirection: "row", alignItems: "center" },
    section: {
      maxWidth: "90%", backgroundColor: "white", paddingHorizontal: 16, paddingVertical: 8,
      borderRadius: 16, borderBottomStartRadius: 0, display: "flex", flexDirection: "row",
      borderColor: "rgba(0, 0, 0, .8)", borderWidth: 1
    },
    empty: { color: "white" },
    contentColor: { color: "rgba(0, 0, 0, 1)" },
    metadataColor: { color: "rgba(0, 0, 0, .56)" },
    metadata: {
      position: "absolute", right: 16, bottom: 0, 
      flexDirection: "row", display: "flex", alignItems: "center" 
    },
  })

  const styles = props.bubbleStyle === "myBubble"? myBubble: peopleBubble;

  const shortnerContent = () => content.substring(0,maxContentLength)
  const handleContentMore = () => setEnableMore(false)
  const handlePress = () => {
    MessageAPI.setMessageStatusClicked(roomId, message.id)
    setClicked(true)
    props.onPress(message);
  }
  

  React.useEffect(() => {
    setClicked(message.isClicked===true)
    if(isSent) setSentTimeString(new moment.unix(sentTime.seconds).format("HH:mmA"));
    if(content.length>maxContentLength) setEnableMore(true)
    else setEnableMore(false)
  }, [isSent, sentTime])
 
  
  return (
    <View style={[ styles.container, props.style]}>
      <TouchableOpacity style={[styles.section, (!isClicked)?{backgroundColor:"#0EAD69"}:{}]} onPress={handlePress} disabled={!clickable}>
        <Text style={styles.contentColor} >
          {(enabledMore)? shortnerContent(): content}
          <Text style={[styles.empty, (!isClicked)?{color:"#0EAD69"}:{} ]}>±±±±±±±±±±±</Text>     
        </Text>
        <View style={styles.metadata}>
          <Caption style={[{ marginRight: 4 }, styles.metadataColor]}>{sentTimeString}</Caption>
          {bubbleStyle === "myBubble"?<MaterialIcons name="done-all" size={16} style={styles.metadataColor}/>: null}
        </View>
      </TouchableOpacity>
     
      {(enabledMore)? 
          <IconButton icon="zoom-out-map" color={theme.colors.placeholder} onPress={handleContentMore}/>
      : null}

      {clickable && bubbleStyle !== "myBubble"?(
        <IconButton icon="share" color={theme.colors.placeholder} onPress={handlePress}/>
      ): null}
      
    </View>
  )
}

ChatBubble.defaultProps = { bubbleStyle: "myBubble" }
ChatBubble.propTypes = { 
  onPress: PropTypes.func, clickable: PropTypes.bool,
  bubbleStyle: PropTypes.string.isRequired,
  message: PropTypes.shape({
    content: PropTypes.string.isRequired, 
    sentTime: PropTypes.any.isRequired,
    isSent: PropTypes.bool.isRequired
  }).isRequired
}
ChatBubble.defaultProps = { onPress: () => {}, clickable: false }
export default withTheme(ChatBubble);