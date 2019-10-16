import React from "react";
import RoomsAPI from 'src/api/rooms';
import Logger from 'src/api/logger';
import { withCurrentUser } from "src/api/people/CurrentUser";
import { withNavigation } from "react-navigation";

import PrivateRoom from "src/screens/HomeScreen/Rooms/PrivateRoom";
import { FlatList } from "react-native";

function ChatSection(props){
  const { currentUser } = props;
  const [ rooms, setRooms ] = React.useState([]);
  const [ isRefreshing, setRefreshing ] = React.useState(true);
  const roomsListener = React.useRef(null);


  const fetchData = () => {
    setRefreshing(true)
    roomsListener.current = RoomsAPI.getRoomsWithRealtimeUpdate(currentUser.email, (rooms) => {
      setRooms(rooms)
      setRefreshing(false)
      const newRooms = rooms.map(obj=>{
        return {id: obj.id}
      })
    });
  }

  React.useEffect(() => {
    fetchData()
    
    return function cleanup(){
      if(roomsListener.current) roomsListener.current();
    }
  }, []);

  const handleRoomPress = (room) => {
    Logger.log("HomeScreen.handleRoomPress", room);
    if(room.type==="group-chat"){
      props.navigation.navigate("GroupChat", { room });
    }else{
      props.navigation.navigate("Chat", { room });
    }
  }
  
  return (
    <FlatList
      onRefresh={()=>{}} 
      data={rooms} 
      refreshing={isRefreshing} 
      keyExtractor={(item) => item.id}
      renderItem={({ item, index }) => {
      const marginTop = (index === 0)? 8: 4;
      const marginBottom = (index === rooms.length)? 8: 4;
      
      return <PrivateRoom room={item} onPress={handleRoomPress} style={{ marginTop, marginBottom }}/>
        
      }}/>
  )
}
export default withNavigation(withCurrentUser(ChatSection));