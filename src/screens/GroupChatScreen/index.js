import React from "react";
import Logger from "src/api/logger";
import { withTheme } from "react-native-paper";
import { withCurrentUser } from "src/api/people/CurrentUser";
import MessagesAPI from "src/api/messages";
import ChatList from "src/components/ChatList";
import ChatBottomTextInput from "src/components/ChatBottomTextInput";
import ChatHeaderGroup from "src/components/ChatHeaderGroup";
import { KeyboardAvoidingView } from "react-native";
import ClassAPI from "modules/Classroom/api/class";

function GroupChatScreen(props){
  const { currentUser } = props;
  const room = props.navigation.getParam("room", null);
  const _isMounted = React.useRef(true);
  const [ messages, setMessages ] = React.useState([]);
  const [ headerTitle, setHeaderTitle ] = React.useState("");
  const [ headerProfilePicture, setHeaderProfilePicture ] = React.useState("");
  const [ isLoadingNewMessage, setIsLoadingNewMessage ] = React.useState(false);
  const [ lastMessageSnapshot, setLastMessageSnapshot ] = React.useState(null);

  const handleSendPress = (message) => MessagesAPI.sendMessage(room.id, currentUser.id, message);
  const handleChatListReachTop = async () => {
    Logger.log("GroupChatScreen.handleChatListReactTop", `Getting new messages ${isLoadingNewMessage}`)
    if(!isLoadingNewMessage){
      try{
        if(_isMounted.current)
          setIsLoadingNewMessage(true);
        const newData = await MessagesAPI.getNext(lastMessageSnapshot, room.id);
        const combinedMessages = messages.concat(newData.messages);
        Logger.log("GroupChatScreen.handleChatListReachTop#combineMessages", combinedMessages);
        Logger.log("GroupChatScreen.handleChatListReachTop#newData", newData);
        if(_isMounted.current){
          setMessages(combinedMessages);
          setLastMessageSnapshot(newData.lastDocumentSnapshot);
        }
        
      }catch(err){
        Logger.log("GroupChatScreen.handleChatListReachTop#err", err);
      }finally{ 
        if( _isMounted.current)
          setIsLoadingNewMessage(false) 
      }
    }
  }

  const fetchPeople = async () => {   
    const class_ = await ClassAPI.getDetail(room.school.id,room.school.classId)

    setHeaderProfilePicture("https://picsum.photos/200/200/?random")           
    setHeaderTitle(class_.room+" | Semester "+ class_.semester +" | "+ class_.subject);
  }
 
  React.useEffect(() => {
    fetchPeople();
  
    return function cleanup(){
      _isMounted.current = false
    }
  }, []);


  return (
    <KeyboardAvoidingView style={{ flex: 1 }}>
      <ChatHeaderGroup 
        navigation={props.navigation} title={headerTitle} subtitle={"Online"}
        profilePicture={headerProfilePicture} style={{ elevation: 0, borderBottomWidth: 1, borderColor: "#E8EEE8", }}/>
      <ChatList messages={messages} onReachTop={handleChatListReachTop} navigation={props.navigation} room={room}/>
      <ChatBottomTextInput room={room}
        editable={true}
        onSendPress={handleSendPress}/>
    </KeyboardAvoidingView>
  )
}

GroupChatScreen.navigationOptions = { header: null }
export default withCurrentUser(withTheme(GroupChatScreen))