import React from "react";
import { View, StyleSheet } from "react-native";
import { Title } from "react-native-paper";

import TextInput from "../../components/TextInput";
import Button from "../../components/Button";
import { StackNavigator } from "../../api/navigator";
import { Collection } from "../../api/database/collection";
import { Document } from "../../api/database/document";
import { UpdateDocument } from "../../api/database/query";

export default class EditSingleFieldScreen extends React.Component{
  static navigationOptions = {
    headerStyle: { backgroundColor: "#E8EEE8", elevation: 0 }
  }

  handleDefaultValueChange = defaultValue => this.setState({ defaultValue });
  handleSavePress = () => {
    this.setState({ isLoading: true });
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
  }

  constructor(props){
    super(props);

    this.state = {
      defaultValue: this.props.navigation.getParam("fieldValue", ""),
      isLoading: false
    }
    this.title = this.props.navigation.getParam("fieldTitle", "");
    this.handleDefaultValueChange = this.handleDefaultValueChange.bind(this);
    this.handleSavePress = this.handleSavePress.bind(this);
  }

  render(){
    return(
      <View style={styles.container}>
        <Title style={{ marginBottom: 8 }}>{this.title}</Title>
        <TextInput
          placeholder={this.state.defaultValue}
          value={this.state.defaultValue}
          onChangeText={this.handleDefaultValueChange}/>
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