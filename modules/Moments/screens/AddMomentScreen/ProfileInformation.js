import React from "react";
import { View } from "react-native";
import { Text, Avatar, Caption } from "react-native-paper";
import { default as MaterialIcons } from "react-native-vector-icons/MaterialIcons";

import PeopleAPI from "src/api/people";

const INITIAL_STATE = { nickName: "", profilePicture: "https://picsum.photos/200/200/?random" }

export default class ProfileInformation extends React.Component{
  constructor(props){
    super(props);

    this.state = INITIAL_STATE;
  }

  componentDidMount(){
    const peopleApi = new PeopleAPI();
    peopleApi.getCurrentUserEmail().then(currentUserEmail => {
      return peopleApi.getDetail(currentUserEmail);
    }).then(people => {
      const { nickName, profilePicture } = people.applicationInformation;
      this.setState({ nickName, profilePicture });
    })
  }

  render(){
    return(
      <View style={{ padding: 16, flexDirection: "row", alignItems: "flex-start" }}>
        <Avatar.Image size={50} source={{ uri: this.state.profilePicture }} style={{ marginRight: 16 }}/>
        <View style={{ justifyContent: "center" }}>
          <Text style={{ fontWeight: "700" }}>{this.state.nickName}</Text>
          <Caption><MaterialIcons size={12} name="lock"/> Hanya teman</Caption>
        </View>
      </View>
    )
  }
}