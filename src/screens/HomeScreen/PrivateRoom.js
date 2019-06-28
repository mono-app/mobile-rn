import React from "react";
import moment from "moment";
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';

import CurrentUserAPI from "src/api/people/CurrentUser";
import PeopleAPI from "src/api/people";

import CircleAvatar from "src/components/Avatar/Circle";
import { default as MaterialCommunityIcons } from "react-native-vector-icons/MaterialCommunityIcons";

const INITIAL_STATE = { people: null }

export default class PrivateRoom extends React.PureComponent{
  constructor(props){
    super(props);
    this.state = INITIAL_STATE;
  }

  async componentDidMount(){
    const { audiences } = this.props;
    const currentUserEmail = await CurrentUserAPI.getCurrentUserEmail();
    const arrAudience = Object.keys(audiences);
    const realAudience = arrAudience.filter(audience => audience !== currentUserEmail)[0];
    const peopleData = await new PeopleAPI().getDetail(realAudience);
    this.setState({ people: peopleData });
  }

  render(){
    const { lastMessage } = this.props;
    const { people } = this.state;
    const sentTime = lastMessage.sentTime? lastMessage.sentTime.seconds * 1000: null;

    let dateTimeString = <MaterialCommunityIcons name="progress-clock" size={24} style={{ color: "#5E8864" }}/>;
    if(sentTime){
      const isToday = new moment().diff(sentTime, "days") === 0;
      if(isToday) dateTimeString = new moment(sentTime).format("HH:mmA");
      else new moment(sentTime).format("DD MMMM YYYY");
    }

    let newPeople = JSON.parse(JSON.stringify(people));
    if(people === null){
      newPeople = { applicationInformation: {} };
      newPeople.applicationInformation.nickName = "";
      newPeople.applicationInformation.profilePicture = "https://picsum.photos/200/200/?random";
    }

    return(
      <TouchableOpacity style={styles.chatContainer} onPress={this.props.onPress}>
        <View style={styles.photoContainer}>
          <CircleAvatar size={50} uri={newPeople.applicationInformation.profilePicture}/>
        </View>
        <View style={styles.descriptionContainer}>
          <Text style={{fontWeight: "500"}}>{newPeople.applicationInformation.nickName}</Text>
          <Text style={{fontSize: 12}}>{lastMessage.message}</Text>
        </View>
        <Text style={styles.timestamp}>{dateTimeString}</Text>
      </TouchableOpacity>
    )
  }
}

const styles = StyleSheet.create({
  chatContainer: {
    flexDirection: "row",
    backgroundColor: "white",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#E8EEE8"
  },
  photoContainer: { marginRight: 16 },
  descriptionContainer: { 
    width:0, 
    flexGrow: 1
  },
  timestamp: {
    fontSize: 12,
    color: "#BACCBC"
  }
})