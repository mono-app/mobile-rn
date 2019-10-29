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
import { withCurrentRooms } from "src/api/rooms/CurrentRooms";

function ChatBottomTextInput(props){
  const { room, currentUser, currentRooms, getRoomDetails } = props;

  const [ message, setMessage ] = React.useState("");
  const [ sessionId, setSessionId ] = React.useState(room.liveVoice === undefined? null: room.liveVoice.session);
  const [ token, setToken ] = React.useState(null);
  const [ canSend, setCanSend ] = React.useState(true);
  const [ streams, setStreams ] = React.useState([])

  const txtInput = React.useRef(null);

  const { colors } = props.theme;
  const styles = StyleSheet.create({
    container: { 
      display: "flex", flexDirection: "row", paddingHorizontal: 16, paddingVertical: 8, borderTopWidth: 1, 
      borderTopColor: "#E8EEE8", alignItems: "center", justifyContent: "center", maxWidth: "100%"
    },
    textInput: {
      backgroundColor: "#E8EEE8", borderColor: "#E8EEE8", borderWidth: 1, flexGrow: 1,
      borderRadius: 32, paddingLeft: 16, paddingRight: 16, paddingVertical: 4, flexShrink: 1,
      maxHeight: 100
    }
  });

  const handleError = (err) => Logger.log("ChatBottomTextInput.handleError#err", err);
  const handleMessageChange = (newMessage) => setMessage(newMessage)
  const handleSendPress = () => {
    setCanSend(false);
    setMessage("")
    txtInput.current.clear();
    if(message.trim() && props.editable ){
      props.onSendPress(message);
    }
    // setTimeout(() => {
    //   setCanSend(true)
    // }, 5)
    setCanSend(true)

  };

  const handleRoomUpdate = async () => {
    // prevent to use realTimeDatabase because it will reRender screen
    const currentRoom = await RoomsAPI.getDetail(room.id)
    if(currentRoom.liveVoice && currentRoom.liveVoice.session) setSessionId(currentRoom.liveVoice.session);
    else {
      setTimeout(async () => await handleRoomUpdate(), 1000);
    }
  };

  const initLiveVoice = async () => {
    Logger.log("ChatBottomTextInput.initLiveVoice#sessionId", sessionId);
    if(sessionId === null) return;

    Logger.log("ChatBottomTextInput.initLiveVoice#room", room);
    const jsonResult = await (await fetch("https://asia-east2-chat-app-fdf76.cloudfunctions.net/requestRoomToken", {
      method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({
        roomId: room.id, sessionId: sessionId, userId: currentUser.id
      })
    })).json();
    Logger.log("ChatBottomTextInput.initLiveVoice#jsonResult", jsonResult);
    if(!jsonResult.error) setToken(jsonResult.result);
  }

  const handleStreamCreated = event => {
    setStreams(...streams, [event.streamId])
  }

  const handleStreamDestroyed = event => {
    const cloneStreams = JSON.parse(JSON.stringify(streams))
    const streamId = [event.streamId]
    delete(cloneStreams[streamId])
    setStreams(cloneStreams)
  }

  React.useEffect(() => {
    if(room.id === undefined) return;
    Logger.log("ChatBottomTextInput#sessionId", sessionId);
    Logger.log("ChatBottomTextInput#token", token);

    if(sessionId === null) handleRoomUpdate()
    if(token === null) initLiveVoice();
    return function cleanup(){

    }
  }, [sessionId, token]);


  const sessionEventHandler = {
    streamCreated : handleStreamCreated,
    streamDestroyed: handleStreamDestroyed,
    error: handleError,
    otrnError: handleError
  }

  return (
    <SafeAreaView style={styles.container}>
      {(sessionId !== null && token !== null)?(
        <OTSession apiKey={TB_API_KEY} sessionId={sessionId} token={token} eventHandlers={sessionEventHandler} style={{ display: "flex", flexDirection: "row" }}>
          <MicButton style={{ marginRight: 8 }}/> 
          <SpeakerButton style={{ marginRight: 8 }} streams={streams}/>
        </OTSession>
      ):(
        <React.Fragment>
          <ActivityIndicator size="small" color={colors.disabled} style={{ marginRight: 8 }}/>
          <ActivityIndicator size="small" color={colors.disabled} style={{ marginRight: 8 }}/>
        </React.Fragment>
      )}
      <TextInput ref={txtInput} style={styles.textInput} autoFocus multiline value={message} maxLength={4000} placeholder="Tuliskan pesan..." onChangeText={handleMessageChange} />
      <IconButton icon="send" size={24} color={colors.primary} style={{ flex: 0 }} disabled={!props.editable || !canSend} onPress={handleSendPress}/>
    </SafeAreaView>
  )
}

ChatBottomTextInput.propTypes = { 
  onSendPress: PropTypes.func,
  room: PropTypes.shape().isRequired
}
ChatBottomTextInput.defaultProps = { onSendPress: () => {} }
export default withCurrentUser(withTheme(ChatBottomTextInput));