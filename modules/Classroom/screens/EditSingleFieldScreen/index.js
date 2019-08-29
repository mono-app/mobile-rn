import React from "react";
import { View, StyleSheet } from "react-native";
import { Card, Title, Caption, Drawer } from "react-native-paper";

import TextInput from "src/components/TextInput";
import Button from "src/components/Button";
import { Collection } from "src/api/database/collection";
import { Document } from "src/api/database/document";
import { UpdateDocument } from "src/api/database/query";

export default class EditSingleFieldScreen extends React.PureComponent{
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
      const schoolId = this.props.navigation.getParam("schoolId", null);
      const databaseCollection = this.props.navigation.getParam("databaseCollection", null);
      const databaseDocumentId = this.props.navigation.getParam("databaseDocumentId", null);
      const databaseFieldName = this.props.navigation.getParam("databaseFieldName", null);

      const schoolCollection = new Collection("schools")
      const collection = new Collection(databaseCollection);
      const schoolDocument = new Document(schoolId);
      const myDocument = new Document(databaseDocumentId);
      const updateQuery = new UpdateDocument();
      let updateObject = {};

      updateObject[`${databaseFieldName}`] = this.state.defaultValue;
      if(databaseFieldName==="email"){
        updateObject['isActive'] = false;
      }

      updateQuery.executeQuery2(schoolCollection, collection, schoolDocument, myDocument, updateObject).then( () => {
        this.setState({ isLoading: false });
        const { navigation } = this.props;
        navigation.state.params.onRefresh(this.state.defaultValue);
        navigation.goBack();
      });
    }else this.setState({ isLoading: false });
  }

  constructor(props){
    super(props);

    this.state = {
      defaultValue: this.props.navigation.getParam("fieldValue", ""),
      isLoading: false
    }
    this.keyboardType="default";
    this.isNumber = this.props.navigation.getParam("isNumber", false);
    this.isMultiline = this.props.navigation.getParam("isMultiline", false);
    this.isGender = this.props.navigation.getParam("isGender", false);
    if(this.isNumber){
      this.keyboardType="numeric"
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
        {(this.isGender)?
          (
            <Card style={{paddingTop: 8}}>
              <Drawer.Section>
              <Drawer.Item
                label="Pria"
                active={this.state.defaultValue === 'pria'}
                onPress={() => { this.setState({ defaultValue: 'pria' }); }}
              />
              <Drawer.Item
                label="Wanita"
                active={this.state.defaultValue === 'wanita'}
                onPress={() => { this.setState({ defaultValue: 'wanita' }); }}
              />
            </Drawer.Section>
          </Card>
          )
        :
          (
          <TextInput
            style={(this.isMultiline)?{textAlignVertical: "top" }:{}}
            placeholder={placeholder}
            value={this.state.defaultValue}
            multiline={this.isMultiline}
            numberOfLines={(this.isMultiline)?3:1}
            keyboardType={this.keyboardType}
            onChangeText={this.handleDefaultValueChange}/>
          )
        }

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