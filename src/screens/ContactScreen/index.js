import React from "react";
import { View, FlatList, StyleSheet } from "react-native";
import { Searchbar, ActivityIndicator } from "react-native-paper";
import SInfo from "react-native-sensitive-info";

import FriendsAPI from "src/api/friends";
import PeopleAPI from "src/api/people";
import PeopleListItem from "src/components/PeopleListItem";

const INITIAL_STATE = { isLoading: true, peopleList: [] }

export default class ContactScreen extends React.Component{
  static navigationOptions = { headerTitle: "Kontak-ku" };
  
  loadFriends = async () => {
    this.setState({ isLoading: true });

    new PeopleAPI().getCurrentUserEmail().then(currentUserEmail => {
      const api = new FriendsAPI();
      this.friendListListener = api.getFriendsWithRealTimeUpdate(currentUserEmail, friends => {
        this.setState({ isLoading: false, peopleList: friends })
      })
    })
  }

  handleContactPress = peopleEmail => this.props.navigation.navigate("PeopleDetail", { peopleEmail });

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
        {this.state.isLoading
        ?(
          <View style={{ flex: 1, alignItems: "center", justifyContent: "center", backgroundColor: "white" }}>
            <ActivityIndicator size="large" color="#0EAD69"/>
          </View>
        ):(
          <FlatList
            style={{ backgroundColor: "white" }}
            data={this.state.peopleList}
            renderItem={({ item, index }) => {
              return (
                <PeopleListItem 
                  onPress={() => this.handleContactPress(item)}
                  key={index} 
                  autoFetch={true} 
                  email={item}/>
              )
            }}/>
        )}
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