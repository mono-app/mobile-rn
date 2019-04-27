import React from "react";
import { StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native';
import moment from "moment";

export default class Room extends React.Component{
  render(){
    const { audience, lastMessage} = this.props;
    const isToday = new moment().diff(lastMessage.sentTime, "days") === 0;
    const dateTimeString = isToday? new moment(lastMessage.sentTime).format("HH:mmA"): new moment(lastMessage.sentTime).format("DD MMMM YYYY HH:mmA");

    return(
      <TouchableOpacity onPress={this.props.onPress}>
        <View style={styles.chatContainer}>
          <View style={styles.photoContainer}>
            <Image 
              style={styles.profilePicture}
              source={{uri: "https://picsum.photos/200/200/?random"}}/>
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
  profilePicture: {
    width: 50,
    height: 50,
    borderRadius: 50
  },
  descriptionContainer: { 
    width:0, 
    flexGrow: 1
  },
  timestamp: {
    fontSize: 12,
    color: "#BACCBC"
  }
})