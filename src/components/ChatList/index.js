import React from "react";
import PropTypes from "prop-types";
import Logger from "src/api/logger";
import DiscussionAPI from "modules/Classroom/api/discussion";
import Key from "src/helper/key"
import { StyleSheet } from "react-native";
import { withNavigation } from "react-navigation";
import ChatBubble from "src/components/ChatBubble";
import { FlatList, View } from "react-native";
import { Chip } from "react-native-paper";
import MessagesAPI from "src/api/messages";
import AsyncStorage from '@react-native-community/async-storage';
import firebase from 'react-native-firebase';

function ChatList(props){
  const { navigation, room } = props;
  const firebaseCurrentUser = firebase.auth().currentUser
  const [ bgColor, setBgColor ] = React.useState("#fff");
  const [ messages, setMessages ] = React.useState([]);
  const messagesListener = React.useRef(null);
  const lastMessageSnapshot = React.useRef(null);
  const listHeight = React.useRef(0);
  const isLoadingNewMessage = React.useRef(false);
  const _isMounted = React.useRef(true)
  const flatListRef = React.useRef(null)

  const styles = StyleSheet.create({
    container: { flexGrow: 1, paddingLeft: 16, paddingRight: 16, marginVertical: 4 }
  })

  const scrollToBottom = () => {
    flatListRef.current.scrollToOffset({ animated: false, offset: 0 });
  }

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

  const handleLongPress = (message) => {
    props.onLongPressItem(message)
  }

  const handleOnPress = (message) => {
    if(message.type === "discussion-share"){
      handleDiscussionPress(message)
    }else if(message.type === "new-discussion"){
      handleDiscussionPress(message)
    }else if(message.type === "new-discussion-comment"){
      handleDiscussionPress(message)
    }else if(message.type === "moment-share"){
      handleMomentPress(message)
    }if(message.type === "moment-comment"){
      handleMomentCommentPress(message)
    }else if(message.type === "setup-birthday"){
      handleSetupBirthdayPress(message)
    }else if(message.type === "friend-request"){
      handleFriendRequestPress(message)
    }
  }

  const handleDiscussionPress = async (item) => {
    const schoolId = item.details.discussion.schoolId
    const classId = item.details.discussion.classId
    const taskId = item.details.discussion.taskId
    const discussionId = item.details.discussion.id
   
    const discussion = await DiscussionAPI.getDetail(schoolId, classId, taskId, discussionId, firebaseCurrentUser.uid)
    
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
          MessagesAPI.markAsRead(room.id, firebaseCurrentUser.uid)
          setMessages((oldMessages) => {
            return MessagesAPI.appendDateSeparator([...addedMessages, ...oldMessages])
          });
        }
      }, 25)
    }
  }

  const keyExtractor = (item) => item.id
  const renderItem = ({ item }) => {
    const bubbleStyle = (firebaseCurrentUser.uid !== item.senderId)? "peopleBubble": "myBubble";
    const isClickable = !(item.type === "text" || item.type === "date-separator" || item.type === "lets-start-chat" || item.type === "forwarded")
    if(item.type === "date-separator" || item.type === "lets-start-chat"){
      return (
        <View style={{ display: "flex", flexGrow: 1, alignItems: "center", paddingVertical: 8, paddingHorizontal: 16 }}>
          <Chip>{item.details.value}</Chip>
        </View>
      )
    }else{
      return <ChatBubble type={room.type} style={{ marginBottom: 8, marginTop: 4 }} bubbleStyle={bubbleStyle}
      onPress={handleOnPress} onLongPress={handleLongPress} clickable={isClickable} message={item} roomId={room.id}/>
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
      keyboardShouldPersistTaps={'handled'}
      style={[ styles.container, props.style,{backgroundColor: bgColor} ]} keyExtractor={keyExtractor}
      onScroll={handleListScroll} onContentSizeChange={handleListContentSizeChange}
      data={messages} extraData={messages} removeClippedSubviews={true} inverted
      maxToRenderPerBatch={25}
      initialNumToRender={25} 
      ref={i => flatListRef.current = i}
      renderItem={renderItem}/>
  )
}

ChatList.propTypes = { 
  style: PropTypes.shape(), 
  onLongPressItem: PropTypes.func,
  room: PropTypes.shape().isRequired,
};
ChatList.defaultProps = { style: {}, isBot: false, onLongPressItem: () => {} }
export default withNavigation(ChatList);