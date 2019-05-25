import React from "react";
import moment from "moment";
import { View } from "react-native";
import { Text, Avatar } from "react-native-paper";

export default class PeopleBubble extends React.Component{
  render(){
    const sentTimeString = this.props.isSent? moment(this.props.sentTime.seconds * 1000).format("HH:mmA"):"";
    return(
      <View style={{ flexDirection: "row", marginBottom: 8, marginTop: 8 }}>
        {this.props.withAvatar?(
          <Avatar.Image size={32} source={{ uri: this.props.sender.applicationInformation.profilePicture }}/>
        ):<View/>}

        <View style={{ width: 0, flexGrow: 1, marginLeft: this.props.withAvatar? 8: 40, marginRight: 40,  alignItems: "flex-start"}}>
          <View style={{ borderRadius: 8, padding: 8, borderWidth: 1, borderColor:"#D3D9D3", backgroundColor: "white" }}>
            <Text style={{ fontSize: 12, color: "#161616" }}>{this.props.message}</Text>
            <View style={{ paddingTop: 4, paddingBottom: 4, flexDirection: "row", alignItems: "center" }}>
              <Text style={{ fontWeight: "500", color: "#B9BBBA", fontSize: 8 }}>{sentTimeString}</Text>
            </View>
          </View>
        </View>
      </View>
    )
  }
}

PeopleBubble.defaultProps = {
  withAvatar: false, isSent: false, message: "", sentTime: null
}
