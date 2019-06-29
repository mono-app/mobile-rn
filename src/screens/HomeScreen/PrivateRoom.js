import React from "react";
import moment from "moment";
import { StyleSheet, View, TouchableOpacity } from 'react-native';
import { Text, Badge, withTheme } from "react-native-paper";

import CurrentUserAPI from "src/api/people/CurrentUser";
import PeopleAPI from "src/api/people";
import RoomsAPI from "src/api/rooms";

import CircleAvatar from "src/components/Avatar/Circle";
import { default as MaterialCommunityIcons } from "react-native-vector-icons/MaterialCommunityIcons";

const INITIAL_STATE = { people: null, hasUnread: false, unreadCount: 0 }

export class PrivateRoom extends React.PureComponent{
  constructor(props){
    super(props);
    this.state = INITIAL_STATE;
  }

  async componentDidMount(){
    const { id, audiences } = this.props;
    const currentUserEmail = await CurrentUserAPI.getCurrentUserEmail();
    const arrAudience = Object.keys(audiences);
    const realAudience = arrAudience.filter(audience => audience !== currentUserEmail)[0];
    const peopleData = await new PeopleAPI().getDetail(realAudience);
    const unreadCount = await RoomsAPI.getUnreadCount(id);
    const hasUnread = unreadCount !== 0 && unreadCount;
    this.setState({ people: peopleData, unreadCount, hasUnread });
  }

  async componentDidUpdate(){
    const { id } = this.props;
    const unreadCount = await RoomsAPI.getUnreadCount(id);
    const hasUnread = unreadCount !== 0 && unreadCount;
    this.setState({ unreadCount, hasUnread })
  }

  render(){
    const { colors } = this.props.theme;
    const { people } = this.state;
    let { lastMessage } = this.props;
    
    if(!lastMessage) lastMessage = { sentTime: null, message: "" }
    const sentTime = lastMessage.sentTime? new moment.unix(lastMessage.sentTime): null;

    let dateTimeString = null;
    if(sentTime){
      const isToday = new moment().diff(sentTime, "days") === 0;
      if(isToday) dateTimeString = sentTime.format("hh:mmA");
      else dateTimeString = sentTime.format("DD MMMM YYYY");
    }

    let newPeople = JSON.parse(JSON.stringify(people));
    if(people === null){
      newPeople = { applicationInformation: {} };
      newPeople.applicationInformation.nickName = "";
      newPeople.applicationInformation.profilePicture = "https://picsum.photos/200/200/?random";
    }

    return(
      <TouchableOpacity style={styles.chatContainer} onPress={this.props.onPress}>
        <View style={{ marginRight: 16 }}>
          <CircleAvatar size={50} uri={newPeople.applicationInformation.profilePicture}/>
        </View>
        <View style={{ width: 0, flexGrow: 1 }}>
          <Text style={{fontWeight: "500"}}>{newPeople.applicationInformation.nickName}</Text>
          <Text style={{fontSize: 12}}>{lastMessage.message}</Text>
        </View>
        <View style={{ flexDirection: "column" }}>
          <Text style={{ fontSize: 12, color: "#BACCBC" }}>{dateTimeString}</Text>
          {this.state.hasUnread?(
            <Badge style={{ marginTop: 4, backgroundColor: colors.primary }}>{this.state.unreadCount}</Badge>
          ):null}
        </View>
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
  }
})

export default withTheme(PrivateRoom)