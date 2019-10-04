import React from "react";
import PropTypes from "prop-types";
import { StyleSheet } from "react-native";

import MicButton from "src/components/ChatBottomTextInput/MicButton";
import SpeakerButton from "src/components/ChatBottomTextInput/SpeakerButton";
import RTCListener from "src/components/RTCListener";
import { View, TextInput } from "react-native";
import { IconButton, withTheme } from "react-native-paper";
import { SafeAreaView } from "react-navigation";

function ChatBottomTextInput(props){
  const [ message, setMessage ] = React.useState("");
  const [ isPublisher, setIsPublisher ] = React.useState(false);
  const [ isSubscriber, setIsSubscriber ] = React.useState(false);

  const { colors } = props.theme;
  const styles = StyleSheet.create({
    container: { 
      display: "flex", flexDirection: "row", paddingHorizontal: 16, paddingVertical: 8, flexGrow: 1,
      borderTopWidth: 1, borderTopColor: "#E8EEE8", alignItems: "center", justifyContent: "center", maxWidth: "100%"
    },
    textInput: {
      backgroundColor: "#E8EEE8", borderColor: "#E8EEE8", borderWidth: 1, flexGrow: 1,
      borderRadius: 32, paddingLeft: 16, paddingRight: 16, paddingVertical: 4, flexShrink: 1
    }
  })

  const handleMicPress = (isActive) => setIsPublisher(isActive);
  const handleSpeakerPress = (isActive) => setIsSubscriber(isActive);
  const handleMessageChange = (newMessage) => setMessage(newMessage);
  const handleSendPress = () => {
    const copiedMessage = JSON.parse(JSON.stringify(message));
    if(copiedMessage.trim() && props.editable ){
      props.onSendPress(copiedMessage);
    }
    setMessage("");
  }

  return (
    <SafeAreaView style={styles.container}>
      <MicButton style={{ marginRight: 8 }} onPress={handleMicPress}/> 
      <SpeakerButton style={{ marginRight: 8 }} onPress={handleSpeakerPress}/>
      <TextInput style={styles.textInput} autoFocus multiline value={message} placeholder="Tuliskan pesan..." onChangeText={handleMessageChange} />
      <IconButton icon="send" size={24} color={colors.primary} style={{ flex: 0 }} disabled={!props.editable} onPress={handleSendPress}/>
      <RTCListener roomId={props.room.id} isPublisher={isPublisher} isSubscriber={isSubscriber}/>
    </SafeAreaView>
  )
}

ChatBottomTextInput.propTypes = { onSendPress: PropTypes.func }
ChatBottomTextInput.defaultProps = { onSendPress: () => {} }

export default withTheme(ChatBottomTextInput);