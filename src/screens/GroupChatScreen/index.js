import React from "react";
import { withTheme } from "react-native-paper";
import { withCurrentUser } from "src/api/people/CurrentUser";
import MessagesAPI from "src/api/messages";
import ChatList from "src/components/ChatList";
import ChatBottomTextInput from "src/components/ChatBottomTextInput";
import ChatHeaderGroup from "src/components/ChatHeaderGroup";
import { Platform, KeyboardAvoidingView } from "react-native";
import ClassAPI from "modules/Classroom/api/class";
import ChatLongPressDialog from "src/components/ChatLongPressDialog"

function GroupChatScreen(props){
  const { currentUser } = props;
  const room = props.navigation.getParam("room", null);
  const _isMounted = React.useRef(true);
  const [ headerTitle, setHeaderTitle ] = React.useState("");
  const [ showLongPressDialog, setShowLongPressDialog ] = React.useState(false);
  const [ selectedMessage, setSelectedMessage ] = React.useState({});
  const [ messageToReply, setMessageToReply ] = React.useState(null);
  const subtitle = "Classroom Group"

  const handleSendPress = (message, replyMessage) => {
    MessagesAPI.sendMessage(room.id, currentUser.id, message, "text", null, replyMessage);
    setMessageToReply(null)
  }
  
  handleGroupHeaderPress = () => {
    const payload = { room: room, title: headerTitle, subtitle }
    props.navigation.navigate("GroupChatDetails", payload)
  }

  
  handleDismissLPDialog = () => {
    setShowLongPressDialog(false)
  }

  const handleOnLongPress = (message) => {
    setSelectedMessage(message)
    setShowLongPressDialog(true)
  }

  const handleReplyPress = (message) => {
    setMessageToReply(message)
  }

  const fetchPeople = async () => {   
    const class_ = await ClassAPI.getDetail(room.school.id,room.school.classId)
    setHeaderTitle(class_.room+" | Semester "+ class_.semester +" | "+ class_.subject);
  }
 
  React.useEffect(() => {
    fetchPeople();
    return function cleanup(){
      _isMounted.current = false
    }
  }, []);

  return (
    <KeyboardAvoidingView keyboardShouldPersistTaps={'handled'} behavior={Platform.OS === "ios"? "padding": null} style={{ flex: 1 }}>
      <ChatHeaderGroup 
        navigation={props.navigation} title={headerTitle} subtitle={subtitle} onPress={handleGroupHeaderPress}
        style={{ elevation: 0, borderBottomWidth: 1, borderColor: "#E8EEE8" }}/>
      <ChatList room={room} onLongPressItem={handleOnLongPress} />
      <ChatBottomTextInput room={room} editable={true} onSendPress={handleSendPress} replyMessage={messageToReply}/>
      <ChatLongPressDialog visible={showLongPressDialog} onDismiss={handleDismissLPDialog} message={selectedMessage} onReplyPress={handleReplyPress} />
    </KeyboardAvoidingView>
  )
}

GroupChatScreen.navigationOptions = { header: null }
export default withCurrentUser(withTheme(GroupChatScreen))