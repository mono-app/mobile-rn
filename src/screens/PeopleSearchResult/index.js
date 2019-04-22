import React from "react";
import { View, FlatList } from "react-native";
import { NavigationEvents } from "react-navigation";

import ResultItem from "./ResultItem";

const INITIAL_STATE = { users: [] };

export default class PeopleSearchResult extends React.Component{
  static navigationOptions = { headerTitle: "Hasil Pencarian Pengguna" }

  handleResultItemPress = (userId) => {
    this.props.navigation.navigate("PeopleInformation", { 
      peopleId: userId, source: { id: "MonoID", value: "Mono ID" } 
    });
  }

  handleScreenDidFocus = () => {
    const users = this.props.navigation.getParam("users", []);
    this.setState({ users });
  }

  constructor(props){
    super(props);

    this.state = INITIAL_STATE;
    this.handleScreenDidFocus = this.handleScreenDidFocus.bind(this);
    this.handleResultItemPress = this.handleResultItemPress.bind(this);
  }

  render(){
    return(
      <View>
        <NavigationEvents onDidFocus={this.handleScreenDidFocus}/>

        <FlatList
          data={this.state.users}
          renderItem={ ({ item }) => {
            const user = item.data();
            return <ResultItem
              onPress={() => this.handleResultItemPress(item.id)}
              name={user.applicationInformation.nickName}
              status={user.applicationInformation.status}/>
          }}/>
      </View>
    )
  }
}
