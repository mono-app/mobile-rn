import React from "react";
import PropTypes from "prop-types";
import Logger from "src/api/logger";
import { StyleSheet } from "react-native";
import { TB_API_KEY, TB_SESSION_ID, TB_TOKEN } from "react-native-dotenv";

import MicButton from "src/components/ChatBottomTextInput/MicButton";
import SpeakerButton from "src/components/ChatBottomTextInput/SpeakerButton";
import { TextInput } from "react-native";
import { IconButton, withTheme } from "react-native-paper";
import { SafeAreaView } from "react-navigation";
import { OTSession } from "opentok-react-native";

function ChatBottomTextInput(props){
  const [ message, setMessage ] = React.useState("");

  const { colors } = props.theme;
  const styles = StyleSheet.create({
    container: { 
      display: "flex", flexDirection: "row", paddingHorizontal: 16, paddingVertical: 8, borderTopWidth: 1, 
      borderTopColor: "#E8EEE8", alignItems: "center", justifyContent: "center", maxWidth: "100%"
    },
    textInput: {
      backgroundColor: "#E8EEE8", borderColor: "#E8EEE8", borderWidth: 1, flexGrow: 1,
      borderRadius: 32, paddingLeft: 16, paddingRight: 16, paddingVertical: 4, flexShrink: 1
    }
  });

  const sessionEventHandler = {
    sessionConnected: handleSessionConnected,
    error: handleError,
    otrnError: handleError
  }

  const handleError = (err) => Logger.log("ChatBottomTextInput.handleError#err", err);
  const handleSessionConnected = () => Logger.log("ChatBottomTextInput.handleSessionConnected", "session connected");
  const handleMessageChange = (newMessage) => setMessage(newMessage);
  const handleSendPress = () => {
    const copiedMessage = JSON.parse(JSON.stringify(message));
    if(copiedMessage.trim() && props.editable ){
      props.onSendPress(copiedMessage);
    }
    setMessage("");
  };

  console.log(TB_API_KEY);
  return (
    <SafeAreaView style={styles.container}>
      <OTSession apiKey={TB_API_KEY} sessionId={TB_SESSION_ID} token={TB_TOKEN} eventHandlers={sessionEventHandler} style={{ display: "flex", flexDirection: "row" }}>
        <MicButton style={{ marginRight: 8 }}/> 
        <SpeakerButton style={{ marginRight: 8 }}/>
      </OTSession>
      <TextInput style={styles.textInput} autoFocus multiline value={message} placeholder="Tuliskan pesan..." onChangeText={handleMessageChange} />
      <IconButton icon="send" size={24} color={colors.primary} style={{ flex: 0 }} disabled={!props.editable} onPress={handleSendPress}/>
    </SafeAreaView>
  )
}

ChatBottomTextInput.propTypes = { onSendPress: PropTypes.func }
ChatBottomTextInput.defaultProps = { onSendPress: () => {} }

export default withTheme(ChatBottomTextInput);