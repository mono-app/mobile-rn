import React from "react";
import moment from "moment";
import Logger from "src/api/logger";

import { View, StyleSheet } from "react-native";
import { Text, withTheme, Caption } from "react-native-paper";

import { default as MaterialIcons } from "react-native-vector-icons/MaterialIcons";

function ChatBubble(props){
  const { content, sentTime, isSent, readBy } = props.message;
  const [ sentTimeString, setSentTimeString ] = React.useState("");

  const myBubble = StyleSheet.create({
    container: { display: "flex", flexGrow: 1, flexShrink: 1, position: "relative", flexDirection: "row-reverse" },
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
    container: { display: "flex", flexGrow: 1, flexShrink: 1, position: "relative", flexDirection: "row" },
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

  React.useEffect(() => {
    Logger.log("ChatBubble", `isSent: ${isSent}, ${sentTime}`);
    if(isSent) setSentTimeString(new moment.unix(sentTime.seconds).format("HH:mmA"));
  }, [isSent, sentTime])

  return (
    <View style={[ styles.container, props.style ]}>
      <View style={ styles.section}>
        <Text style={styles.contentColor}>
          {content}
          <Text style={styles.empty}>±±±±±±±±±±</Text>     
        </Text>
        
        <View style={styles.metadata}>
          <Caption style={[{ marginRight: 4 }, styles.metadataColor]}>{sentTimeString}</Caption>
          {props.bubbleStyle === "myBubble"?<MaterialIcons name="done-all" size={16} style={styles.metadataColor}/>: null}
        </View>
      </View>
    </View>
  )
}

ChatBubble.defaultProps = { bubbleStyle: "myBubble" }

export default withTheme(ChatBubble);