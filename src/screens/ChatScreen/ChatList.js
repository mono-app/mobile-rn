import React from "react";
import PropTypes from "prop-types";
import Logger from "src/api/logger";
import { withCurrentUser } from "src/api/people/CurrentUser";
import DiscussionAPI from "modules/Classroom/api/discussion";
import ChatBubble from "src/screens/ChatScreen/ChatBubble";
import { FlatList } from "react-native";
import { StackActions, NavigationActions } from 'react-navigation';

function ChatList(props){
  const { messages, currentUser } = props;
  const [ listHeight, setListHeight ] = React.useState(0);

  const handleListContentSizeChange = (contentWidth, contentHeight) => {
    Logger.log("ChatList.handleListContentSizeChange#contentHeight", contentHeight);
    setListHeight(contentHeight);
  }

  const handleListScroll = (e) => {
    const currentPosition = e.nativeEvent.contentOffset.y + e.nativeEvent.layoutMeasurement.height;
    const threshold = 100;
    Logger.log("ChatList.handleListScroll#currentPosition", currentPosition);
    if(currentPosition >= (listHeight - threshold)) props.onReachTop();
  }

  const handleDiscussionSharePress = async (item) => {
    const schoolId = item.details.discussion.schoolId
    const classId = item.details.discussion.classId
    const taskId = item.details.discussion.taskId
    const discussionId = item.details.discussion.id
   
    const discussion = await DiscussionAPI.getDetail(schoolId, classId, taskId, discussionId, currentUser.email)
    // params: payload, key: "NotificationClassroom" 
    
    payload = {
      isFromNotification: false,
      schoolId,
      classId,
      taskId,
      discussion
    }
   
    props.navigation.navigate("DiscussionComment", payload)

  }

  return (
    <FlatList 
      style={{ flexGrow: 1, paddingLeft: 16, paddingRight: 16, marginVertical: 4 }} 
      onScroll={handleListScroll} onContentSizeChange={handleListContentSizeChange}
      data={messages} inverted={true}
      renderItem={({ item, index }) => {
        const bubbleStyle = (currentUser.email !== item.senderEmail)? "peopleBubble": "myBubble";
        if(item.type === "text") {
          return <ChatBubble style={{ marginBottom: 8, marginTop: 4 }} bubbleStyle={bubbleStyle} message={item}/>
        }else if(item.type === "discussion-share"){
          return <ChatBubble style={{ marginBottom: 8, marginTop: 4 }} bubbleStyle={bubbleStyle} clickable={true} onPress={() => handleDiscussionSharePress(item)} message={item}/>
        }
      }}/>
  )
}

ChatList.propTypes = { onReachTop: PropTypes.func };
ChatList.defaultProps = { onReachTop: () => {} }
export default withCurrentUser(ChatList);