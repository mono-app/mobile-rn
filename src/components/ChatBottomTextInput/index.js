import React from "react";
import PropTypes from "prop-types";
import Logger from "src/api/logger";
import { StyleSheet } from "react-native";
import { TB_API_KEY } from "react-native-dotenv";
import { withCurrentUser } from "src/api/people/CurrentUser";

import MicButton from "src/components/ChatBottomTextInput/MicButton";
import SpeakerButton from "src/components/ChatBottomTextInput/SpeakerButton";
import { TextInput, ActivityIndicator} from "react-native";
import { IconButton, withTheme } from "react-native-paper";
import { SafeAreaView } from "react-navigation";
import { OTSession } from "opentok-react-native";

function ChatBottomTextInput(props){
  const { room, currentUser } = props;

  const [ message, setMessage ] = React.useState("");
  const [ sessionId, setSessionId ] = React.useState(null);
  const [ token, setToken ] = React.useState(null);

  const roomListener = React.useRef(null);

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

  const initLiveVoice = async () => {
    Logger.log("ChatBottomTextInput.initLiveVoice#room", room);
    if(room.liveVoice === undefined) return;
    setSessionId(room.liveVoice.session);

    const jsonResult = await (await fetch("https://asia-east2-chat-app-fdf76.cloudfunctions.net/requestRoomToken", {
      method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({
        roomId: room.id, sessionId: room.liveVoice.session, userEmail: currentUser.email
      })
    })).json();
    Logger.log("ChatBottomTextInput.initLiveVoice#jsonResult", jsonResult);
    if(!jsonResult.error) setToken(jsonResult.result);
  }

  React.useEffect(() => {
    initLiveVoice();
    return function cleanup(){
      if(roomListener.current) roomListener.current();
    }
  }, [])

  Logger.log("ChatBottomTextInput#sessionId", sessionId);
  Logger.log("ChatBottomTextInput#token", token);
  return (
    <SafeAreaView style={styles.container}>
      {sessionId === null || token === null?(
        <React.Fragment>
          <ActivityIndicator size="small" color={colors.disabled} style={{ marginRight: 8 }}/>
          <ActivityIndicator size="small" color={colors.disabled} style={{ marginRight: 8 }}/>
        </React.Fragment>
      ):(
        <OTSession apiKey={TB_API_KEY} sessionId={sessionId} token={token} eventHandlers={sessionEventHandler} style={{ display: "flex", flexDirection: "row" }}>
          <MicButton style={{ marginRight: 8 }}/> 
          <SpeakerButton style={{ marginRight: 8 }}/>
        </OTSession>
      )}
      <TextInput style={styles.textInput} autoFocus multiline value={message} placeholder="Tuliskan pesan..." onChangeText={handleMessageChange} />
      <IconButton icon="send" size={24} color={colors.primary} style={{ flex: 0 }} disabled={!props.editable} onPress={handleSendPress}/>
    </SafeAreaView>
  )
}

ChatBottomTextInput.propTypes = { 
  onSendPress: PropTypes.func,
  room: PropTypes.shape().isRequired
}
ChatBottomTextInput.defaultProps = { onSendPress: () => {} }
export default withCurrentUser(withTheme(ChatBottomTextInput));