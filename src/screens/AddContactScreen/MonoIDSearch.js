import React from "react";
import { StyleSheet, View } from "react-native";
import { default as MaterialIcons } from "react-native-vector-icons/MaterialIcons";

import PeopleAPI from "src/api/people";

import TextInput from "src/components/TextInput";

const INITIAL_STATE = { id: "", isCannotFindPeopleDialogVisible: false };

export default class MonoIDSearch extends React.Component{
  handleIdChange = id => this.setState({ id });
  handleSubmit = async () => {
    const { id } = this.state;
    const foundPeople = await new PeopleAPI().getByMonoId(id);
    if(foundPeople.length > 0){
      this.props.navigation.navigate("PeopleSearchResult", { people: foundPeople });
    }else this.setState({ isCannotFindPeopleDialogVisible: true });
  }

  constructor(props){
    super(props);

    this.state = INITIAL_STATE;
    this.handleIdChange = this.handleIdChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  render(){
    return(
      <View style={styles.container}>
        <MaterialIcons name="search" size={24} color="#E8EEE8" style={{ marginRight: 8 }}/>
        <TextInput 
          placeholder="Mono ID" 
          returnKeyType="search"
          style={{ borderWidth: 0, flex: 1, marginBottom: 0 }}
          value={this.state.id}
          onChangeText={this.handleIdChange}
          onSubmitEditing={this.handleSubmit}/>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-evenly",
    padding: 16, 
    paddingTop: 8, 
    paddingBottom: 8,
    marginBottom: 8, 
    backgroundColor: "white"
  }
})