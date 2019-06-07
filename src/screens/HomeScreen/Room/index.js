import React from "react";
import moment from "moment";
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';

import CircleAvatar from "src/components/Avatar/Circle";
import { default as MaterialCommunityIcons } from "react-native-vector-icons/MaterialCommunityIcons";

export default class Room extends React.Component{
  render(){
    const { audience, lastMessage } = this.props;
    const sentTime = lastMessage.sentTime? lastMessage.sentTime.seconds * 1000: null;

    let dateTimeString = <MaterialCommunityIcons name="progress-clock" size={24} style={{ color: "#5E8864" }}/>;
    if(sentTime){
      const isToday = new moment().diff(sentTime, "days") === 0;
      if(isToday) dateTimeString = new moment(sentTime).format("HH:mmA");
      else new moment(sentTime).format("DD MMMM YYYY");
    }

    return(
      <TouchableOpacity onPress={this.props.onPress}>
        <View style={styles.chatContainer}>
          <View style={styles.photoContainer}>
            <CircleAvatar size={50} uri={audience.applicationInformation.profilePicture}/>
          </View>
          <View style={styles.descriptionContainer}>
            <Text style={{fontWeight: "500"}}>{audience.applicationInformation.nickName}</Text>
            <Text style={{fontSize: 12}}>{lastMessage.message}</Text>
          </View>
          <Text style={styles.timestamp}>{dateTimeString}</Text>
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