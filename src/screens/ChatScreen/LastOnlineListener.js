import React from "react";
import firebase from "react-native-firebase";

import { UserCollection } from "src/api/database/collection";
import { Document } from "src/api/database/document";

export default class LastOnlineListener extends React.PureComponent{
  refreshData = () => {
    const { peopleId } = this.props;
    if(peopleId && this.listener === null){
      const db = firebase.firestore();
      const usersCollection = new UserCollection();
      const userDocument = new Document(peopleId);
      const userRef = db.collection(usersCollection.getName()).doc(userDocument.getId());
      this.listener = userRef.onSnapshot({ includeMetadataChanges: true }, (documentSnapshot => {
        const lastOnline = documentSnapshot.data().lastOnline;
        if(this.props.onChange) this.props.onChange(lastOnline);
      }))
    }
  }

  constructor(props){
    super(props);

    this.listener = null;
    this.refreshData = this.refreshData.bind(this);
  }

  componentDidUpdate(){ this.refreshData(); }
  componentDidMount(){ this.refreshData(); }
  componentWillUnmount(){ if(this.listener) this.listener(); }

  render(){ return null }
}

LastOnlineListener.defaultProps = { peopleId: null, onChange: null }