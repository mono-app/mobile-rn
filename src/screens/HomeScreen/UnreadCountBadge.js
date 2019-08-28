import React from "react";
import firebase from "react-native-firebase";
import { withCurrentUser } from "src/api/people/CurrentUser";

import { RoomsCollection, MessagesCollection } from "src/api/database/collection";
import { Document } from "src/api/database/document";
import { Badge } from "react-native-paper";

function UnreadCountBadge(props){
  const { roomId, currentUser } = props;
  const [ count, setCount ] = React.useState(0);
  const unreadListener = React.useRef(null);

  React.useEffect(() => {
    const db = firebase.firestore();
    const roomsCollection = new RoomsCollection();
    const messagesCollection = new MessagesCollection();
    const roomDocument = new Document(roomId);
    const roomRef = db.collection(roomsCollection.getName()).doc(roomDocument.getId());
    const messagesRef = roomRef.collection(messagesCollection.getName());
    unreadListener.current = messagesRef.where("read.isRead", "==", false).onSnapshot((querySnapshot) => {
      const unreadCount = querySnapshot.docs.filter((documentSnapshot) => {
        if(documentSnapshot.data().senderEmail !== currentUser.email) return true;
        else return false;
      }).length;
      setCount(unreadCount);
    })
  }, [])

  if(count === 0) return null;
  else return <Badge style={props.style}>{count}</Badge>
}

UnreadCountBadge.defaultProps = { style: {}, roomId: null }
export default withCurrentUser(UnreadCountBadge);