import React from "react";
import { View } from "react-native";
import { Text, Avatar, Caption } from "react-native-paper";
import { default as MaterialCommunityIcons } from "react-native-vector-icons/MaterialCommunityIcons";
import moment from "moment";

import PeopleAPI from "src/api/people";
import TranslateAPI from "src/api/translate";

const INITIAL_STATE = { nickName: "" }

export default class CommentItem extends React.Component{
  refreshComment = () => {
    new PeopleAPI().getDetail(this.props.peopleEmail).then(people => {
      const { nickName } = people.applicationInformation;
      this.setState({ nickName });
    })
  }

  constructor(props){
    super(props);

    this.state = { INITIAL_STATE };
    this.refreshComment = this.refreshComment.bind(this);
  }

  componentDidMount(){ this.refreshComment(); }

  render(){
    let shortTimeFromNow =  <MaterialCommunityIcons name="progress-clock" size={16}/>
    if(this.props.timestamp !== null){
      const timeFromNow = moment(this.props.timestamp.seconds * 1000).fromNow();
      shortTimeFromNow = TranslateAPI.shortTime(timeFromNow);
    }

    return(
      <View style={{ flex: 1, flexDirection: "row", padding: 16, paddingVertical: 8 }}>
        <Avatar.Image size={50} source={{ uri: "https://picsum.photos/200/200/?random" }}/>
        <View style={{ paddingHorizontal: 8, flex: 1 }}>
          <Text style={{ fontWeight: "700" }}>{this.state.nickName}</Text>
          <Text>{this.props.comment}</Text>
        </View>
        <Caption>{shortTimeFromNow}</Caption>
      </View>
    )
  }
}