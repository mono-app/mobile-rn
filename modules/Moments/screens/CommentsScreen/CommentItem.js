import React from "react";
import { View } from "react-native";
import { Text, Avatar, Caption } from "react-native-paper";
import { default as MaterialCommunityIcons } from "react-native-vector-icons/MaterialCommunityIcons";
import moment from "moment";

import CurrentUserAPI from "src/api/people/CurrentUser";
import PeopleAPI from "src/api/people";
import TranslateAPI from "src/api/translate";

const INITIAL_STATE = { nickName: "", profilePicture: "https://picsum.photos/200/200/?random" }

export default class CommentItem extends React.PureComponent{
  refreshComment = async () => {
    let selectedApi = CurrentUserAPI;
    
    const currentUserEmail = await CurrentUserAPI.getCurrentUserEmail();
    if(currentUserEmail === this.props.peopleEmail) selectedApi = new PeopleAPI();

    const peopleData = await selectedApi.getDetail(this.props.peopleEmail);
    const { nickName, profilePicture } = peopleData.applicationInformation;
    this.setState({ nickName, profilePicture });
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