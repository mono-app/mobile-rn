import React from "react";
import PropTypes from "prop-types";
import moment from "moment";
import MessageAPI from "src/api/messages";
import PeopleAPI from "src/api/people";
import Logger from "src/api/logger";
import ChatBubbleGroup from "src/components/ChatBubble/Group";
import ChatBubblePrivate from "src/components/ChatBubble/Private";
import ChatBubbleBot from "src/components/ChatBubble/Bot";
import { View } from "react-native";

function ChatBubble(props){
  const { clickable, bubbleStyle, message, roomId, attachedMessages, type } = props;
  const { content, sentTime, isSent, senderId } = props.message;
  const [ sentTimeString, setSentTimeString ] = React.useState("");
  const [ enabledMore, setEnableMore ] = React.useState("");
  const [ sender, setSender ] = React.useState({ profilePicture: "https://picsum.photos/200/200/?random", applicationInformation: { nickName: "" } });
  const [ isClicked, setClicked ] = React.useState(true);
  const maxContentLength = 100

  const handleOnPress = (message) => {
    if(attachedMessages.length===0){
      if(clickable) {
        MessageAPI.setMessageStatusClicked(roomId, message.id)
        setClicked(true)
        props.onPress(message);
      }
    }else{
      
    }
  }
  
  const handleOnEnableMorePress = (val) => setEnableMore(val)
  const handleLongPress = () => props.onLongPress(message)
  
  const fetchSender = async () => {
    Logger.log("ChatBubbleGroup.fetchSender#senderId", senderId);
    const sender = await PeopleAPI.getDetail(senderId);
    Logger.log("ChatBubbleGroup.fetchSender#sender", sender);
    setSender(sender);
  }

  React.useEffect(() => {
    setClicked(message.isClicked===true)
    if(isSent) setSentTimeString(new moment.unix(sentTime.seconds).format("HH:mmA"));
    if(content.length>maxContentLength) setEnableMore(true)
    else setEnableMore(false)
  }, [isSent, sentTime])

  React.useEffect(() => {
    if(bubbleStyle === "myBubble") return;
    fetchSender();
  }, [senderId, bubbleStyle])


  return (
    <View style={{...props.style}}>
      {(type==="group-chat")? 
        <ChatBubbleGroup bubbleStyle={bubbleStyle} onPress={handleOnPress} enabledMore={enabledMore} sentTimeString={sentTimeString}
        onLongPress={handleLongPress} clickable={clickable} sender={sender} message={message} onPressEnableMore={handleOnEnableMorePress} isClicked={isClicked} />
      : (type==="chat")? 
        <ChatBubblePrivate bubbleStyle={bubbleStyle} onPress={handleOnPress} enabledMore={enabledMore} sentTimeString={sentTimeString}
        onLongPress={handleLongPress} clickable={clickable} sender={sender} message={message} onPressEnableMore={handleOnEnableMorePress} isClicked={isClicked} />
      : (type==="bot")? 
        <ChatBubbleBot bubbleStyle={bubbleStyle} onPress={handleOnPress} enabledMore={enabledMore} sentTimeString={sentTimeString}
            onLongPress={handleLongPress} clickable={clickable} sender={sender} message={message} onPressEnableMore={handleOnEnableMorePress} isClicked={isClicked} />
      :null
      }
    </View>
  )
}

ChatBubble.defaultProps = { bubbleStyle: "myBubble" }
ChatBubble.propTypes = { 
  type: PropTypes.string.isRequired,
  onPress: PropTypes.func, clickable: PropTypes.bool,
  bubbleStyle: PropTypes.string.isRequired,
  message: PropTypes.shape({
    content: PropTypes.string.isRequired, 
    sentTime: PropTypes.any.isRequired,
    isSent: PropTypes.bool.isRequired
  }).isRequired
}
ChatBubble.defaultProps = { onPress: () => {}, clickable: false, attachedMessages: [] }
export default ChatBubble;