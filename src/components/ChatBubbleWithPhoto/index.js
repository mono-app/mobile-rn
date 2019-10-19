import React from "react";
import PropTypes from "prop-types";
import PeopleAPI from "src/api/people";
import Logger from "src/api/logger";

import ChatBubble from "src/components/ChatBubble";
import CircleAvatar from "src/components/Avatar/Circle";
import { View } from "react-native";

function ChatBubbleWithPhoto(props){
  const { bubbleStyle } = props;
  const { senderEmail } = props.message;

  const [ sender, setSender ] = React.useState({ profilePicture: "" });

  const styles = {
    container: { display: "flex", flexDirection: "row", alignItems: "flex-end" },
    avatar: { marginRight: 8, marginBottom: 8 }
  }

  const fetchSender = async () => {
    Logger.log("ChatBubbleWithPhoto.fetchSender#senderEmail", senderEmail);
    const sender = await PeopleAPI.getDetail(senderEmail);
    Logger.log("ChatBubbleWithPhoto.fetchSender#sender", sender);
    setSender(sender);
  }

  React.useEffect(() => {
    Logger.log("ChatBubbleWithPhoto#props", props);
    Logger.log("ChatBubbleWithPhoto#bubbleStyle", bubbleStyle);
    if(bubbleStyle === "myBubble") return;
    fetchSender();
  }, [senderEmail, bubbleStyle])

  return (
    <View style={[ styles.container, props.containerStyle ]}>
      {bubbleStyle !== "myBubble"? (
        <CircleAvatar uri={sender.profilePicture} style={[ styles.avatar, props.avatarStyle ]} size={32}/>
      ): null}
      <ChatBubble {...props}/>
    </View>
  )
}

ChatBubbleWithPhoto.propTypes = { 
  bubbleStyle: PropTypes.string.isRequired,
  message: PropTypes.shape({
    senderEmail: PropTypes.string.isRequired
  }).isRequired
}
ChatBubbleWithPhoto.defaultProps = { containerStyle: {}, avatarStyle: {} }
export default ChatBubbleWithPhoto;