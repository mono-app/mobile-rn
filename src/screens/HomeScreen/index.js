import React from 'react';
import RoomsAPI from 'src/api/rooms';
import Logger from 'src/api/logger';
import { withCurrentUser } from "src/api/people/CurrentUser";
import { StyleSheet } from 'react-native';
import DiscussionAPI from "modules/Classroom/api/discussion";
import firebase from "react-native-firebase";
import Header from 'src/screens/HomeScreen/Header';
import HeadlineTitle from 'src/components/HeadlineTitle';
import PrivateRoom from "src/screens/HomeScreen/PrivateRoom";
import { View, FlatList } from 'react-native';
import StudentAPI from "modules/Classroom/api/student";

function HomeScreen(props){
  const { currentUser } = props;
  const [ rooms, setRooms ] = React.useState([]);
  const roomsListener = React.useRef(null);
  const notificationOpenedListener = React.useRef(null);

  const styles = StyleSheet.create({
    container: { flex: 1, alignItems: 'stretch', justifyContent: 'flex-start' }
  });

  React.useEffect(() => {
    StudentAPI.aa()
    const init = async () => {
      

    const notificationOpen = await firebase.notifications().getInitialNotification();
      if (notificationOpen) {
        doNotif(notificationOpen)
      }
    }
  
    // const notificationOpenedListener = firebase.notifications().onNotificationOpened((notificationOpen) => {
    //   doNotif(notificationOpen)
    // });

    const doNotif = async (notificationOpen) => {
       // App was opened by a notification
          // Get the action triggered by the notification being opened
          const action = notificationOpen.action;
          // Get information about the notification that was opened
          const notification = notificationOpen.notification;
          const data = notification.data
          if(data.type=="new-discussion"){
            const schoolId = data.schoolId
            const classId = data.classId
            const taskId = data.taskId
            const discussionId = data.discussionId
            const discussion = await DiscussionAPI.getDetail(schoolId, classId, taskId, discussionId, currentUser.email)
            payload = {
              key:"Classroom",
              schoolId,
              classId,
              taskId,
              discussion
            }
            
            props.navigation.navigate("DiscussionComment", payload)
          }else if(data.type=="new-chat"){
            const roomId = data.roomId
            const room = await RoomsAPI.getDetail(roomId)
            payload = {
              room
            }
            props.navigation.navigate("Chat", payload);
          }
    }

    init()

    roomsListener.current = RoomsAPI.getRoomsWithRealtimeUpdate(currentUser.email, (rooms) => setRooms(rooms));

    return function cleanup(){
      if(roomsListener.current) roomsListener.current();
      if(notificationOpenedListener.current) notificationOpenedListener.current();
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