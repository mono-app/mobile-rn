import React from "react";
import { View, StyleSheet } from "react-native";
import { Title, Caption } from "react-native-paper";

import TextInput from "src/components/TextInput";
import Button from "src/components/Button";
import { StackNavigator } from "src/api/navigator";
import { Collection } from "src/api/database/collection";
import { Document } from "src/api/database/document";
import { UpdateDocument } from "src/api/database/query";

export default class EditSingleFieldScreen extends React.Component{
  static navigationOptions = {
    headerStyle: { backgroundColor: "#E8EEE8", elevation: 0 }
  }

  handleDefaultValueChange = defaultValue => this.setState({ defaultValue });
  handleSavePress = () => {
    this.setState({ isLoading: true });

    let canSave = false;
    if(this.beforeSave){
      canSave = this.beforeSave(this.state.defaultValue);
    }else canSave = true;

    if(canSave){
      const databaseCollection = this.props.navigation.getParam("databaseCollection", null);
      const databaseDocumentId = this.props.navigation.getParam("databaseDocumentId", null);
      const databaseFieldName = this.props.navigation.getParam("databaseFieldName", null);

      const collection = new Collection(databaseCollection);
      const myDocument = new Document(databaseDocumentId);
      const updateQuery = new UpdateDocument();
      let updateObject = {};

      updateObject[`${databaseFieldName}`] = this.state.defaultValue;
      updateQuery.executeQuery(collection, myDocument, updateObject).then( () => {
        this.setState({ isLoading: false });
        const navigator = new StackNavigator(this.props.navigation);
        navigator.pop();
      });
    }else this.setState({ isLoading: false });
  }

  constructor(props){
    super(props);

    this.state = {
      defaultValue: this.props.navigation.getParam("fieldValue", ""),
      isLoading: false
    }
    this.placeholder = this.props.navigation.getParam("placeholder", "");
    this.caption = this.props.navigation.getParam("caption", null);
    this.title = this.props.navigation.getParam("fieldTitle", "");
    this.beforeSave = this.props.navigation.getParam("beforeSave", null);
    this.handleDefaultValueChange = this.handleDefaultValueChange.bind(this);
    this.handleSavePress = this.handleSavePress.bind(this);
  }

  render(){
    const placeholder = (this.placeholder !== "")? this.placeholder: this.state.defaultValue;
    return(
      <View style={styles.container}>
        <Title style={{ marginBottom: 8 }}>{this.title}</Title>
        <TextInput
          style={{ marginBottom: 0 }}
          placeholder={placeholder}
          value={this.state.defaultValue}
          onChangeText={this.handleDefaultValueChange}/>
        {this.caption !== null?(
          <Caption>{this.caption}</Caption>
        ):null}
        <View style={{ paddingVertical: 8 }}/>
        <Button
          text="Simpan"
          isLoading={this.state.isLoading}
          onPress={this.handleSavePress}/>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: "#E8EEE8" }
})