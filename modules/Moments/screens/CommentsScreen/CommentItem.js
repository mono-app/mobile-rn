import React from "react";
import { View } from "react-native";
import { Text, Avatar, Caption } from "react-native-paper";
import { default as MaterialCommunityIcons } from "react-native-vector-icons/MaterialCommunityIcons";
import moment from "moment";

import CurrentUserAPI from "src/api/people/CurrentUser";
import PeopleAPI from "src/api/people";
import TranslateAPI from "src/api/translate";

import PeopleDetailListener from "src/components/PeopleDetailListener";

const INITIAL_STATE = { nickName: "", profilePicture: "https://picsum.photos/200/200/?random" }

export default class CommentItem extends React.PureComponent{
  handlePeopleDetailListenerChange = (peopleData) => {
    const { applicationInformation } = peopleData;
    this.setState({ nickName: applicationInformation.nickName, profilePicture: applicationInformation.profilePicture });
  }

  constructor(props){
    super(props);

    this.state = INITIAL_STATE;
    this.handlePeopleDetailListenerChange = this.handlePeopleDetailListenerChange.bind(this);
  }

  render(){
    let shortTimeFromNow =  <MaterialCommunityIcons name="progress-clock" size={16}/>
    if(this.props.timestamp !== null){
      const timeFromNow = moment(this.props.timestamp.seconds * 1000).fromNow();
      shortTimeFromNow = TranslateAPI.shortTime(timeFromNow);
    }

    return(
      <View style={{ flex: 1, flexDirection: "row", padding: 16, paddingVertical: 8 }}>

        <PeopleDetailListener peopleEmail={this.props.peopleEmail} onChange={this.handlePeopleDetailListenerChange}/>

        <Avatar.Image size={50} source={{ uri: this.state.profilePicture, cache: "force-cache" }}/>
        <View style={{ paddingHorizontal: 8, flex: 1 }}>
          <Text style={{ fontWeight: "700" }}>{this.state.nickName}</Text>
          <Text>{this.props.comment}</Text>
        </View>
        <Caption>{shortTimeFromNow}</Caption>
      </View>
    )
  }
}