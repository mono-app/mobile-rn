import React from "react";
import moment from "moment";
import { View } from "react-native";
import { Text, withTheme } from "react-native-paper";

import { default as MaterialIcons } from "react-native-vector-icons/MaterialIcons";

class ChatBubble extends React.PureComponent{
  constructor(props){
    super(props);

    const { colors } = this.props.theme;
    this.myBubbleStyle = {
      container: { display: "flex", flex: 1, flexDirection: "row-reverse", flexWrap: "wrap", marginVertical: 4 },
      content: { backgroundColor: colors.primary, padding: 8, borderRadius: 8, maxWidth: "80%" },
      metadataContent: { display: "flex", marginHorizontal: 8, alignSelf: "flex-end", alignItems: "flex-end" },
      text: { color: "white" }
    }

    this.peopleBubbleStyle = {
      container: { display: "flex", flexDirection: "row", marginVertical: 4, flexWrap: "wrap", flex: 1  },
      content: { backgroundColor: "white", padding: 8, borderRadius: 8, borderWidth: 1, borderColor: "#D3D9D3", maxWidth: "80%" },
      metadataContent: { display: "flex", marginHorizontal: 8, alignSelf: "flex-end", alignItems: "flex-start" },
      text: { color: "#161616" }
    }
  }

  render(){
    const { messageItem } = this.props;
    const timeString = messageItem.isSent? moment.unix(messageItem.sentTime).format("hh:mm A"): <MaterialIcons name="access-time" size={16}/>
    const readString = messageItem.read.isRead && this.props.bubbleStyle === "myBubble"? "Read": null;
    
    let selectedStyle = JSON.parse(JSON.stringify(this.myBubbleStyle));
    if(this.props.bubbleStyle === "peopleBubble") selectedStyle = JSON.parse(JSON.stringify(this.peopleBubbleStyle));

    return (
      <View style={selectedStyle.container}>
        <View style={selectedStyle.content}>
          <Text style={selectedStyle.text}>{messageItem.message}</Text>
        </View>
        <View style={selectedStyle.metadataContent}>
          <Text style={{ fontSize: 10, color: "#B9BBBA" }}>{readString}</Text>
          <Text style={{ fontSize: 10, color: "#B9BBBA" }}>{timeString}</Text>
        </View>
      </View>
    )
  }
}

ChatBubble.defaultProps = { bubbleStyle: "myBubble" }

export default withTheme(ChatBubble);