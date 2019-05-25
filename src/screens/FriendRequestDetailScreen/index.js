import React from "react";
import { View, StyleSheet } from "react-native";
import { NavigationEvents } from "react-navigation";

import Button from "src/components/Button";
import PeopleProfileHeader from "src/components/PeopleProfile/Header";
import PeopleInformationContainer from "src/components/PeopleProfile/InformationContainer";

import PeopleAPI from "src/api/people";
import FriendsAPI from "src/api/friends";

const INITIAL_STATE = { 
  people: { nickName: "", status: "", id: "", profilePicture: "" } 
}

export default class FriendRequestDetailScreen extends React.Component{
  handleScreenDidFocus = () => { 
    const peopleEmail = this.props.navigation.getParam("peopleEmail");
    const api = new PeopleAPI();
    const promises = [ api.getDetail(peopleEmail), api.getLatestStatus(peopleEmail) ];
    Promise.all(promises).then(results => {
      const people = results[0];
      const status = results[1]? results[1]: "";

      const { nickName, id, profilePicture } = people.applicationInformation;
      this.setState({ people: {nickName, id, status, profilePicture} })
    })
  }

  handleRejectFriendRequest = () => {
    const peopleEmail = this.props.navigation.getParam("peopleEmail");  
    new PeopleAPI().getCurrentUserEmail().then(currentUserEmail => {
      const api = new FriendsAPI();
      return api.rejectRequest(currentUserEmail, peopleEmail);
    }).then(success => {
      if(!success) throw "Terjadi kesalahan. Silahkan Coba Lagi";
      this.props.navigation.pop();
    }).catch(err => alert(err))
  }

  handleAcceptFriendRequest = () => {
    const peopleEmail = this.props.navigation.getParam("peopleEmail");
    new PeopleAPI().getCurrentUserEmail().then(currentUserEmail => {
      const api = new FriendsAPI();
      return api.acceptRequest(currentUserEmail, peopleEmail);
    }).then(success => {
      if(!success) throw "Terjadi kesalahan. Silahkan Coba Lagi";
      this.props.navigation.pop();
    }).catch(err => alert(err))
  }

  constructor(props){
    super(props);

    this.state = INITIAL_STATE;
    this.handleScreenDidFocus = this.handleScreenDidFocus.bind(this);
    this.handleRejectFriendRequest = this.handleRejectFriendRequest.bind(this);
    this.handleAcceptFriendRequest = this.handleAcceptFriendRequest.bind(this);
  }
  
  render(){
    return(
      <View style={styles.container}>
        <NavigationEvents onDidFocus={this.handleScreenDidFocus}/>

        <PeopleProfileHeader 
          nickName={this.state.people.nickName}
          status={this.state.people.status || "No Status"}/>
        <View style={{ marginTop: 16, marginBottom: 16 }}>
          <PeopleInformationContainer
            fieldName="Mono ID"
            fieldValue={this.state.people.id}/>
        </View>
        <View style={styles.actionContainer}>
          <Button 
            text="Tolak Pertemanan" 
            style={{ backgroundColor: "#EF6F6C", marginRight: 8 }}
            onPress={this.handleRejectFriendRequest}/>
          <Button 
            text="Terima Pertemanan" 
            style={{ marginLeft: 8 }}
            onPress={this.handleAcceptFriendRequest}/>
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: { display: "flex", flexGrow: 1, backgroundColor: "#E8EEE8" },
  actionContainer: {
    paddingLeft: 16,
    paddingRight: 16,
    display: "flex",
    flexDirection: "row"
  }
})