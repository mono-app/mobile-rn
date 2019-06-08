import React from "react";
import { View, FlatList } from "react-native";

import ResultItem from "./ResultItem";

const INITIAL_STATE = { users: [] };

export default class PeopleSearchResult extends React.Component{
  static navigationOptions = { headerTitle: "Hasil Pencarian Pengguna" }

  handleResultItemPress = (peopleEmail) => {
    this.props.navigation.navigate("PeopleInformation", { 
      peopleEmail, source: { id: "MonoID", value: "Mono ID" }
    });
  }

  constructor(props){
    super(props);

    this.state = INITIAL_STATE;
    this.people = this.props.navigation.getParam("people", []);
    this.handleResultItemPress = this.handleResultItemPress.bind(this);
  }

  render(){
    return(
      <View>
        <FlatList
          data={this.people}
          renderItem={ ({ item }) => {
            let profilePicture = "https://picsum.photos/200/200/?random";
            if(item.applicationInformation.profilePicture){
              if(item.applicationInformation.profilePicture.downloadUrl) profilePicture = item.applicationInformation.profilePicture.downloadUrl
              else profilePicture = item.application.profilePicture;
            }
            return (
              <ResultItem
                onPress={() => this.handleResultItemPress(item.id)}
                peopleEmail={item.id}
                profilePicture={profilePicture}
                name={item.applicationInformation.nickName}/>
            )
          }}/>
      </View>
    )
  }
}
