import React from "react";
import FriendsAPI from "src/api/friends";
import RoomsAPI from "src/api/rooms";
import MessagesAPI from "src/api/messages";
import PeopleAPI from "src/api/people";
import { withCurrentUser } from "src/api/people/CurrentUser";
import { AppState, Platform } from "react-native";
import ChatLongPressDialog from "src/components/ChatLongPressDialog"
import ChatBottomTextInput from "src/components/ChatBottomTextInput";
import ChatList from "src/components/ChatList";
import ChatHeader from "src/components/ChatHeader";
import { KeyboardAvoidingView } from "react-native";

function ChatScreen(props){
  const { currentUser, navigation } = props;
  const room = navigation.getParam("room", null);
  const [ headerTitle, setHeaderTitle ] = React.useState("");
  const [ peopleId, setPeopleId ] = React.useState("");
  const [ isFriend, setFriend ] = React.useState(true);
  const [ isUserRegistered, setUserRegistered ] = React.useState(false);
  const [ headerProfilePicture, setHeaderProfilePicture ] = React.useState("");
  const [ showLongPressDialog, setShowLongPressDialog ] = React.useState(false);
  const [ selectedMessage, setSelectedMessage ] = React.useState({});
  const [ messageToReply, setMessageToReply ] = React.useState(null);
  
  const _isMounted = React.useRef(true);

  const handleSendPress = (message, replyMessage) => {
    MessagesAPI.sendMessage(room.id, currentUser.id, message, "text", null, replyMessage);
    setMessageToReply(null)
  }
  const handleAppStateChange = (nextAppState) => {
    if(nextAppState === "active"){
      RoomsAPI.setInRoomStatus(room.id, currentUser.id,true)
    }else if(nextAppState === "background"){
      RoomsAPI.setInRoomStatus(room.id, currentUser.id,false)
    }else if(nextAppState === "inactive"){
      RoomsAPI.setInRoomStatus(room.id, currentUser.id,false)
    }
  }

  const handleUserHeaderPress = () => {
    if(isUserRegistered) props.navigation.navigate("PeopleInformation", { peopleId: peopleId });
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

  const fetchPeople = () => {
    const audienceId = room.audiences.filter((audience) => audience !== currentUser.id)[0];
    if( _isMounted.current) setPeopleId(audienceId)

    PeopleAPI.getDetail(audienceId).then( (audienceData)=>{
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

    FriendsAPI.isFriends(currentUser.id, audienceId).then( isFriend => {
      if( _isMounted.current) setFriend(isFriend)
    })
  }
 
  React.useEffect(() => {
    AppState.addEventListener("change", handleAppStateChange);
    RoomsAPI.setInRoomStatus(room.id, currentUser.id,true)
    fetchPeople();
  
    return function cleanup(){
      _isMounted.current = false
      RoomsAPI.setInRoomStatus(room.id, currentUser.id,false)
      AppState.removeEventListener("change", handleAppStateChange) 
    }
  }, []);

  return (
    <KeyboardAvoidingView keyboardShouldPersistTaps={'handled'} behavior={Platform.OS === "ios"? "padding": null} style={{ flex: 1 }}>
      <ChatHeader 
        navigation={navigation} title={headerTitle} room={room} currentUser={currentUser}
        profilePicture={headerProfilePicture} style={{ elevation: 0, borderBottomWidth: 1, borderColor: "#E8EEE8" }}
        onUserHeaderPress={handleUserHeaderPress} isFriend={isFriend}/>
      <ChatList room={room} onLongPressItem={handleOnLongPress} />
      <ChatBottomTextInput room={room} editable={isUserRegistered} onSendPress={handleSendPress} replyMessage={messageToReply}/>
      <ChatLongPressDialog visible={showLongPressDialog} onDismiss={handleDismissLPDialog} message={selectedMessage} onReplyPress={handleReplyPress} />
    </KeyboardAvoidingView>
  )
}

ChatScreen.navigationOptions = { header: null }
export default withCurrentUser(ChatScreen);