import React from "react";
import { FlatList } from "react-native";

import AppHeader from "src/components/AppHeader";
import PeopleListItem from "src/components/PeopleListItem";
import Container from "src/components/Container";

export default class FriendRequestListScreen extends React.PureComponent{
  static navigationOptions = { header: null };

  handleKeyExtractor = (item) => item.id;
  handleRenderItem = ({ item }) => {
    return <PeopleListItem onPress={() => this.handlePeoplePress(item)} id={item.id} autoFetch={true}/>
  }

  handlePeoplePress = people => {
    const payload = {
      peopleId: people.id
    }
    this.props.navigation.navigate("PeopleInformation", payload);
  }

  constructor(props){
    super(props);

    this.peoples = this.props.navigation.getParam("people", []);
    this.handlePeoplePress = this.handlePeoplePress.bind(this);
    this.handleRenderItem = this.handleRenderItem.bind(this);
    this.handleKeyExtractor = this.handleKeyExtractor.bind(this);
  }

  render(){
    return(
      <Container>
        <AppHeader navigation={this.props.navigation} style={{ backgroundColor: "transparent" }} title="Permintaan Pertemanan"/>
        <FlatList data={this.peoples} keyExtractor={this.handleKeyExtractor} renderItem={this.handleRenderItem}/>
      </Container>
    )
  }
}