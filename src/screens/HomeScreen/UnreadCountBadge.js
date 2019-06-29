import React from "react";
import firebase from "react-native-firebase";
import { Badge } from "react-native-paper";

import CurrentUserAPI from "src/api/people/CurrentUser";
import { RoomsCollection, MessagesCollection } from "src/api/database/collection";
import { Document } from "src/api/database/document";

const INITIAL_STATE = { count: null }

export default class UnreadCountBadge extends React.PureComponent{
  loadData = async () => {
    const { roomId } = this.props;
    if(roomId && this.listener === null){
      const db = firebase.firestore();
      const currentUserEmail = await CurrentUserAPI.getCurrentUserEmail();
      const roomsCollection = new RoomsCollection();
      const roomDocument = new Document(roomId);
      const messagesCollection = new MessagesCollection();
      const roomRef = db.collection(roomsCollection.getName()).doc(roomDocument.getId());
      const messageRef = roomRef.collection(messagesCollection.getName());
      this.listener = messageRef.where("read.isRead", "==", false).onSnapshot(querySnapshot => {
        const unreadCount = querySnapshot.docs.filter(documentSnapshot => {
          if(documentSnapshot.data().senderEmail !== currentUserEmail) return true;
          else return false;
        }).length;
        console.log(unreadCount);
        this.setState({ count: unreadCount });
      })
    }
  }

  constructor(props){
    super(props);
    
    this.state = INITIAL_STATE;
    this.listener = null;
    this.loadData = this.loadData.bind(this);
  }

  componentDidMount(){ this.loadData(); }
  componentDidUpdate(){ this.loadData(); }
  componentWillUnmount(){ if(this.listener) this.listener(); }

  render(){
    if(this.state.count === null) return null;
    else return <Badge style={this.props.style}>{this.state.count}</Badge>
  }
}

UnreadCountBadge.defaultProps = { style: {}, roomId: null }