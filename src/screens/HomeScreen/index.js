import React from 'react';
import { StyleSheet } from 'react-native';

import FriendRequestNotification from 'src/screens/HomeScreen/Notifications/FriendRequest'
import Header from 'src/screens/HomeScreen/Header';
import HeadlineTitle from 'src/components/HeadlineTitle';
import ChatMenuSwitch from 'src/screens/HomeScreen/ChatMenuSwitch';
import ChatSection from "src/screens/HomeScreen/Sections/ChatSection";
import NotificationSection from "src/screens/HomeScreen/Sections/NotificationSection";
import { View } from 'react-native';
import { PermissionsAndroid } from 'react-native';
import Contacts from 'react-native-contacts';

function HomeScreen(props){
  const [ selectedMenu, setSelectedMenu ] = React.useState(null);
  const styles = StyleSheet.create({
    container: { flex: 1, alignItems: 'stretch', justifyContent: 'flex-start' }
  });

  const handleMenuChange = (menu) => setSelectedMenu(menu);

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
      <ChatMenuSwitch onChange={handleMenuChange}/>
      <FriendRequestNotification navigation={props.navigation}/> 
      {selectedMenu === "chat"?<ChatSection/>: <NotificationSection/>}
    </View>
  );
}

HomeScreen.navigationOptions = { header: null };
export default HomeScreen;