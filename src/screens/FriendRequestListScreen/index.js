import React from "react";
import { View, FlatList } from "react-native";

import PeopleListItem from "src/components/PeopleListItem";

export default class FriendRequestListScreen extends React.Component{
  static navigationOptions = { headerTitle: "Permintaan Pertemanan" };

  handlePeoplePress = people => {
    const peopleEmail = people.id;
    const source = people.source;
    this.props.navigation.navigate("PeopleInformation", { peopleEmail, source });
  }

  constructor(props){
    super(props);

    this.people = this.props.navigation.getParam("people", []);
    this.handlePeoplePress = this.handlePeoplePress.bind(this);
  }

  render(){
    return(
      <FlatList
        data={this.people}
        renderItem={ ({ item }) => {
          return <PeopleListItem 
            onPress={() => this.handlePeoplePress(item)}
            email={item.id} 
            autoFetch={true}/>
        }}/>
    )
  }
}