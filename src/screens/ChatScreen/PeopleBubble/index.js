import React from "react";
import moment from "moment";
import { View } from "react-native";
import { Text, Avatar } from "react-native-paper";

import PeopleAPI from "src/api/people";
import CircleAvatar from "src/components/Avatar/Circle";

const INITIAL_STATE = { profilePicture: "" }

export default class PeopleBubble extends React.PureComponent{
  loadProfilePicture = () => {
    if(this.props.withAvatar && this.props.senderEmail) {
      new PeopleAPI().getDetail(this.props.senderEmail).then(people => {
        this.setState({ profilePicture: people.applicationInformation.profilePicture });
      })
    }
  }

  constructor(props){
    super(props);

    this.state = INITIAL_STATE;
    this.loadProfilePicture = this.loadProfilePicture.bind(this);
  }

  componentDidMount(){ this.loadProfilePicture(); }

  render(){
    const sentTimeString = this.props.isSent? moment(this.props.sentTime.seconds * 1000).format("HH:mmA"):"";
    return(
      <View style={{ flexDirection: "row", marginBottom: 8, marginTop: 8 }}>
        {this.props.withAvatar?(
          <CircleAvatar size={32} uri={this.state.profilePicture}/>
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
