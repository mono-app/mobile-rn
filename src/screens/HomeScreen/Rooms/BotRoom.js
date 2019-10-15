import React from "react";
import firebase from "react-native-firebase";
import PropTypes from "prop-types";
import moment from "moment";
import { StyleSheet } from 'react-native';
import UnreadCountBadge from "src/screens/HomeScreen/UnreadCountBadge";
import CircleAvatar from "src/components/Avatar/Circle";
import { Text, Caption } from "react-native-paper";
import { View, TouchableOpacity } from 'react-native';

function BotRoom(props){
  const [ bot, setBot ] = React.useState(null);
  const styles = StyleSheet.create({
    chatContainer: {
      display: "flex", flexDirection: "row", backgroundColor: "white", alignItems: "center",
      marginHorizontal: 16, paddingVertical: 16, borderBottomWidth: 1, borderBottomColor: "#E8EEE8"
    }
  })

  const handleRoomPress = () => props.onPress(props.room);

  const fetchData = async () => {
    const db = firebase.firestore();
    const botSnapshot = await db.collection("bots").doc(props.room.bot).get();
    setBot({ id: botSnapshot.id, ...botSnapshot.data(), profilePicture: botSnapshot.data().profilePicture.downloadUrl });
  }

  React.useEffect(() => {
    fetchData();
  }, [])

  if(bot !== null){
    const sentTime = props.room.lastMessage.sentTime? new moment.unix(props.room.lastMessage.sentTime.seconds): null;
    let dateTimeString = null;
    if(sentTime){
      const isToday = new moment().diff(sentTime, "days") === 0;
      if(isToday) dateTimeString = sentTime.format("hh:mmA");
      else dateTimeString = sentTime.format("DD MMMM YYYY");
    }
    return(
      <TouchableOpacity style={[ styles.chatContainer, props.style ]} onPress={handleRoomPress}>
        <View style={{ marginRight: 16 }}>
          <CircleAvatar size={50} uri={bot.profilePicture}/>
        </View>
        <View style={{ display: "flex", flexDirection: "column", width: 0, flexGrow: 1 }}>
          <View style={{ display: "flex", flexDirection: "row", justifyContent: "space-between" }}>
            <Text>{bot.displayName}</Text>
            <Caption>{dateTimeString}</Caption>
          </View>
          <View style={{ display: "flex", flexDirection: "row",justifyContent: "space-between" }}>
            <Caption style={{ width: 0, flexGrow: 1, marginRight: 16 }} numberOfLines={2}>
              {props.room.lastMessage.message}
            </Caption>
            <UnreadCountBadge roomId={props.room.id}/>
          </View>
        </View>
      </TouchableOpacity>
    )
  }else return null;
}

BotRoom.propTypes = { 
  room: PropTypes.shape({
    lastMessage: PropTypes.shape().isRequired,
    id: PropTypes.string.isRequired,
    bot: PropTypes.string.isRequired
  }).isRequired,
  onPress: PropTypes.func, 
  style: PropTypes.shape()
}
BotRoom.defaultProps = { onPress: () => {}, style: {} }
export default BotRoom