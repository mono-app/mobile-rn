import React from 'react';
import RoomsAPI from 'src/api/rooms';
import Logger from 'src/api/logger';
import { withCurrentUser } from "src/api/people/CurrentUser";
import { StyleSheet } from 'react-native';

import Header from 'src/screens/HomeScreen/Header';
import HeadlineTitle from 'src/components/HeadlineTitle';
import PrivateRoom from "src/screens/HomeScreen/PrivateRoom";
import { View, FlatList } from 'react-native';

function HomeScreen(props){
  const { currentUser } = props;
  const [ rooms, setRooms ] = React.useState([]);
  const roomsListener = React.useRef(null);

  const styles = StyleSheet.create({
    container: { flex: 1, alignItems: 'stretch', justifyContent: 'flex-start' }
  });

  React.useEffect(() => {
    roomsListener.current = RoomsAPI.getRoomsWithRealtimeUpdate(currentUser.email, (rooms) => setRooms(rooms));
    return function cleanup(){
      if(roomsListener.current) roomsListener.current();
    }
  }, [])

  const handleRoomPress = (room) => {
    Logger.log("HomeScreen.handleRoomPress", room);
    props.navigation.navigate("Chat", { room });
  }
  
  return (
    <View style={styles.container}>
      <Header/>
      <HeadlineTitle style={{ marginLeft: 16, marginRight: 16, marginTop: 8 }}>Chats</HeadlineTitle>
      {/* <FriendRequestNotification/> */}
      <FlatList
        data={rooms}
        renderItem={({item}) => {
          if(item.type === "chat"){
            if(item.audiences.length === 2) return <PrivateRoom room={item} onPress={handleRoomPress}/>
          }
        }}/>
    </View>
  );
}

HomeScreen.navigationOptions = { header: null };
export default withCurrentUser(HomeScreen);