import React from "react";

import { View } from "react-native";
import { Text, Avatar } from "react-native-paper";
import { default as MaterialIcons } from "react-native-vector-icons/MaterialIcons";

export default class MyBubble extends React.Component{
  render(){
    const sentIcon = this.props.isSent? "done-all": "done";
    return(
      <View style={{ flex: 1, flexDirection: "row-reverse", marginBottom: 8, marginTop: 8 }}>
        {this.props.withAvatar?(
          <Avatar.Text size={32} label="FH"/>
        ):<View/>}

        <View style={{ marginRight: this.props.withAvatar? 8: 40, marginLeft: 40 }}>
          <View style={{ borderRadius: 8, padding: 8, backgroundColor: "#0EAD69", alignItems: "flex-end" }}>
            <Text style={{ fontSize: 12, color: "white" }}>{this.props.message}</Text>
            <View style={{ paddingTop: 4, paddingBottom: 4, flexDirection: "row",alignItems: "center" }}>
              <Text style={{ textAlign: "right", fontWeight: "500", color: "#E8E8E8", fontSize: 8, marginRight: 4 }}>1:23PM</Text>
              <MaterialIcons name={sentIcon} color="#E8E8E8" size={10}/>
            </View>
          </View>
        </View>
      </View>
    )
  }
}
MyBubble.defaultProps = {
  withAvatar: false, isSent: false, message: "", sentTime: null
}