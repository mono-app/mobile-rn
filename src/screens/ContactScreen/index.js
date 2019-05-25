import React from "react";
import { View, FlatList, StyleSheet, TouchableOpacity } from "react-native";
import { 
  Searchbar, Text, Avatar, ActivityIndicator
} from "react-native-paper";
import { NavigationEvents } from "react-navigation";
import SInfo from "react-native-sensitive-info";

import FriendsAPI from "src/api/friends";
import PeopleListItem from "src/components/PeopleListItem";

const INITIAL_STATE = { isLoading: true, peopleList: [] }

export default class ContactScreen extends React.Component{
  static navigationOptions = ({ navigation }) => {
    return {
      headerTitle: "Kontak-ku"
    }
  }
  
  handleContactPress = peopleEmail => {
    this.props.navigation.navigate("PeopleDetail", { peopleEmail });
  }

  handleScreenWillBlur = () => {
    // unsubscribe from the listener
    if(this.friendListListener) this.friendListListener();
  }

  handleScreenWillFocus = async () => {
    this.setState({ isLoading: true });

    SInfo.getItem("currentUserEmail", {}).then(currentUserEmail => {
      const api = new FriendsAPI();
      this.friendListListener = api.getFriendsWithRealTimeUpdate(currentUserEmail, friends => {
        this.setState({ isLoading: false, peopleList: friends })
      })
    })
  }

  constructor(props){
    super(props);

    this.state = INITIAL_STATE;
    this.friendListListener = null;
    this.handleScreenWillFocus = this.handleScreenWillFocus.bind(this);
    this.handleScreenWillBlur = this.handleScreenWillBlur.bind(this);
    this.handleContactPress = this.handleContactPress.bind(this);
  }
  
  render(){
    return(
      <View style={{ flex: 1, backgroundColor: "#E8EEE8" }}>
        <NavigationEvents 
          onWillFocus={this.handleScreenWillFocus}
          onWillBlur={this.handleScreenWillBlur}/>

        <View style={{ padding: 16 }}>
          <Searchbar placeholder="Cari kontak"/>
        </View>
        {this.state.isLoading
        ?(
          <View style={{ flex: 1, alignItems: "center", justifyContent: "center", backgroundColor: "white" }}>
            <ActivityIndicator size="large" color="#0EAD69"/>
          </View>
        ):(
          <View style={{ flex: 1, backgroundColor: "white" }}>
            <FlatList
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
          </View>
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