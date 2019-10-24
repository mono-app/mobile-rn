import React from "react";
import PropTypes from "prop-types";
import Logger from "src/api/logger";
import DiscussionAPI from "modules/Classroom/api/discussion";
import PeopleAPI from "src/api/people";
import moment from "moment";
import Key from "src/helper/key"
import { StyleSheet } from "react-native";
import { withCurrentUser } from "src/api/people/CurrentUser";
import { withNavigation } from "react-navigation";


import ChatBubble from "src/components/ChatBubble";
import ChatBubbleWithPhoto from "src/components/ChatBubbleWithPhoto";
import { FlatList, View, AsyncStorage } from "react-native";
import { Chip } from "react-native-paper";
import MessagesAPI from "src/api/messages";

function ChatList(props){
  const { currentUser, navigation, room } = props;
  const SelectedBubble = room.audiences.length > 2? ChatBubbleWithPhoto: ChatBubble;
  
  const [ bgColor, setBgColor ] = React.useState("#fff");
  const [ messages, setMessages ] = React.useState([]);

  const messagesListener = React.useRef(null);
  const lastMessageSnapshot = React.useRef(null);
  // const listHeight = React.useRef(0);
  // const isLoadingNewMessage = React.useRef(false);


  const styles = StyleSheet.create({
    container: { flexGrow: 1, paddingLeft: 16, paddingRight: 16, marginVertical: 4 }
  })

  // const handleListContentSizeChange = (_, contentHeight) => listHeight.current = contentHeight
  // const handleReachTop = async () => {
  //   Logger.log("ChatScreen.handleChatListReactTop", `Getting new messages ${isLoadingNewMessage}`)
  //   if(!isLoadingNewMessage){
  //     try{
  //       isLoadingNewMessage.current = true;
  //       const newData = await MessagesAPI.getNext(lastMessageSnapshot, room.id);
  //       const combinedMessages = messages.concat(newData.messages);
  //       Logger.log("ChatScreen.handleChatListReachTop#combineMessages", combinedMessages);
  //       Logger.log("ChatScreen.handleChatListReachTop#newData", newData);
  //       if(_isMounted.current){
  //         lastMessageSnapshot.current = newData.lastDocumentSnapshot;
  //         setMessages(MessagesAPI.appendDateSeparator(combinedMessages));
  //       }
  //     }catch(err){
  //       Logger.log("ChatScreen.handleChatListReachTop#err", err);
  //     }finally{ 
  //       isLoadingNewMessage.current = false;
  //     }
  //   }
  // }

  // const handleListScroll = (e) => {
  //   const currentPosition = e.nativeEvent.contentOffset.y + e.nativeEvent.layoutMeasurement.height;
  //   const threshold = 100;
  //   Logger.log("ChatList.handleListScroll#currentPosition", currentPosition);
  //   if(currentPosition >= (listHeight.current - threshold)) handleReachTop();
  // }

  const handleDiscussionPress = async (item) => {
    const schoolId = item.details.discussion.schoolId
    const classId = item.details.discussion.classId
    const taskId = item.details.discussion.taskId
    const discussionId = item.details.discussion.id
   
    const discussion = await DiscussionAPI.getDetail(schoolId, classId, taskId, discussionId, currentUser.email)
    
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
      peopleEmail: message.details.targetEmail, source: message.details.source
    });
  }

  const initializeBackground = async () => {
    const color = await AsyncStorage.getItem(Key.KEY_CHAT_BACKGROUND)
    if(color) setBgColor(color)
  }

  const fetchArchived = async () => {
    const messages = await MessagesAPI.getMessages(room.id);
    messages.shift();
    setMessages((oldMessages) => [...oldMessages, ...messages]);
  }

  const fetchMessages = async () => {
    if(!messagesListener.current){
      messagesListener.current = MessagesAPI.getMessagesWithRealTimeUpdate(room.id, ({ addedMessages, modifiedMessages }, snapshot) => {
        console.log(addedMessages, modifiedMessages);
        lastMessageSnapshot.current = snapshot;
        if(addedMessages.length > 0){
          MessagesAPI.bulkMarkAsRead(room.id, currentUser.email).then((result) => {
            if(result) props.setUnreadChat(room.id, 0);
          })
          setMessages((oldMessages) => [...addedMessages, ...oldMessages]);
        }
      })
    }
  }

  const keyExtractor = (item) => item.id
  const renderItem = ({ item }) => {
    const bubbleStyle = (currentUser.email !== item.senderEmail)? "peopleBubble": "myBubble";
    if(item.type === "text") {
      return <SelectedBubble style={{ marginBottom: 8, marginTop: 4 }} bubbleStyle={bubbleStyle} message={item}/>
    }else if(item.type === "discussion-share"){
      return <SelectedBubble style={{ marginBottom: 8, marginTop: 4 }} bubbleStyle={bubbleStyle} clickable={true} onPress={handleDiscussionPress} message={item} roomId={room.id}/>
    }else if(item.type === "new-discussion"){
      return <SelectedBubble style={{ marginBottom: 8, marginTop: 4 }} bubbleStyle={bubbleStyle} clickable={true} onPress={handleDiscussionPress} message={item} roomId={room.id}/>
    }else if(item.type === "new-discussion-comment"){
      return <SelectedBubble style={{ marginBottom: 8, marginTop: 4 }} bubbleStyle={bubbleStyle} clickable={true} onPress={handleDiscussionPress} message={item} roomId={room.id}/>
    }else if(item.type === "moment-share"){
      return <SelectedBubble style={{ marginBottom: 8, marginTop: 4 }} bubbleStyle={bubbleStyle} clickable={true} onPress={handleMomentPress} message={item} roomId={room.id}/>
    }else if(item.type === "moment-comment"){
      return <SelectedBubble style={{ marginBottom: 8, marginTop: 4 }} bubbleStyle={bubbleStyle} clickable={true} onPress={handleMomentCommentPress} message={item} roomId={room.id}/>
    }else if(item.type === "setup-birthday"){
      return <SelectedBubble style={{ marginBottom: 8, marginTop: 4 }} bubbleStyle={bubbleStyle} clickable={true} onPress={handleSetupBirthdayPress} message={item} roomId={room.id}/>
    }else if(item.type === "friend-request"){
      return <SelectedBubble style={{ marginBottom: 8, marginTop: 4 }} bubbleStyle={bubbleStyle} clickable={true} onPress={handleFriendRequestPress} message={item} roomId={room.id}/>
    }else if(item.type === "date-separator" || item.type === "lets-start-chat"){
      return (
        <View style={{ display: "flex", flexGrow: 1, alignItems: "center", paddingVertical: 8, paddingHorizontal: 16 }}>
          <Chip>{item.details.value}</Chip>
        </View>
      )
    }
  }
  
  React.useEffect(() => {
    initializeBackground();
    fetchArchived();
    fetchMessages();
    return function cleanup(){ 
      if(messagesListener.current) messagesListener.current();
    }
  }, [ room.id ]);

  // onScroll={handleListScroll} onContentSizeChange={handleListContentSizeChange}
  return (
    <FlatList 
      style={[ styles.container, props.style,{backgroundColor: bgColor} ]} keyExtractor={keyExtractor}
      data={messages} extraData={messages} removeClippedSubviews={true} inverted
      maxToRenderPerBatch={1} updateCellsBatchingPeriod={5000}
      initialNumToRender={10} windowSize={2}
      renderItem={renderItem}/>
  )
}

ChatList.propTypes = { 
  style: PropTypes.shape(), 
  room: PropTypes.shape().isRequired,
};
ChatList.defaultProps = { onReachTop: () => {}, style: {} }
export default withNavigation(withCurrentUser(ChatList));