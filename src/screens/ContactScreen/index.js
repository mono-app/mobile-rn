import React from "react";
import { View, FlatList, StyleSheet } from "react-native";
import { Searchbar } from "react-native-paper";

import FriendsAPI from "src/api/friends";
import CurrentUserAPI from "src/api/people/CurrentUser";

import AppHeader from "src/components/AppHeader";
import PeopleListItem from "src/components/PeopleListItem";

const INITIAL_STATE = { isLoading: true, peopleList: [] }

export default class ContactScreen extends React.PureComponent{
  static navigationOptions = ({ navigation }) => { return {
    header: <AppHeader title="Kontak-ku" style={{ backgroundColor: "transparent" }}/>
  }}
  
  loadFriends = async () => {
    const currentUserEmail = await CurrentUserAPI.getCurrentUserEmail()
    this.friendListListener = new FriendsAPI().getFriendsWithRealTimeUpdate(currentUserEmail, friends => {
      const people = friends.map(friend => {
        return { id: friend.id, ...friend.data() }
      });
      this.setState({ peopleList: people });
    })
  }

  handleContactPress = people => {
    const peopleEmail = people.id;
    const source = people.source;
    this.props.navigation.navigate("PeopleInformation", { peopleEmail, source });
  }

  constructor(props){
    super(props);

    this.state = INITIAL_STATE;
    this.friendListListener = null;
    this.loadFriends = this.loadFriends.bind(this);
    this.handleContactPress = this.handleContactPress.bind(this);
  }

  componentDidMount(){ this.loadFriends(); }
  componentWillUnmount(){ if(this.friendListListener) this.friendListListener(); }
  
  render(){
    return(
      <View style={{ flex: 1, backgroundColor: "#E8EEE8" }}>
        <View style={{ padding: 16 }}>
          <Searchbar placeholder="Cari kontak"/>
        </View>
        <FlatList
          style={{ backgroundColor: "white" }}
          data={this.state.peopleList}
          renderItem={({ item, index }) => {
            return (
              <PeopleListItem 
                onPress={() => this.handleContactPress(item)}
                key={index} autoFetch={true} email={item.id}/>
            )
          }}/>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  listItemContainer: { 
    padding: 16,
    flexDirection: "row", 
    justifyContent: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#E8EEE8"
  }
})