import React from "react";

import ResultItem from "./ResultItem";
import AppHeader from "src/components/AppHeader";
import { View, FlatList } from "react-native";

function PeopleSearchResult(props){
  const people = props.navigation.getParam("people", []);

  const handleResultItemPress = (id) => {
    props.navigation.navigate("PeopleInformation", {
      peopleId: id, source: { id: "MonoID", value: "Mono ID" }
    })
  }

  return(
    <View style={{ flex: 1}}>
      <AppHeader navigation={props.navigation} title="Hasil Pencarian" style={{ backgroundColor: "transparent" }}/>
      <FlatList 
      data={people} 
      keyExtractor={(item) => item.id}
      renderItem={ ({ item, index }) => {
        return (
          <ResultItem
            onPress={handleResultItemPress} peopleId={item.id} profilePicture={item.profilePicture}
            name={item.applicationInformation.nickName} key={index}/>
        )
      }}/>
    </View>
  )
}
PeopleSearchResult.navigationOptions = { header: null }
export default PeopleSearchResult;