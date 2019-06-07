import React from "react";
import { View } from "react-native";
import { Text, Avatar, Caption } from "react-native-paper";
import { default as MaterialIcons } from "react-native-vector-icons/MaterialIcons";

import PeopleAPI from "src/api/people";
import CirlceAvatar from "src/components/Avatar/Circle";

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
        <CirlceAvatar size={50} style={{ marginRight: 16 }} uri={this.state.profilePicture}/>
        <View style={{ justifyContent: "center" }}>
          <Text style={{ fontWeight: "700" }}>{this.state.nickName}</Text>
          <Caption><MaterialIcons size={12} name="lock"/> Hanya teman</Caption>
        </View>
      </View>
    )
  }
}