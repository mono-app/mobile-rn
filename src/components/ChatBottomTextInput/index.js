import React from "react";
import PropTypes from "prop-types";
import Logger from "src/api/logger";
import RoomsAPI from "src/api/rooms";
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
  const [ sessionId, setSessionId ] = React.useState(room.liveVoice === undefined? null: room.liveVoice.session);
  const [ token, setToken ] = React.useState(null);
  const [ isConnected, setIsConnected ] = React.useState(false);
  const _isMounted = React.useRef(true);

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

  const handleError = (err) => Logger.log("ChatBottomTextInput.handleError#err", err);
  const handleSessionConnected = () => setIsConnected(true);
  const handleMessageChange = (newMessage) => {if(_isMounted.current) setMessage(newMessage);}
  const handleSendPress = () => {
    const copiedMessage = JSON.parse(JSON.stringify(message));
    if(copiedMessage.trim() && props.editable ){
      props.onSendPress(copiedMessage);
    }
    setMessage("");
  };

  const handleRoomUpdate = (room) => {
    if(room.liveVoice === undefined) return;
    if(room.liveVoice.session === undefined) return;
    setSessionId(room.liveVoice.session);
  };

  const initLiveVoice = async () => {
    Logger.log("ChatBottomTextInput.initLiveVoice#sessionId", sessionId);
    if(sessionId === null) return;

    Logger.log("ChatBottomTextInput.initLiveVoice#room", room);
    const jsonResult = await (await fetch("https://asia-east2-chat-app-fdf76.cloudfunctions.net/requestRoomToken", {
      method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({
        roomId: room.id, sessionId: sessionId, userEmail: currentUser.email
      })
    })).json();
    Logger.log("ChatBottomTextInput.initLiveVoice#jsonResult", jsonResult);
    if(!jsonResult.error) setToken(jsonResult.result);
  }


  React.useEffect(() => {
    if(room.id === undefined) return;
    Logger.log("ChatBottomTextInput#sessionId", sessionId);
    Logger.log("ChatBottomTextInput#token", token);

    if(sessionId === null) roomListener.current = RoomsAPI.getDetailWithRealTimeUpdate(room.id, handleRoomUpdate);
    if(token === null) initLiveVoice();
    return function cleanup(){
      if(roomListener.current) roomListener.current();
    }
  }, [sessionId, token]);

  const sessionEventHandler = {
    sessionConnected: handleSessionConnected,
    error: handleError,
    otrnError: handleError
  }

  return (
    <SafeAreaView style={styles.container}>
      {(sessionId !== null && token !== null)?(
        <OTSession apiKey={TB_API_KEY} sessionId={sessionId} token={token} eventHandlers={sessionEventHandler} style={{ display: "flex", flexDirection: "row" }}>
          <MicButton style={{ marginRight: 8 }} isLoading={!isConnected}/> 
          <SpeakerButton style={{ marginRight: 8 }} isLoading={!isConnected}/>
        </OTSession>
      ):(
        <React.Fragment>
          <ActivityIndicator size="small" color={colors.disabled} style={{ marginRight: 8 }}/>
          <ActivityIndicator size="small" color={colors.disabled} style={{ marginRight: 8 }}/>
        </React.Fragment>
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