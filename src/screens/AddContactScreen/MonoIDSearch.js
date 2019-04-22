import React from "react";
import { StyleSheet, View } from "react-native";
import { default as MaterialIcons } from "react-native-vector-icons/MaterialIcons";
import SInfo from "react-native-sensitive-info";

import { UserCollection } from "../../api/database/collection";
import { GetDocument } from "../../api/database/query";
import TextInput from "../../components/TextInput";

const INITIAL_STATE = { id: "" };

export default class MonoIDSearch extends React.Component{
  handleIdChange = id => this.setState({ id });
  handleEndEdit = () => {
    const searchId = this.state.id;
    let currentUserEmail = null;

    SInfo.getItem("currentUserEmail", {}).then(email => {
      currentUserEmail = email;
      const collection = new UserCollection();
      const firebaseQuery = collection.getFirebaseReference().where("applicationInformation.id" , "==", searchId)
      const query = new GetDocument();
      query.setGetConfiguration("default");
      return query.executeFirebaseQuery(firebaseQuery)
    }).then(queryDocuments => {
        let users = [];
        queryDocuments.forEach(doc => {
          if(doc.id !== currentUserEmail) users = [...users, doc];
        }, this)
        console.log(queryDocuments.size);
        if(queryDocuments.size === 0){
          alert(`Tidak dapat menenemukan pengguna dengan Mono ID: ${searchId}`)
        }else{
          this.props.navigation.navigate("PeopleSearchResult", { users });
        }
    })
  }

  constructor(props){
    super(props);

    this.state = INITIAL_STATE;
    this.handleIdChange = this.handleIdChange.bind(this);
    this.handleEndEdit = this.handleEndEdit.bind(this);
  }

  render(){
    return(
      <View style={styles.container}>
        <MaterialIcons name="search" size={24} color="#E8EEE8" style={{ marginRight: 8 }}/>
        <TextInput 
          placeholder="Mono ID" 
          style={{ borderWidth: 0, flex: 1 }}
          value={this.state.id}
          onChangeText={this.handleIdChange}
          onEndEditing={this.handleEndEdit}/>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    padding: 16, 
    paddingTop: 8, 
    paddingBottom: 8,
    marginBottom: 8, 
    backgroundColor: "white"
  }
})