import React from "react";
import Logger from "src/api/logger";
import MessagesAPI from "src/api/messages";
import PeopleAPI from "src/api/people";
import { withCurrentUser } from "src/api/people/CurrentUser";

import ChatBottomTextInput from "src/components/ChatBottomTextInput";
import ChatList from "src/components/ChatList";
import ChatHeader from "src/components/ChatHeader";
import { KeyboardAvoidingView } from "react-native";

function ChatScreen(props){
  const { currentUser, navigation } = props;
  const room = navigation.getParam("room", null);
  const [ messages, setMessages ] = React.useState([]);
  const [ headerTitle, setHeaderTitle ] = React.useState("");
  const [ isUserRegistered, setUserRegistered ] = React.useState(false);
  const [ headerProfilePicture, setHeaderProfilePicture ] = React.useState("");
  const [ isLoadingNewMessage, setIsLoadingNewMessage ] = React.useState(false);
  const [ lastMessageSnapshot, setLastMessageSnapshot ] = React.useState(null);
  const messagesListener = React.useRef(null);
  const _isMounted = React.useRef(true);

  const handleSendPress = (message) => MessagesAPI.sendMessage(room.id, currentUser.email, message);
  const handleChatListReachTop = async () => {
    Logger.log("ChatScreen.handleChatListReactTop", `Getting new messages ${isLoadingNewMessage}`)
    if(!isLoadingNewMessage){
      try{
        if(_isMounted.current) setIsLoadingNewMessage(true);
        const newData = await MessagesAPI.getNext(lastMessageSnapshot, room.id);
        const combinedMessages = messages.concat(newData.messages);
        Logger.log("ChatScreen.handleChatListReachTop#combineMessages", combinedMessages);
        Logger.log("ChatScreen.handleChatListReachTop#newData", newData);
        if(_isMounted.current){
          setMessages(MessagesAPI.appendDateSeparator(combinedMessages));
          setLastMessageSnapshot(newData.lastDocumentSnapshot);
        }
      }catch(err){
        Logger.log("ChatScreen.handleChatListReachTop#err", err);
      }finally{ 
        if( _isMounted.current) setIsLoadingNewMessage(false) 
      }
    }
  }

  const fetchPeople = async () => {   
    const audiences = room.audiences.filter((audience) => audience !== currentUser.email);
    
    const results = await Promise.all(audiences.map((audience) => PeopleAPI.getDetail(audience)));
    Logger.log("ChatScreen.fetchPeople#results", results);

    const headerTitle = results.map((audienceData) => {
      if(audienceData){
        if(audienceData.applicationInformation){
          if( _isMounted.current) setUserRegistered(true)
          return audienceData.applicationInformation.nickName
        }else if(audienceData.email){
          if( _isMounted.current) setUserRegistered(true)
          return audienceData.email
        }else{
          return "user not registered"
        }
      }else{
        return "user not registered"
      }
    }).join(", ");
    if(audiences.length === 1) {
      if(results[0] && results[0].profilePicture){
        if( _isMounted.current) setHeaderProfilePicture(results[0].profilePicture);
      }else{
        if( _isMounted.current) setHeaderProfilePicture("https://picsum.photos/200/200/?random")           
      }
    }
    if( _isMounted.current) setHeaderTitle(headerTitle);
  }

  const initMessages = () => {
    messagesListener.current = MessagesAPI.getMessagesWithRealTimeUpdate(room.id, (messages, snapshot) => {
      Logger.log("ChatScreen.initMessages", messages);
      if( _isMounted.current){
        if(messages.length === 0) setMessages(MessagesAPI.welcomeMessage());
        else setMessages(MessagesAPI.appendDateSeparator(messages));
        setLastMessageSnapshot(snapshot);
        setUserRegistered(true);
      }
    })
  }
 
  React.useEffect(() => {
    fetchPeople();
    initMessages();
    return function cleanup(){
      _isMounted.current = false
      if(messagesListener.current) messagesListener.current();
    }
  }, []);


  Logger.log("ChatScreen#room", room);
  Logger.log("ChatScreen#headerProfilePicture", headerProfilePicture)
  return (
    <KeyboardAvoidingView style={{ flex: 1 }}>
      <ChatHeader 
        navigation={navigation} title={headerTitle} subtitle={"Online"}  
        profilePicture={headerProfilePicture} style={{ elevation: 0, borderBottomWidth: 1, borderColor: "#E8EEE8" }}/>
      <ChatList messages={messages} onReachTop={handleChatListReachTop}/>
      <ChatBottomTextInput room={room} editable={isUserRegistered} onSendPress={handleSendPress}/>
    </KeyboardAvoidingView>
  )
}

ChatScreen.navigationOptions = { header: null }
export default withCurrentUser(ChatScreen);