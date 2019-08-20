import React from "react";
import PropTypes from "prop-types";

import MicButton from "src/components/ChatBottomTextInput/MicButton";
import SpeakerButton from "src/components/ChatBottomTextInput/SpeakerButton";
import { View, TextInput } from "react-native";
import { Surface, IconButton, withTheme } from "react-native-paper";

function ChatBottomTextInput(props){
  const [ message, setMessage ] = React.useState(message);

  const { colors } = props.theme;

  const handleMessageChange = (newMessage) => setMessage(newMessage);
  const handleSendPress = () => {
    const copiedMessage = JSON.parse(JSON.stringify(message));
    props.onSendPress(copiedMessage);
    setMessage("");
  }

  return (
    <Surface style={{ margin: 8, marginHorizontal: 16, overflow: "hidden", borderRadius: 32, elevation: 8 }}>
      <View style={{ paddingHorizontal: 8, backgroundColor: "white", flexDirection: "row", borderTopStartRadius: 32, borderTopEndRadius: 32, borderBottomColor: colors.disabled, borderBottomWidth: 1, overflow: "hidden" }}>
        <MicButton/> 
        <SpeakerButton/>
      </View>
      <View style={{ flexDirection: "row", padding: 2, paddingHorizontal: 16 , backgroundColor: "white", borderBottomStartRadius: 32, borderBottomEndRadius: 32, overflow: "hidden" }}>
        <TextInput
          style={{ flex: 1 }} value={message} placeholder="Tuliskan pesan..." 
          onChangeText={handleMessageChange} autoFocus/>
        <IconButton icon="send" size={24} color={colors.primary} style={{ flex: 0 }} onPress={handleSendPress}/>
      </View>
    </Surface>
  )
}

ChatBottomTextInput.propTypes = { onSendPress: PropTypes.func }
ChatBottomTextInput.defaultProps = { onSendPress: () => {} }

export default withTheme(ChatBottomTextInput);