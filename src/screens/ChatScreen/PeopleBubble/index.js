import React from "react";
import { View } from "react-native";
import { Text, Avatar } from "react-native-paper";
import { default as MaterialIcons } from "react-native-vector-icons/MaterialIcons";

export default class PeopleBubble extends React.Component{
  render(){
    const sentIcon = this.props.isSent? "done-all": "done";

    return(
      <View style={{ flexDirection: "row", marginBottom: 8, marginTop: 8 }}>
        {this.props.withAvatar?(
          <Avatar.Text size={32} label="FH"/>
        ):<View/>}

        <View style={{ width: 0, flexGrow: 1, marginLeft: this.props.withAvatar? 8: 40, marginRight: 40,  alignItems: "flex-start"}}>
          <View style={{ borderRadius: 8, padding: 8, borderWidth: 1, borderColor:"#D3D9D3", backgroundColor: "white" }}>
            <Text style={{ fontSize: 12, color: "#161616" }}>{this.props.message}</Text>
            <View style={{ paddingTop: 4, paddingBottom: 4, flexDirection: "row", alignItems: "center" }}>
              <MaterialIcons name={sentIcon} color="#B9BBBA" size={10}/>
              <Text style={{ fontWeight: "500", color: "#B9BBBA", fontSize: 8, marginLeft: 4 }}>1:23PM</Text>
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
