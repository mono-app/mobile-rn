import React from "react";
import { Collection } from "src/api/database/collection";
import { Document } from "src/api/database/document";
import { UpdateDocument } from "src/api/database/query";
import { StyleSheet } from "react-native";
import { withNavigation } from "react-navigation";

import TextInput from "src/components/TextInput";
import Button from "src/components/Button";
import AppHeader from "src/components/AppHeader";
import Container from "src/components/Container";
import { Title, Caption } from "react-native-paper";
import { View } from "react-native";

function EditSingleFieldScreen(props){
  const { navigation } = props;
  const [ defaultValue, setDefaultValue ] = React.useState(navigation.getParam("fieldValue", ""));
  const [ isLoading, setIsLoading ] = React.useState(false);

  const placeholder = navigation.getParam("placeholder", defaultValue);
  const caption = navigation.getParam("caption", null);
  const title = navigation.getParam("fieldTitle", "");
  const beforeSave = navigation.getParam("beforeSave", null);

  const styles = StyleSheet.create({
    container: { flex: 1, padding: 16, backgroundColor: "#E8EEE8" }
  });

  const handleDefaultValueChange = (newValue) => setDefaultValue(newValue)
  const handleSavePress = async () => {
    setIsLoading(true);

    let canSave = false;
    if(beforeSave) canSave = await beforeSave(defaultValue);
    else canSave = true;

    if(canSave){
      const databaseCollection = navigation.getParam("databaseCollection", null);
      const databaseDocumentId = navigation.getParam("databaseDocumentId", null);
      const databaseFieldName = navigation.getParam("databaseFieldName", null);

      const collection = new Collection(databaseCollection);
      const myDocument = new Document(databaseDocumentId);
      const updateQuery = new UpdateDocument();
      
      const updateObject = {};
      updateObject[`${databaseFieldName}`] = JSON.parse(JSON.stringify(defaultValue));
      await updateQuery.executeQuery(collection, myDocument, updateObject);
      setIsLoading(false);
      navigation.goBack();
    }else setIsLoading(false);
  }

  return(
    <Container>
      <AppHeader navigation={navigation} style={{ backgroundColor: "#E8EEE8" }}/>
      <View style={styles.container}>
        <Title style={{ marginBottom: 8 }}>{title}</Title>
        <TextInput
          style={{ marginBottom: 0 }} placeholder={placeholder}
          value={defaultValue} onChangeText={handleDefaultValueChange}/>
        {caption !== null?<Caption>{caption}</Caption>:null}
        <View style={{ paddingVertical: 8 }}/>
        <Button text="Simpan" isLoading={isLoading} onPress={handleSavePress}/>
      </View>
    </Container>
  )
}
EditSingleFieldScreen.navigationOptions = { header: null }
export default withNavigation(EditSingleFieldScreen);