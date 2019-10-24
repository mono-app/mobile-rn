import React from "react";
import FriendsAPI from "src/api/friends";
import RoomsAPI from "src/api/rooms";
import MessagesAPI from "src/api/messages";
import PeopleAPI from "src/api/people";
import { withCurrentUser } from "src/api/people/CurrentUser";
import { AppState, Platform } from "react-native";

import ChatBottomTextInput from "src/components/ChatBottomTextInput";
import ChatList from "src/components/ChatList";
import ChatHeader from "src/components/ChatHeader";
import { KeyboardAvoidingView } from "react-native";

function ChatScreen(props){
  const { currentUser, navigation } = props;

  const room = navigation.getParam("room", null);

  const [ headerTitle, setHeaderTitle ] = React.useState("");
  const [ peopleEmail, setPeopleEmail ] = React.useState("");
  const [ audienceStatus, setAudienceStatus ] = React.useState("");
  const [ isInRoom, setInRoom ] = React.useState(false);
  const [ isFriend, setFriend ] = React.useState(true);
  const [ isUserRegistered, setUserRegistered ] = React.useState(false);
  const [ headerProfilePicture, setHeaderProfilePicture ] = React.useState("");
  
  const audienceListener = React.useRef(null);
  const roomListener = React.useRef(null);
  const _isMounted = React.useRef(true);

  const handleSendPress = (message) => MessagesAPI.sendMessage(room.id, currentUser.email, message);
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
  
  const initRoom = () => {
    const audiences = room.audiences.filter((audience) => audience !== currentUser.email);
    roomListener.current = RoomsAPI.getDetailWithRealTimeUpdate(room.id, (data)=>{
      const userInRoomList = data.inRoom
      if(userInRoomList && userInRoomList.length>0 && userInRoomList.includes(audiences[0])){
       if( _isMounted.current) setInRoom(true)
      }else{
        if( _isMounted.current) setInRoom(false)
      }
    })
  };

  const initAudience = () => {
    const audiences = room.audiences.filter((audience) => audience !== currentUser.email);
    audienceListener.current = PeopleAPI.getDetailWithRealTimeUpdate(audiences[0], (audienceData)=>{
      const tempAudienceStatus = (audienceData && audienceData.lastOnline && audienceData.lastOnline.status)? audienceData.lastOnline.status: "offline";
      if(_isMounted.current) setAudienceStatus(tempAudienceStatus)
    })
  };
 
  React.useEffect(() => {
    AppState.addEventListener("change", handleAppStateChange);
    RoomsAPI.setInRoomStatus(room.id, currentUser.email,true)
    fetchPeople();
    initRoom();
    initAudience();

    return function cleanup(){
      _isMounted.current = false
      RoomsAPI.setInRoomStatus(room.id, currentUser.email,false)
      AppState.removeEventListener("change", handleAppStateChange) 
      if(roomListener.current) roomListener.current();
      if(audienceListener.current) audienceListener.current();
    }
  }, [room, currentUser]);

  return (
    <KeyboardAvoidingView keyboardShouldPersistTaps={'handled'} behavior={Platform.OS === "ios"? "padding": null} style={{ flex: 1 }}>
      <ChatHeader 
        navigation={navigation} title={headerTitle} subtitle={isInRoom? audienceStatus+" (live)" : audienceStatus } 
        profilePicture={headerProfilePicture} style={{ elevation: 0, borderBottomWidth: 1, borderColor: "#E8EEE8" }}
        onUserHeaderPress={handleUserHeaderPress} isFriend={isFriend}/>
      <ChatList room={room}/>
      <ChatBottomTextInput navigation={props.navigation} room={room} editable={isUserRegistered} onSendPress={handleSendPress}/>
    </KeyboardAvoidingView>
  )
}

ChatScreen.navigationOptions = { header: null }
export default withCurrentUser(ChatScreen);