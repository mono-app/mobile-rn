import React from "react"
import { View, StyleSheet, TouchableOpacity } from "react-native";
import { Text, Badge } from "react-native-paper";
import { default as EvilIcons } from "react-native-vector-icons/EvilIcons";

import { withCurrentUser } from "src/api/people/CurrentUser";
import FriendsAPI from "src/api/friends";

const INITIAL_STATE = { count: 0, people: [] }

class FriendRequest extends React.PureComponent{
  loadFriendRequestCount = async () => {
    this.friendRequestListener = FriendsAPI.getFriendRequestWithRealTimeUpdate(this.props.currentUser.email, people => {
      this.setState({ count: people.length, people });
    })
  }

  handleFriendRequestPress = () => { this.props.navigation.navigate("FriendRequestList", { people: this.state.people }) }

  constructor(props){
    super(props);

    this.state = INITIAL_STATE;
    this.friendRequestListener = null;
    this.loadFriendRequestCount = this.loadFriendRequestCount.bind(this);
    this.handleFriendRequestPress = this.handleFriendRequestPress.bind(this);
  }

  componentDidMount(){ this.loadFriendRequestCount(); }
  componentWillUnmount(){ if(this.friendRequestListener) this.friendRequestListener(); }

  render(){
    if(this.state.count === 0) return null;
    return (
      <TouchableOpacity style={styles.notificationcontainer} onPress={this.handleFriendRequestPress}>
        <View style={{ display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
          <Text>Permintaan Pertemanan</Text>
          <View style={{ display: "flex", flexDirection: "row", alignItems: "center" }}>
            <Badge>{this.state.count}</Badge>
            <EvilIcons name="chevron-right" size={24} style={{ color: "#5E8864" }}/>
          </View>
        </View>
      </TouchableOpacity>
    )
  }
}

const styles = StyleSheet.create({
  notificationcontainer: {
    display: "flex",
    backgroundColor: "white",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#E8EEE8"
  }
})

export default withCurrentUser(FriendRequest)