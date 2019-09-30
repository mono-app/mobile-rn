import React from "react";
import RoomsAPI from 'src/api/rooms';
import Logger from 'src/api/logger';
import { withCurrentUser } from "src/api/people/CurrentUser";
import { withNavigation } from "react-navigation";

import PrivateRoom from "src/screens/HomeScreen/PrivateRoom";
import { FlatList } from "react-native";

function ChatSection(props){
  const { currentUser } = props;
  const [ rooms, setRooms ] = React.useState([]);
  const roomsListener = React.useRef(null);

  React.useEffect(() => {
    roomsListener.current = RoomsAPI.getRoomsWithRealtimeUpdate(currentUser.email, (rooms) => setRooms(rooms));
    return function cleanup(){
      if(roomsListener.current) roomsListener.current();
    }
  }, []);

  const handleRoomPress = (room) => {
    Logger.log("HomeScreen.handleRoomPress", room);
    props.navigation.navigate("Chat", { room });
  }
  
  return (
    <FlatList
      data={rooms} keyExtractor={(item) => item.id}
      renderItem={({item}) => {
        if(item.type === "chat"){
          if(item.audiences.length === 2) return <PrivateRoom room={item} onPress={handleRoomPress}/>
        }
      }}/>
  )
}
export default withNavigation(withCurrentUser(ChatSection));