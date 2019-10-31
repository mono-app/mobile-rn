import React from "react";
import PropTypes from "prop-types";
import { withTheme } from "react-native-paper";
import { View, StyleSheet, TouchableOpacity } from "react-native";
import { Text, Caption, IconButton } from "react-native-paper";
import { default as MaterialIcons } from "react-native-vector-icons/MaterialIcons";

function Private(props){
  const { theme, clickable, bubbleStyle, message, enabledMore, isClicked, sentTimeString } = props;
  const maxContentLength = 100

  const myBubble = StyleSheet.create({
    container: { display: "flex", flexGrow: 1, flexShrink: 1, position: "relative", flexDirection: "row-reverse", alignItems: "center" },
    section: {
      maxWidth: "90%", backgroundColor: props.theme.colors.primary, paddingHorizontal: 8, paddingVertical: 8,
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
    avatar: { marginRight: 8, marginBottom: 8 },
    section: {
      maxWidth: "90%", backgroundColor: "white", paddingHorizontal: 8, paddingVertical: 8,
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

  const shortnerContent = () => message.content.substring(0, maxContentLength)
  const handleContentMore = () => props.onPressEnableMore(false) 
  const handlePress = () => props.onPress(message);
  const handleLongPress = () => props.onLongPress(message)

  return (
      <View style={[ styles.container, props.style]}>
        <TouchableOpacity style={[styles.section, (!isClicked && clickable)?{backgroundColor:"#0EAD69"}:{}]} onPress={handlePress} onLongPress={handleLongPress}>
          <View>
            {(message.replyTo)? 
            <View style={{flex:1, borderRadius: 4, borderBottomColor: "rgba(0, 0, 0, .2)", borderBottomWidth: 1, padding:4}}>
              <Text style={{fontWeight:"bold", color:"#000"}}>{message.replyTo.name}</Text>
              <Text style={{color: "rgba(0, 0, 0, .6)"}}>{message.replyTo.content}</Text>
            </View>
              : null}
            <Text style={[styles.contentColor, {paddingHorizontal: 8}]} >
              {(enabledMore)? shortnerContent(): message.content}
              <Text style={[ styles.empty, (!isClicked && clickable)?{color:"#0EAD69"}:{} ]}>±±±±±±±±±±±</Text>     
            </Text>
          </View>
          <View style={[styles.metadata, {paddingHorizontal: 8}]}>
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

Private.defaultProps = { bubbleStyle: "myBubble" }
Private.propTypes = { 
  isClicked: PropTypes.bool.isRequired,
  onPress: PropTypes.func, clickable: PropTypes.bool,
  onPressEnableMore: PropTypes.func.isRequired,
  bubbleStyle: PropTypes.string.isRequired,
  message: PropTypes.object.isRequired,
  sentTimeString: PropTypes.string.isRequired,
}
Private.defaultProps = { onPress: () => {}, clickable: false, isClicked: false, onPressEnableMore: () => {} }
export default withTheme(Private);