import React from "react";

import ResultItem from "./ResultItem";
import AppHeader from "src/components/AppHeader";
import { View, FlatList } from "react-native";

function PeopleSearchResult(props){
  const people = props.navigation.getParam("people", []);

  const handleResultItemPress = (email) => {
    props.navigation.navigate("PeopleInformation", {
      peopleEmail: email, source: { id: "MonoID", value: "Mono ID" }
    })
  }

  return(
    <View style={{ flex: 1}}>
      <AppHeader navigation={props.navigation} title="Hasil Pencarian" style={{ backgroundColor: "transparent" }}/>
      <FlatList data={people} renderItem={ ({ item, index }) => {
        return (
          <ResultItem
            onPress={handleResultItemPress} peopleEmail={item.email} profilePicture={item.profilePicture}
            name={item.applicationInformation.nickName} key={index}/>
        )
      }}/>
    </View>
  )
}
PeopleSearchResult.navigationOptions = { header: null }
export default PeopleSearchResult;