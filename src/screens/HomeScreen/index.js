import React from 'react';
import Contacts from 'react-native-contacts';
import Permissions from "react-native-permissions";
import UserMappingAPI from 'src/api/usermapping';
import { StyleSheet } from 'react-native';
import { withCurrentUser } from "src/api/people/CurrentUser";
import { withTutorial } from "src/api/Tutorial";

import FriendRequestNotification from "src/screens/HomeScreen/Notifications/FriendRequest"
import Header from 'src/screens/HomeScreen/Header';
import HeadlineTitle from 'src/components/HeadlineTitle';
import ChatMenuSwitch from 'src/screens/HomeScreen/ChatMenuSwitch';
import ChatSection from "src/screens/HomeScreen/Sections/ChatSection";
import NotificationSection from "src/screens/HomeScreen/Sections/NotificationSection";
import { View, Platform } from 'react-native';

function HomeScreen(props){
  const [ selectedMenu, setSelectedMenu ] = React.useState(null);
  const styles = StyleSheet.create({
    container: { flex: 1, alignItems: 'stretch', justifyContent: 'flex-start' }
  });

  const handleMenuChange = (menu) => setSelectedMenu(menu);

  const autoAddContact = async () => {
    const isPermissionGranted = await checkPermission();
    if(!isPermissionGranted){
      await requestPermission();
      return;
    }

    Contacts.getAll( async (err, contacts) => {

      if (err !== 'denied'){
        let phoneNumbers = []
        const accessToken = await UserMappingAPI.getAccessToken()
        contacts.forEach((item)=> {
          item.phoneNumbers.forEach(phoneNumber => {
            phoneNumbers.push(phoneNumber.number)
          })
        })
        if(accessToken && props.currentUser.email && phoneNumbers.length>0){
          const headers= {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json'
          }
          const body= JSON.stringify({
            userId: props.currentUser.email,
            phonenumbers: phoneNumbers,
          })
          console.log(body)

          fetch("https://us-central1-chat-app-fdf76.cloudfunctions.net/contactService/synccontact", {
            method: 'POST', headers: headers, body: body
          }).then(res => {
            console.log("sync contact:")
            console.log(res)

          })
          
        }

      }
    })
  }
  
  const checkPermission = async () => {
    let permissionResponse;
    if(Platform.OS === "android"){
      permissionResponse = await Permissions.check("contacts");
    }else if(Platform.OS === "ios"){
      permissionResponse = await Permissions.check("contacts");
    }

    if(permissionResponse === "authorized") return true;
    else return false;
  }
  
  const requestPermission = async () => {
    try{
      let permissionResponse;
      if(Platform.OS === "android"){
        permissionResponse = await Permissions.request("contacts");
      }else if(Platform.OS === "ios"){
        permissionResponse = await Permissions.request("contacts");
      }

      if(permissionResponse === "authorized"){
        // do something if authorized
        autoAddContact()
      }else{
        // do something if unauthorized
      }
    }catch(err){

    }
  }

  React.useEffect(() => {
    autoAddContact();
    props.homeScreenTutorial.start()
  }, [])

  
  return (
    <View style={styles.container}>
      <Header homeScreenTutorial={props.homeScreenTutorial} showTutorialHomeAddContact={props.showTutorialHomeAddContact}/>
      <HeadlineTitle style={{ marginLeft: 16, marginRight: 16, marginTop: 8 }}>Chats</HeadlineTitle>
      <ChatMenuSwitch onChange={handleMenuChange} 
        homeScreenTutorial={props.homeScreenTutorial} 
        showTutorialHomeChatSection={props.showTutorialHomeChatSection} 
        showTutorialHomeNotifSection={props.showTutorialHomeNotifSection}
        />
      <FriendRequestNotification navigation={props.navigation}/>
      
      <View style={(selectedMenu !== "chat")?{ display:"none", flex: 1 } : { flex: 1 } }>
        <ChatSection/>
      </View>
      <View style={(selectedMenu === "chat")? { display:"none", flex: 1 } : { flex: 1 } }>
        <NotificationSection/>
      </View>
    </View>
  );
}

HomeScreen.navigationOptions = { header: null };
export default withTutorial(withCurrentUser(HomeScreen));