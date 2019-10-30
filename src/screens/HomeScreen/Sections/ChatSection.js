import React from "react";
import RoomsAPI from 'src/api/rooms';
import Logger from 'src/api/logger';
import { withCurrentUser } from "src/api/people/CurrentUser";
import { withCurrentRooms } from "src/api/rooms/CurrentRooms";
import { withNavigation } from "react-navigation";

import PrivateRoom from "src/screens/HomeScreen/Rooms/PrivateRoom";
import { FlatList } from "react-native";

function ChatSection(props){
  const { currentRooms } = props;

  const handleRoomPress = (room) => {
    Logger.log("HomeScreen.handleRoomPress", room);
    if(room.type==="group-chat"){
      props.navigation.navigate("GroupChat", { room });
    }else{
      props.navigation.navigate("Chat", { room });
    }
  }

  const handleOnLongPress = (room) => {
    console.log("onLongPress Triggered")
    console.log(room)
  }
  
  return (
    <FlatList
      data={currentRooms} 
      keyExtractor={(item) => item.id}
      renderItem={({ item, index }) => {
      const marginTop = (index === 0)? 8: 4;
      const marginBottom = (index === currentRooms.length)? 8: 4;
      
      return <PrivateRoom room={item} onPress={handleRoomPress} onLongPress={handleOnLongPress} style={{ marginTop, marginBottom }}/>
        
      }}/>
  )
}
export default withNavigation(withCurrentUser(withCurrentRooms(ChatSection)))