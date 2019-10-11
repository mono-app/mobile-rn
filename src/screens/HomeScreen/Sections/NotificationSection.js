import React from "react";
import firebase from "react-native-firebase";
import RoomsAPI from "src/api/rooms";
import { withNavigation } from "react-navigation";
import { withCurrentUser } from "src/api/people/CurrentUser";

import { FlatList } from "react-native";
import BotRoom from "../Rooms/BotRoom";

function NotificationSection(props){
  const { currentUser } = props;
  const [ notifications, setNotifications ] = React.useState([]);
  const roomsListener = React.useRef(null);
  const _isMounted = React.useRef(true);

  const handleRoomPress = (room) => props.navigation.navigate("InboundOnlyChat", { room });

  const fetchData = () => {
    const db = firebase.firestore();
    const roomsRef = db.collection("rooms").where("type", "==", "bot").where("audiences", "array-contains", currentUser.email);
    roomsListener.current = roomsRef.orderBy("lastMessage.sentTime", "desc").onSnapshot((querySnapshot) => {
      const rooms = querySnapshot.docs.map((documentSnapshot) => RoomsAPI.normalizeRoom(documentSnapshot));
      if(_isMounted.current) setNotifications(rooms);
    })
  }

  React.useEffect(() => {
    fetchData();
    return function cleanup(){
      _isMounted.current = false
      if(roomsListener.current !== null) roomsListener.current();
    }
  }, []);

  return (
    <FlatList 
      data={notifications}
      renderItem={({ item ,index}) => {
        const marginTop = (index === 0)? 8: 4;
        const marginBottom = (index === notifications.length)? 8: 4;
        return <BotRoom room={item} style={{ marginTop, marginBottom }} onPress={handleRoomPress}/>
      }}/>
  );
}
export default withCurrentUser(withNavigation(NotificationSection));