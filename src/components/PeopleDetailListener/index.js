import React from "react";
import firebase from "react-native-firebase";

import { UserCollection } from "src/api/database/collection";
import { Document } from "src/api/database/document";

export default class PeopleDetailListener extends React.PureComponent{
  loadData = async () => {
    const { peopleEmail } = this.props;
    if(peopleEmail && this.listener === null){
      // Get data from cache
      const people = null;
      if(people && this.props.onChange) {
        const peopleData = JSON.parse(people);
        this.props.onChange(peopleData);
      }
      
      // get new data from server, and store it in cache
      const db = firebase.firestore();
      const usersCollection = new UserCollection();
      const userDocument = new Document(peopleEmail);
      const userRef = db.collection(usersCollection.getName()).doc(userDocument.getId());
      this.listener = userRef.onSnapshot({ includeMetadataChanges: false }, async (documentSnapshot) => {
        const payload = { id: documentSnapshot.id, ...documentSnapshot.data() };
        const { applicationInformation } = payload;
        const profilePicture = applicationInformation.profilePicture? applicationInformation.profilePicture.downloadUrl: "https://picsum.photos/200/200/?random";
        payload.applicationInformation.profilePicture = profilePicture;
        if(this.props.onChange) this.props.onChange(payload);
      })
    }
  }
  
  constructor(props){
    super(props);

    this.listener = null;
    this.loadData = this.loadData.bind(this);
  }

  componentDidMount(){ this.loadData(); }
  componentDidUpdate(){ this.loadData(); }
  componentWillUnmount(){ if(this.listener) this.listener(); }

  render(){ return null; }
}

PeopleDetailListener.defaultProps = { peopleEmail: null, onChange: null }