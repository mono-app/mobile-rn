import React from 'react';
import RoomsAPI from 'src/api/rooms';
import Logger from 'src/api/logger';
import UserMappingAPI from 'src/api/usermapping';
import { withCurrentUser } from "src/api/people/CurrentUser";
import { StyleSheet } from 'react-native';
import Header from 'src/screens/HomeScreen/Header';
import HeadlineTitle from 'src/components/HeadlineTitle';
import PrivateRoom from "src/screens/HomeScreen/PrivateRoom";
import { View, FlatList } from 'react-native';
import FriendRequestNotification from 'src/screens/HomeScreen/Notifications/FriendRequest'
import { PermissionsAndroid } from 'react-native';
import Contacts from 'react-native-contacts';

function HomeScreen(props){
  const { currentUser } = props;
  const [ rooms, setRooms ] = React.useState([]);
  const roomsListener = React.useRef(null);

  const styles = StyleSheet.create({
    container: { flex: 1, alignItems: 'stretch', justifyContent: 'flex-start' }
  });

  const handleRoomPress = (room) => {
    Logger.log("HomeScreen.handleRoomPress", room);
    props.navigation.navigate("Chat", { room });
  }

  const autoAddContact = () => {
    PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.READ_CONTACTS,
      {
        'title': 'Contacts',
        'message': 'This app would like to view your contacts.'
      }
    ).then(() => {
      Contacts.getAll( async (err, contacts) => {
        if (err !== 'denied'){
          let phoneNumbers = []
          const accessToken = await UserMappingAPI.getAccessToken()
          contacts.forEach((item)=> {
            item.phoneNumbers.forEach(phoneNumber => {
              phoneNumbers.push(phoneNumber.number)
            })
          })

        }
      })
    })
    
  }

  React.useEffect(() => {
    roomsListener.current = RoomsAPI.getRoomsWithRealtimeUpdate(currentUser.email, (rooms) => setRooms(rooms));
    autoAddContact()
    return function cleanup(){
      if(roomsListener.current) roomsListener.current();
    }
  }, [])

  
  return (
    <View style={styles.container}>
      <Header/>
      <HeadlineTitle style={{ marginLeft: 16, marginRight: 16, marginTop: 8 }}>Chats</HeadlineTitle>
      <FriendRequestNotification navigation={props.navigation}/> 
      <FlatList
        data={rooms}
        keyExtractor={(item) => item.id}
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