import React from "react";
import { View } from "react-native";
import { Text, Avatar, Caption } from "react-native-paper";
import moment from "moment";

import PeopleAPI from "src/api/people";
import TranslateAPI from "src/api/translate";

const INITIAL_STATE = { nickName: "" }

export default class CommentItem extends React.Component{
  refreshComment = () => {
    new PeopleAPI().getDetail(this.state.peopleEmail).then(people => {
      const { nickName } = people.applicationInformation;
      this.setState({ nickName });
    })
  }

  constructor(props){
    super(props);

    this.state = { INITIAL_STATE, ...this.props };
    this.refreshComment = this.refreshComment.bind(this);
  }

  componentDidMount(){ this.refreshComment(); }

  render(){
    const timeFromNow = moment(this.state.timestamp.seconds * 1000).fromNow();
    const shortTimeFromNow = TranslateAPI.shortTime(timeFromNow);

    return(
      <View style={{ flex: 1, flexDirection: "row", padding: 16, paddingVertical: 8 }}>
        <Avatar.Image size={50} source={{ uri: "https://picsum.photos/200/200/?random" }}/>
        <View style={{ paddingHorizontal: 8, flex: 1 }}>
          <Text style={{ fontWeight: "700" }}>{this.state.nickName}</Text>
          <Text>{this.state.comment}</Text>
        </View>
        <Caption>{shortTimeFromNow}</Caption>
      </View>
    )
  }
}