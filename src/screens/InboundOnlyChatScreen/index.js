import React from "react";
import Logger from "src/api/logger";
import { withCurrentUser } from "src/api/people/CurrentUser";
import MessagesAPI from "src/api/messages";
import BotsAPI from "src/api/bots"

import ChatHeader from "src/components/ChatHeader";
import ChatList from "src/components/ChatList";
import { KeyboardAvoidingView } from "react-native";

function InboundOnlyChatScreen(props){
  const { navigation, currentUser } = props;
  const room = navigation.getParam("room", null);
  const [ messages, setMessages ] = React.useState([]);
  const [ lastMessageSnapshot, setLastMessageSnapshot ] = React.useState(null);
  const [ isLoadingNewMessage, setIsLoadingNewMessage ] = React.useState(false);
  const [ bot, setBot ] = React.useState(null);
  const messagesListener = React.useRef(null);
  const _isMounted = React.useRef(true);

  const handleChatListReachTop = async () => {
    Logger.log("InboundOnlyChatScreen.handleChatListReactTop", `Getting new messages ${isLoadingNewMessage}`)
    if(!isLoadingNewMessage){
      try{
        if(_isMounted.current) setIsLoadingNewMessage(true);
        const newData = await MessagesAPI.getNext(lastMessageSnapshot, room.id);
        const combinedMessages = messages.concat(newData.messages);
        Logger.log("InboundOnlyChatScreen.handleChatListReachTop#combineMessages", combinedMessages);
        Logger.log("InboundOnlyChatScreen.handleChatListReachTop#newData", newData);
        if(_isMounted.current){
          setMessages(combinedMessages);
          setLastMessageSnapshot(newData.lastDocumentSnapshot);
        }
        
      }catch(err){
        Logger.log("InboundOnlyChatScreen.handleChatListReachTop#err", err);
      }finally{ 
        if( _isMounted.current) setIsLoadingNewMessage(false) 
      }
    }
  }

  const initMessages = () => {
    messagesListener.current = MessagesAPI.getMessagesWithRealTimeUpdate(room.id, (messages, snapshot) => {
      Logger.log("InboundOnlyChatScreen.initMessages", messages);
      MessagesAPI.bulkMarkAsRead(room.id, currentUser.email).then()

      if( _isMounted.current){
        setMessages(MessagesAPI.appendDateSeparator(messages));
        setLastMessageSnapshot(snapshot);
      }
    })
  }

  const fetchBot = async () => {
    const bot = await BotsAPI.getDetail(room.bot);
    setBot(bot);
  }

  React.useEffect(() => {
    fetchBot();
    initMessages();
    return function cleanup(){
      if(messagesListener.current) messagesListener.current();
    }
  }, []);

  if(bot === null) return null;
  return (
    <KeyboardAvoidingView style={{ flex: 1 }}>
      <ChatHeader
        navigation={navigation} title={bot.displayName} subtitle="Bot" isFriend={true}
        profilePicture={bot.profilePicture} style={{ elevation: 0, borderBottomWidth: 1, borderColor: "#E8EEE8" }}/>
      <ChatList messages={messages} onReachTop={handleChatListReachTop}/>
    </KeyboardAvoidingView>
  )
};

InboundOnlyChatScreen.navigationOptions = { header: null }
export default withCurrentUser(InboundOnlyChatScreen)