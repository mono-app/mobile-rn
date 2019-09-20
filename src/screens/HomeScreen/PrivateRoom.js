import React from "react";
import PropTypes from "prop-types";
import moment from "moment";
import PeopleAPI from "src/api/people";
import { withCurrentUser } from "src/api/people/CurrentUser";
import { StyleSheet } from 'react-native';

import CircleAvatar from "src/components/Avatar/Circle";
import UnreadCountBadge from "./UnreadCountBadge";
import { Text, Caption } from "react-native-paper";
import { View, TouchableOpacity } from 'react-native';

function PrivateRoom(props){
  const { currentUser, room } = props; 

  const [ isLoading, setIsLoading ] = React.useState(true);
  const [ people, setPeople ] = React.useState(null);

  const styles = StyleSheet.create({
    chatContainer: {
      display: "flex", flexDirection: "row", backgroundColor: "white", alignItems: "center",
      margin: 16, paddingVertical: 16, borderBottomWidth: 1, borderBottomColor: "#E8EEE8"
    }
  })

  const handleRoomPress = () => props.onPress(room);

  React.useEffect(() => {
    setIsLoading(true);
    const fetchData = async () => {
      const { audiences } = props.room;
      const realAudience = audiences.filter((audience) => audience !== currentUser.email)[0];
      const peopleData = await PeopleAPI.getDetail(realAudience);
      setPeople(peopleData);
      setIsLoading(false);
    }
    fetchData();
  }, [])

  const sentTime = room.lastMessage.sentTime? new moment.unix(room.lastMessage.sentTime.seconds): null;
  let dateTimeString = null;
  if(sentTime){
    const isToday = new moment().diff(sentTime, "days") === 0;
    if(isToday) dateTimeString = sentTime.format("hh:mmA");
    else dateTimeString = sentTime.format("DD MMMM YYYY");
  }

  if(people && people.applicationInformation && !isLoading){
    return(
      <TouchableOpacity style={styles.chatContainer} onPress={handleRoomPress}>
        <View style={{ marginRight: 16 }}>
          <CircleAvatar size={50} uri={people.profilePicture}/>
        </View>
        <View style={{ display: "flex", flexDirection: "column", width: 0, flexGrow: 1 }}>
          <View style={{ display: "flex", flexDirection: "row", justifyContent: "space-between" }}>
            <Text>{people.applicationInformation.nickName}</Text>
            <Caption>{dateTimeString}</Caption>
          </View>
          <View style={{ display: "flex", flexDirection: "row" }}>
            <Caption style={{ width: 0, flexGrow: 1, marginRight: 16 }} numberOfLines={1}>
              {room.lastMessage.message}
            </Caption>
            <UnreadCountBadge roomId={room.id}/>
          </View>
        </View>
      </TouchableOpacity>
    )
  }else{
    return null
  }
}

PrivateRoom.propTypes = { onPress: PropTypes.func }
PrivateRoom.defaultProps = { onPress: () => {} }
export default withCurrentUser(PrivateRoom)