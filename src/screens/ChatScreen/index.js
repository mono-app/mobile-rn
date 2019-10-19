import React from "react";
import Logger from "src/api/logger";
import MessagesAPI from "src/api/messages";
import PeopleAPI from "src/api/people";
import { withCurrentUser } from "src/api/people/CurrentUser";
import ChatBottomTextInput from "src/components/ChatBottomTextInput";
import ChatList from "src/components/ChatList";
import ChatHeader from "src/components/ChatHeader";
import { AppState, KeyboardAvoidingView, Platform } from "react-native";
import FriendsAPI from "src/api/friends";
import RoomsAPI from "src/api/rooms";

function ChatScreen(props){
  const { currentUser, navigation } = props;

  const room = navigation.getParam("room", null);

  const [ messages, setMessages ] = React.useState([]);
  const [ headerTitle, setHeaderTitle ] = React.useState("");
  const [ peopleEmail, setPeopleEmail ] = React.useState("");
  const [ audienceStatus, setAudienceStatus ] = React.useState("");
  const [ isInRoom, setInRoom ] = React.useState(false);
  const [ isFriend, setFriend ] = React.useState(true);
  const [ isUserRegistered, setUserRegistered ] = React.useState(false);
  const [ headerProfilePicture, setHeaderProfilePicture ] = React.useState("");
  const [ isLoadingNewMessage, setIsLoadingNewMessage ] = React.useState(false);
  const [ lastMessageSnapshot, setLastMessageSnapshot ] = React.useState(null);
  
  const audienceListener = React.useRef(null);
  const messagesListener = React.useRef(null);
  const roomListener = React.useRef(null);
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

  const fetchPeople = () => {
    const audienceEmail = room.audiences.filter((audience) => audience !== currentUser.email)[0];
    if( _isMounted.current) setPeopleEmail(audienceEmail)

    PeopleAPI.getDetail(audienceEmail).then( (audienceData)=>{
      let tempHeaderTitle = ""
      let tempHeaderProfilePicture = "https://picsum.photos/200/200/?random"
      if(audienceData){
        if(audienceData.applicationInformation){
          if( _isMounted.current) setUserRegistered(true)
          tempHeaderTitle = audienceData.applicationInformation.nickName
        }else tempHeaderTitle = "user not registered"
        if(headerProfilePicture === "" && audienceData.profilePicture) {
          tempHeaderProfilePicture = audienceData.profilePicture
        }
      }else tempHeaderTitle = "user not registered"

      if(_isMounted.current) setHeaderTitle(tempHeaderTitle)
      if(_isMounted.current) setHeaderProfilePicture(tempHeaderProfilePicture);
    })

    FriendsAPI.isFriends(currentUser.email, audienceEmail).then( isFriend => {
      if( _isMounted.current) setFriend(isFriend)
    })
  }

  const initMessages = () => {
    messagesListener.current = MessagesAPI.getMessagesWithRealTimeUpdate(room.id, (messages, snapshot) => {
      Logger.log("ChatScreen.initMessages#messages", messages);
      if( _isMounted.current){
        if(messages.length === 0) setMessages(MessagesAPI.welcomeMessage());
        else {
          setMessages(MessagesAPI.appendDateSeparator(messages));
          MessagesAPI.bulkMarkAsRead(room.id, currentUser.email).then(result => {
            if(result) props.setUnreadChat(room.id, 0)
          })
        }
        setLastMessageSnapshot(snapshot);
      }
    })
    
    const audiences = room.audiences.filter((audience) => audience !== currentUser.email);

    roomListener.current = RoomsAPI.getDetailWithRealTimeUpdate(room.id, (data)=>{
      const userInRoomList = data.inRoom
      if(userInRoomList && userInRoomList.length>0 && userInRoomList.includes(audiences[0])){
       if( _isMounted.current) setInRoom(true)
      }else{
        if( _isMounted.current) setInRoom(false)
      }
    })

    audienceListener.current = PeopleAPI.getDetailWithRealTimeUpdate(audiences[0], (audienceData)=>{
      let tempAudienceStatus = ""
     
      if(audienceData && audienceData.lastOnline && audienceData.lastOnline.status) {
        tempAudienceStatus = audienceData.lastOnline.status
      }else{
        tempAudienceStatus = "offline"
      }

      if(_isMounted.current) setAudienceStatus(tempAudienceStatus)
    })
  }

  const handleAppStateChange = (nextAppState) => {
    if(nextAppState === "active"){
      RoomsAPI.setInRoomStatus(room.id, currentUser.email,true)
    }else if(nextAppState === "background"){
      RoomsAPI.setInRoomStatus(room.id, currentUser.email,false)
    }else if(nextAppState === "inactive"){
      RoomsAPI.setInRoomStatus(room.id, currentUser.email,false)
    }
  }

  const handleUserHeaderPress = () => {
    if(isUserRegistered) props.navigation.navigate("PeopleInformation", { peopleEmail: peopleEmail });
  }
 
  React.useEffect(() => {
    RoomsAPI.setInRoomStatus(room.id, currentUser.email,true)
    fetchPeople();
    initMessages();

    AppState.addEventListener("change", handleAppStateChange);

    return function cleanup(){
      RoomsAPI.setInRoomStatus(room.id, currentUser.email,false)
      _isMounted.current = false
      if(messagesListener.current) messagesListener.current();
      if(roomListener.current) roomListener.current();
      if(audienceListener.current) audienceListener.current();
      AppState.removeEventListener("change", handleAppStateChange) 

    }
  }, [room, currentUser]);

  return (
    <KeyboardAvoidingView behavior={Platform.OS === "ios"? "padding": null} style={{ flex: 1 }}>
      <ChatHeader 
        navigation={navigation} title={headerTitle} subtitle={isInRoom? audienceStatus+" (live)" : audienceStatus } 
        profilePicture={headerProfilePicture} style={{ elevation: 0, borderBottomWidth: 1, borderColor: "#E8EEE8" }}
        onUserHeaderPress={handleUserHeaderPress} isFriend={isFriend}/>
      <ChatList messages={messages} onReachTop={handleChatListReachTop} room={room}/>
      <ChatBottomTextInput room={room} editable={isUserRegistered} onSendPress={handleSendPress}/>
    </KeyboardAvoidingView>
  )
}

ChatScreen.navigationOptions = { header: null }
export default withCurrentUser(ChatScreen);