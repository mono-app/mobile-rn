import React from "react";
import Logger from 'src/api/logger';
import { withCurrentUser } from "src/api/people/CurrentUser";
import { withCurrentRooms } from "src/api/rooms/CurrentRooms";
import { withNavigation } from "react-navigation";
import RoomDialog from 'src/components/RoomDialog';
import PrivateRoom from "src/screens/HomeScreen/Rooms/PrivateRoom";
import { FlatList, View } from "react-native";

function ChatSection(props){
  const { currentRooms } = props;
  const [ selectedRoom, setSelectedRoom ] = React.useState({});
  const [ showRoomDialog, setShowRoomDialog ] = React.useState(false);

  const handleRoomPress = (room) => {
    Logger.log("HomeScreen.handleRoomPress", room);
    if(room.type==="group-chat"){
      props.navigation.navigate("GroupChat", { room });
    }else{
      props.navigation.navigate("Chat", { room });
    }
  }

  const handleOnLongPress = (room) => {
    setShowRoomDialog(true)
    setSelectedRoom(room)
  }

  const handleDismissRoomDialog = () => {
    setShowRoomDialog(false)
  }
  
  return (
    <View>
      <FlatList
        data={currentRooms} 
        keyExtractor={(item) => item.id}
        renderItem={({ item, index }) => {
        const marginTop = (index === 0)? 8: 4;
        const marginBottom = (index === currentRooms.length)? 8: 4;
        return <PrivateRoom room={item} onPress={handleRoomPress} onLongPress={handleOnLongPress} style={{ marginTop, marginBottom }}/>
        }}/>
      <RoomDialog visible={showRoomDialog} onDismiss={handleDismissRoomDialog} selectedRoom={selectedRoom} />
    </View>
  )
}
export default withNavigation(withCurrentUser(withCurrentRooms(ChatSection)))