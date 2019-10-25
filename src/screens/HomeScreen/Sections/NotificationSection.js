import React from "react";
import { withNavigation } from "react-navigation";
import { withCurrentRooms } from "src/api/rooms/CurrentRooms";

import { FlatList } from "react-native";
import BotRoom from "../Rooms/BotRoom";

function NotificationSection(props){
  const { currentBotRooms } = props;
  const handleRoomPress = (room) => props.navigation.navigate("InboundOnlyChat", { room });
  return (
    <FlatList 
      data={currentBotRooms}
      keyExtractor={(item) => item.id}
      renderItem={({ item ,index}) => {
        const marginTop = (index === 0)? 8: 4;
        const marginBottom = (index === currentBotRooms.length)? 8: 4;
        return <BotRoom room={item} style={{ marginTop, marginBottom }} onPress={handleRoomPress}/>
      }}/>
  );
}
export default withNavigation(withCurrentRooms(NotificationSection))