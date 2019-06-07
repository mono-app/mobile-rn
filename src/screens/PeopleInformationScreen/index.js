import React from "react";
import moment from "moment";
import { View } from "react-native";
import { ActivityIndicator } from "react-native-paper";
import { NavigationEvents } from "react-navigation";
import SInfo from "react-native-sensitive-info";

import Button from "src/components/Button";
import PeopleProfileHeader from "src/components/PeopleProfile/Header";
import PeopleInformationContainer from "src/components/PeopleProfile/InformationContainer";
import CancelledFriendRequestDialog from "./CancelledFriendRequestDialog";
import AddedFriendRequestDialog from "./AddedFriendRequestDialog";

import FriendsAPI from "src/api/friends";
import PeopleAPI from "src/api/people";
import { GetDocument } from "src/api/database/query";
import { UserCollection, FriendListCollection, FriendRequestCollection } from "../../api/database/collection";
import { Document } from "src/api/database/document";

const INITIAL_STATE = { 
  isLoading: true,
  isAdding: false,
  isCancelling: false,
  isAdded: null,
  isRequested: null,
  isInFriendList: null, 
  people: { 
    nickName: "", 
    joinedFrom: "",
    status: "",
    source: { id: "", value: "" } 
  }
}

/**
 * Parameter list
 * 
 * @param {string} peopleId
 */
export default class PeopleInformationScreen extends React.Component {
  handleScreenDidFocus = () => {
    const peopleId = this.props.navigation.getParam("peopleId", "test.kedua@gmail.com");
    const peopelSource = this.props.navigation.getParam("source", { id: "MonoID", value: "Mono ID" });
    let currentUserEmail;

    const userDocument = new Document(peopleId);
    const userCollection = new UserCollection();
    const getQuery = new GetDocument();
    getQuery.setGetConfiguration("default");
    getQuery.executeQuery(userCollection, userDocument).then(doc => {
      if(doc.exists){
        const people = doc.data();
        const newPeople = { 
          ...this.state.people, 
          source: peopelSource,
          joinedFrom: people.creationTime,
          nickName: people.applicationInformation.nickName
        };
        this.setState({ people: newPeople });

        // search inside friendRequest, if peopleId is in the friendRequest of this currentUserEmail document, you cannot request again
        // search inside friendList, if peopleId is in the friendList of the currentUserEmail document, the button will be "Chat Now"
        return new PeopleAPI().getCurrentUserEmail();
      }
    }).then(email => {
      if(email){
        currentUserEmail = email;
        const friendRequestCollection = new FriendRequestCollection();
        const friendListCollection = new FriendListCollection();
        const getDocumentQuery = new GetDocument();
        const userDocument = new Document(peopleId);

        getDocumentQuery.setGetConfiguration("default");
        return Promise.all([
          getDocumentQuery.executeQuery(friendRequestCollection, userDocument),
          getDocumentQuery.executeQuery(friendListCollection, userDocument)
        ])
      }
    }).then(results => {
      const friendRequestDocument = results[0];
      const friendListDocument = results[0];
      
      this.setState({
        isInFriendList: friendListDocument.exists && friendListDocument.data().friends.includes(currentUserEmail),
        isRequested: friendRequestDocument.exists && friendRequestDocument.data().friends.includes(currentUserEmail)
      })
    }).catch(err => {
      console.log(err);
    })
  }

  handleAddContactPress = () => {
    this.setState({ isAdding: true });
    new PeopleAPI().getCurrentUserEmail().then(currentUserEmail => {
      const peopleId = this.props.navigation.getParam("peopleId", "test.kedua@gmail.com");
      const api = new FriendsAPI();
      return api.sendRequest(currentUserEmail, peopleId);
    }).then(success => {
      if(!success) throw "Terjadi kesalahan. Silahkan coba lagi.";
      this.setState({ isAdding: false, isAdded: true });
    }).catch(err => {
      console.log(err);
      alert(err);
    })
  }

  handleCancelFriendRequestPress = () => {
    this.setState({ isCancelling: true });
    new PeopleAPI().getCurrentUserEmail().then(currentUserEmail => {
      const peopleId = this.props.navigation.getParam("peopleId", "test.kedua@gmail.com");
      const api = new FriendsAPI();
      return api.cancelRequest(currentUserEmail, peopleId);
    }).then(success => {
      if(!success) throw "Terjadi kesalahan. Silahkan coba lagi.";
      this.setState({ isCancelling: false, isCancelled: true });
    }).catch(err => {
      console.log(err);
      alert(err);
    })
  }
  
  constructor(props){
    super(props);

    this.state = INITIAL_STATE;
    this.handleScreenDidFocus = this.handleScreenDidFocus.bind(this);
    this.handleAddContactPress = this.handleAddContactPress.bind(this);
    this.handleStartChattingPress = this.handleStartChattingPress.bind(this);
    this.handleCancelFriendRequestPress = this.handleCancelFriendRequestPress.bind(this);
  }

  render(){
    return (
      <View style={{ flex: 1, backgroundColor: "#E8EEE8" }}>
        <NavigationEvents onDidFocus={this.handleScreenDidFocus}/>
        
        <AddedFriendRequestDialog {...this.props} visible={this.state.isAdded}/>
        <CancelledFriendRequestDialog {...this.props} visible={this.state.isCancelled}/>

        <PeopleProfileHeader
          nickName={this.state.people.nickName}
          status={this.state.people.status || "No Status"}/>
        <View style={{ marginTop: 16, marginBottom: 16 }}>
          <PeopleInformationContainer
            fieldName="Sumber"
            fieldValue={this.state.people.source.value}/>
          <PeopleInformationContainer
            fieldName="Bergabung Sejak"
            fieldValue={moment(this.state.people.joinedFrom).format("DD MMMM YYYY")}/>
        </View>
        {this.state.isRequested
        ?(
          <View style={{ padding: 16, paddingTop: 0 }}>
            <Button 
              text="Batalkan Permintaan Teman" 
              onPress={this.handleCancelFriendRequestPress} 
              isLoading={this.state.isCancelling}
              style={{ backgroundColor: "#ef6f6c" }}/>
          </View>
        ):(this.state.isInFriendList === false)
        ?(
          <View style={{ padding: 16, paddingTop: 0 }}>
            <Button text="Tambahkan ke-kontak" onPress={this.handleAddContactPress} isLoading={this.state.isAdding}/>
          </View>
        ):(this.state.isInFriendList === true)
        ?(
          <View style={{ padding: 16, paddingTop: 0 }}>
            <Button text="Mulai Percakapan" onPress={this.handleStartChattingPress}/>
          </View>
        ):(
          <View style={{ padding: 16, paddingTop: 0 }}>
            <ActivityIndicator size="small" color="#0EAD69"/>
          </View>
        )}
      </View>
    )
  }
}
