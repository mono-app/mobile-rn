import React from "react";
import PropTypes from "prop-types";
import Logger from "src/api/logger";
import DiscussionAPI from "modules/Classroom/api/discussion";
import Key from "src/helper/key"
import { StyleSheet } from "react-native";
import { withCurrentUser } from "src/api/people/CurrentUser";
import { withNavigation } from "react-navigation";
import ChatBubble from "src/components/ChatBubble";
import ChatBubbleGroup from "src/components/ChatBubble/Group";
import ChatBubblePrivate from "src/components/ChatBubble/Private";
import ChatBubbleBot from "src/components/ChatBubble/Bot";
import { FlatList, View } from "react-native";
import { Chip } from "react-native-paper";
import MessagesAPI from "src/api/messages";
import AsyncStorage from '@react-native-community/async-storage';

function ChatList(props){
  const { currentUser, navigation, room } = props;
  
  const [ bgColor, setBgColor ] = React.useState("#fff");
  const [ messages, setMessages ] = React.useState([]);

  const messagesListener = React.useRef(null);
  const lastMessageSnapshot = React.useRef(null);
  const listHeight = React.useRef(0);
  const isLoadingNewMessage = React.useRef(false);
  const _isMounted = React.useRef(true)


  const styles = StyleSheet.create({
    container: { flexGrow: 1, paddingLeft: 16, paddingRight: 16, marginVertical: 4 }
  })

  const handleListContentSizeChange = (_, contentHeight) => listHeight.current = contentHeight
  const handleReachTop = async () => {
    Logger.log("ChatScreen.handleChatListReactTop", `Getting new messages ${isLoadingNewMessage.current}`)
    if(!isLoadingNewMessage.current){
      try{
        isLoadingNewMessage.current = true;
        const newData = await MessagesAPI.getNext(lastMessageSnapshot.current, room.id);
        //Logger.log("ChatScreen.handleChatListReachTop#newData", newData);
        if(_isMounted.current){
          lastMessageSnapshot.current = newData.lastDocumentSnapshot;
          
          setMessages((oldMessages) => {
            return MessagesAPI.appendDateSeparator([...oldMessages, ...newData.messages])
          });
        }
      }catch(err){
        Logger.log("ChatScreen.handleChatListReachTop#err", err);
      }finally{ 
        isLoadingNewMessage.current = false;
      }
    }
  }

  const handleListScroll = (e) => {
    const currentPosition = e.nativeEvent.contentOffset.y + e.nativeEvent.layoutMeasurement.height;
    const threshold = 1000;
    Logger.log("ChatList.handleListScroll#currentPosition", currentPosition);
    if(currentPosition >= (listHeight.current - threshold)) handleReachTop();
  }

  const handleOnPress = (item) => {
    if(item.type === "discussion-share"){
      handleDiscussionPress(item)
    }else if(item.type === "new-discussion"){
      handleDiscussionPress(item)
    }else if(item.type === "new-discussion-comment"){
      handleDiscussionPress(item)
    }else if(item.type === "moment-share"){
      handleMomentPress(item)
    }if(item.type === "moment-comment"){
      handleMomentCommentPress(item)
    }else if(item.type === "setup-birthday"){
      handleSetupBirthdayPress(item)
    }else if(item.type === "friend-request"){
      handleFriendRequestPress(item)
    }
  }

  const handleDiscussionPress = async (item) => {
    const schoolId = item.details.discussion.schoolId
    const classId = item.details.discussion.classId
    const taskId = item.details.discussion.taskId
    const discussionId = item.details.discussion.id
   
    const discussion = await DiscussionAPI.getDetail(schoolId, classId, taskId, discussionId, currentUser.id)
    
    payload = { isFromNotification: false, schoolId, classId, taskId, discussion }
    props.navigation.navigate("DiscussionComment", payload)
  }

  const handleMomentPress = (item) => {
    const payload = { momentId: item.details.moment.id }
    props.navigation.navigate("MomentComments", payload)
  }

  const handleMomentCommentPress = (item) => {
    const payload = { momentId: item.details.momentId }
    props.navigation.navigate("MomentComments", payload)
  }

  const handleSetupBirthdayPress = async (message) => {
    Logger.log("ChatList.handleSetupBirthdayPress#message", message);
    navigation.navigate({ routeName: "Account", key: "SettingsTab" })
  }

  const handleFriendRequestPress = async (message) => {
    Logger.log("ChatList.handleFriendRequestPress#message", message);
    navigation.navigate("PeopleInformation", { 
      peopleId: message.details.targetId, source: message.details.source
    });
  }

  const initializeBackground = async () => {
    const color = await AsyncStorage.getItem(Key.KEY_CHAT_BACKGROUND)
    if(color) setBgColor(color)
  }

  const fetchMessages = async () => {
    if(!messagesListener.current){
      messagesListener.current = MessagesAPI.getMessagesWithRealTimeUpdate(room.id, ({ addedMessages, modifiedMessages }, snapshot) => {
        lastMessageSnapshot.current = snapshot;
        if(addedMessages.length > 0){
          MessagesAPI.markAsRead(room.id, currentUser.id)
          setMessages((oldMessages) => {
            return MessagesAPI.appendDateSeparator([...addedMessages, ...oldMessages])
          });
        }
      }, 25)
    }
  }

  const keyExtractor = (item) => item.id
  const renderItem = ({ item }) => {
    const bubbleStyle = (currentUser.id !== item.senderId)? "peopleBubble": "myBubble";
    const isClickable = !(item.type === "text" || item.type === "date-separator" || item.type === "lets-start-chat")
    if(item.type === "date-separator" || item.type === "lets-start-chat"){
      return (
        <View style={{ display: "flex", flexGrow: 1, alignItems: "center", paddingVertical: 8, paddingHorizontal: 16 }}>
          <Chip>{item.details.value}</Chip>
        </View>
      )
    }else if(room.type==="group-chat"){
        return <ChatBubbleGroup style={{ marginBottom: 8, marginTop: 4 }} bubbleStyle={bubbleStyle} onPress={handleOnPress} clickable={isClickable} message={item} roomId={room.id}/>
    }else if(room.type==="chat"){
        return <ChatBubblePrivate style={{ marginBottom: 8, marginTop: 4 }} bubbleStyle={bubbleStyle} onPress={handleOnPress} clickable={isClickable} message={item} roomId={room.id}/>
    }else if(room.type==="bot"){
        return <ChatBubbleBot style={{ marginBottom: 8, marginTop: 4 }} bubbleStyle={bubbleStyle} onPress={handleOnPress} clickable={isClickable} message={item} roomId={room.id}/>
    }
  
  }
  
  React.useEffect(() => {
    initializeBackground();
    fetchMessages();
    return function cleanup(){ 
      _isMounted.current = false
      if(messagesListener.current) messagesListener.current();
    }
  }, [ room.id ]);

  
  return (
    <FlatList 
      style={[ styles.container, props.style,{backgroundColor: bgColor} ]} keyExtractor={keyExtractor}
      onScroll={handleListScroll} onContentSizeChange={handleListContentSizeChange}
      data={messages} extraData={messages} removeClippedSubviews={true} inverted
      maxToRenderPerBatch={25}
      initialNumToRender={25} 
      renderItem={renderItem}/>
  )
}

ChatList.propTypes = { 
  style: PropTypes.shape(), 
  room: PropTypes.shape().isRequired,
};
ChatList.defaultProps = { style: {}, isBot: false }
export default withNavigation(withCurrentUser(ChatList));