import React from "react";
import firebase from "react-native-firebase";
import { withCurrentUser } from "src/api/people/CurrentUser";
import { RoomsCollection, MessagesCollection } from "src/api/database/collection";
import { Document } from "src/api/database/document";
import { Badge } from "react-native-paper";
import { withCurrentMessages } from "src/api/messages/CurrentMessages";

function UnreadCountBadge(props){
  const { roomId, currentUser } = props;
  const [ count, setCount ] = React.useState(0);
  const unreadListener = React.useRef(null);
  const _isMounted = React.useRef(true);

  React.useEffect(() => {
    const init = async () => {
      const db = firebase.firestore();
      const roomsCollection = new RoomsCollection();
      const messagesCollection = new MessagesCollection();
      const roomDocument = new Document(roomId);
      const roomRef = db.collection(roomsCollection.getName()).doc(roomDocument.getId());
      const messagesRef = roomRef.collection(messagesCollection.getName());
      const userPath = new firebase.firestore.FieldPath("readBy", currentUser.email);
      const roomSnapshot = await roomRef.get()
      const roomData = roomSnapshot.data()
  
      unreadListener.current = messagesRef.where(userPath, "==", false).onSnapshot((querySnapshot) => {
        const unreadCount = querySnapshot.docs.filter((documentSnapshot) => {
          if(documentSnapshot.data().senderEmail !== currentUser.email) return true;
          else return false;
        }).length;
        if(_isMounted.current) setCount(unreadCount);
        
        if(roomData.type==="bot"){
          if(_isMounted.current && unreadCount>0) props.setUnreadBot(roomId, unreadCount)
        }else{
          if(_isMounted.current && unreadCount>0) props.setUnreadChat(roomId, unreadCount)
        }
      })
    }
    if(roomId && !props.count){
      init()
    }else{
      setCount(props.count)
    }
    return ()=>{
      _isMounted.current = false
      if(unreadListener.current) unreadListener.current();
    }
  }, [])

  if(count === 0) return null;
  else return <Badge style={[{backgroundColor:"red", color:"white"}, props.style]}>{(count>99)?"99+":count}</Badge>
}

UnreadCountBadge.defaultProps = { style: {}, roomId: null }
export default withCurrentUser(withCurrentMessages(UnreadCountBadge))