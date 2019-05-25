import React from "react";
import { View, FlatList } from "react-native";
import { NavigationEvents } from "react-navigation";

import FriendsAPI from "src/api/friends";
import PeopleAPI from "src/api/people";
import PeopleListItem from "src/components/PeopleListItem";

const INITIAL_STATE = { people: [] }

export default class FriendRequestListScreen extends React.Component{
  static navigationOptions = { headerTitle: "Permintaan Pertemanan" };

  handlePeoplePress = email => this.props.navigation.navigate("FriendRequestDetail", { peopleEmail: email });
  handleScreenWillFocus = () => {
    new PeopleAPI().getCurrentUserEmail().then(currentUserEmail => {
      const api = new FriendsAPI();
      return api.getRequestList(currentUserEmail)
    }).then(people => {
      this.setState({ people });
    })
  }

  constructor(props){
    super(props);

    this.state = INITIAL_STATE;
    this.handleScreenWillFocus = this.handleScreenWillFocus.bind(this);
    this.handlePeoplePress = this.handlePeoplePress.bind(this);
  }

  render(){
    return(
      <View>
        <NavigationEvents onWillFocus={this.handleScreenWillFocus}/>

        <FlatList
          data={this.state.people}
          renderItem={ ({ item }) => {
            return <PeopleListItem 
              onPress={() => this.handlePeoplePress(item)}
              email={item} 
              autoFetch={true}/>
          }}/>
      </View>
    )
  }
}