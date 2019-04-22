import React from "react"
import { View, StyleSheet, TouchableOpacity } from "react-native";
import { Text, Badge } from "react-native-paper";
import { NavigationEvents } from "react-navigation";
import { default as EvilIcons } from "react-native-vector-icons/EvilIcons";
import SInfo from "react-native-sensitive-info";

import FriendsAPI from "../../../../api/friends";

const INITIAL_STATE = { count: 0 }

export default class FriendRequest extends React.Component{
  handleScreenWillFocus = () => this.refreshFriendRequest();
  handleFriendRequestPress = () => { this.props.navigation.navigate("FriendRequestList") }
  refreshFriendRequest = () => {
    SInfo.getItem("currentUserEmail", {}).then(currentUserEmail => {    
      const api = new FriendsAPI();
      return api.getRequestList(currentUserEmail)
    }).then(friendList => {
      this.setState({ count: friendList.length });
    })
  }

  constructor(props){
    super(props);

    this.state = INITIAL_STATE;
    this.refreshFriendRequest = this.refreshFriendRequest.bind(this);
    this.handleFriendRequestPress = this.handleFriendRequestPress.bind(this);
    this.handleScreenWillFocus = this.handleScreenWillFocus.bind(this);
  }

  render(){
    const overrideDisplay = this.state.count === 0? {display: "none"}: {display: "flex"};

    return(
      <TouchableOpacity onPress={this.handleFriendRequestPress}>
        <NavigationEvents onWillFocus={this.handleScreenWillFocus}/>
        <View style={{...styles.notificationcontainer, ...overrideDisplay}}>
          <View style={{ display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
            <Text>Permintaan Pertemanan</Text>
            <View style={{ display: "flex", flexDirection: "row", alignItems: "center" }}>
              <Badge>{this.state.count}</Badge>
              <EvilIcons name="chevron-right" size={24} style={{ color: "#5E8864" }}/>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    )
  }
}

const styles = StyleSheet.create({
  notificationcontainer: {
    display: "none",
    backgroundColor: "white",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#E8EEE8"
  }
})