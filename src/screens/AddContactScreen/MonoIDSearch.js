import React from "react";
import { StyleSheet } from "react-native";
import { withNavigation } from "react-navigation";

import PeopleAPI from "src/api/people";

import TextInput from "src/components/TextInput";
import { View } from "react-native";
import { default as MaterialIcons } from "react-native-vector-icons/MaterialIcons";

function MonoIDSearch(props){
  const [ id, setId ] = React.useState("");
  const styles = StyleSheet.create({
    container: {
      display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "space-evenly",
      padding: 16,  paddingTop: 8, paddingBottom: 8, marginBottom: 8, backgroundColor: "white"
    }
  })

  const handleIdChange = (id) => setId(id);
  const handleSubmit = async () => {
    const foundPeople = await PeopleAPI.getByMonoId(props.currentUser.email, id);
    
    if(foundPeople.length > 0 ) {
      setId("");
      props.navigation.navigate("PeopleSearchResult", { people: foundPeople });
    }
  }

  return(
    <View style={styles.container}>
      <MaterialIcons name="search" size={24} color="#E8EEE8" style={{ marginRight: 8 }}/>
      <TextInput 
        placeholder="Mono ID" returnKeyType="search" style={{ borderWidth: 0, flex: 1, marginBottom: 0 }}
        value={id} onChangeText={handleIdChange} onSubmitEditing={handleSubmit} autoCapitalize="none"/>
    </View>
  )
}

export default withNavigation(MonoIDSearch);