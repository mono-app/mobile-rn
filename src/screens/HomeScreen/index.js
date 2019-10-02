import React from 'react';
import Contacts from 'react-native-contacts';
import { StyleSheet } from 'react-native';
import { PermissionsAndroid } from 'react-native';

import Header from 'src/screens/HomeScreen/Header';
import HeadlineTitle from 'src/components/HeadlineTitle';
import ChatMenuSwitch from 'src/screens/HomeScreen/ChatMenuSwitch';
import ChatSection from "src/screens/HomeScreen/Sections/ChatSection";
import NotificationSection from "src/screens/HomeScreen/Sections/NotificationSection";
import { View } from 'react-native';

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
    autoAddContact();
  }, [])

  
  return (
    <View style={styles.container}>
      <Header/>
      <HeadlineTitle style={{ marginLeft: 16, marginRight: 16, marginTop: 8 }}>Chats</HeadlineTitle>
      <ChatMenuSwitch onChange={handleMenuChange}/>
      {selectedMenu === "chat"?<ChatSection/>: <NotificationSection/>}
    </View>
  );
}

HomeScreen.navigationOptions = { header: null };
export default HomeScreen;