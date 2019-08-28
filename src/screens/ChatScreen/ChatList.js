import React from "react";
import PropTypes from "prop-types";
import Logger from "src/api/logger";
import { withCurrentUser } from "src/api/people/CurrentUser";

import ChatBubble from "src/screens/ChatScreen/ChatBubble";
import { FlatList } from "react-native";

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

  return (
    <FlatList 
      style={{ flexGrow: 1, paddingLeft: 16, paddingRight: 16, marginVertical: 4 }} 
      onScroll={handleListScroll} onContentSizeChange={handleListContentSizeChange}
      data={messages} inverted={true}
      renderItem={({ item, index }) => {
        const bubbleStyle = (currentUser.email !== item.senderEmail)? "peopleBubble": "myBubble";
        if(item.type === "text") {
          return <ChatBubble style={{ marginBottom: 8, marginTop: 4 }} bubbleStyle={bubbleStyle} message={item}/>
        }
      }}/>
  )
}

ChatList.propTypes = { onReachTop: PropTypes.func };
ChatList.defaultProps = { onReachTop: () => {} }
export default withCurrentUser(ChatList);