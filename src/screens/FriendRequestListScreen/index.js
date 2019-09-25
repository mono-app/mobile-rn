import React from "react";
import { View, FlatList } from "react-native";

import PeopleListItem from "src/components/PeopleListItem";

export default class FriendRequestListScreen extends React.PureComponent{
  static navigationOptions = { headerTitle: "Permintaan Pertemanan" };

  handlePeoplePress = people => {
    const payload = {
      peopleEmail: people.email
    }
    this.props.navigation.navigate("PeopleInformation", payload);
  }

  constructor(props){
    super(props);

    this.peoples = this.props.navigation.getParam("people", []);
    this.handlePeoplePress = this.handlePeoplePress.bind(this);
  }

  render(){
    return(
      <FlatList
        data={this.peoples}
        renderItem={ ({ item }) => {
          return <PeopleListItem 
            onPress={() => this.handlePeoplePress(item)}
            people={item} 
            autoFetch={true}/>
        }}/>
    )
  }
}