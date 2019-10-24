import React from "react";
import OfflineDatabase from "src/api/database/offline";
import { Collection } from "src/api/database/collection";
import { Document } from "src/api/database/document";
import { UpdateDocument } from "src/api/database/query";
import { StyleSheet } from "react-native";
import { withNavigation } from "react-navigation";
import { withTranslation } from 'react-i18next';

import TextInput from "src/components/TextInput";
import Button from "src/components/Button";
import AppHeader from "src/components/AppHeader";
import Container from "src/components/Container";
import DatePicker from "src/screens/EditSingleFieldScreen/DatePicker";
import GenderPicker from "src/screens/EditSingleFieldScreen/GenderPicker";
import { Title, Caption } from "react-native-paper";
import { View } from "react-native";

function EditSingleFieldScreen(props){
  const { navigation } = props;
  const [ defaultValue, setDefaultValue ] = React.useState(navigation.getParam("fieldValue", ""));
  const [ isLoading, setIsLoading ] = React.useState(false);
  
  const maxLength = navigation.getParam("maxLength", 256);
  const databaseCollection = navigation.getParam("databaseCollection", null);
  const databaseDocumentId = navigation.getParam("databaseDocumentId", null);
  const databaseFieldName = navigation.getParam("databaseFieldName", null);
  const isGenderPicker = navigation.getParam("genderPicker", false)
  const isDatePicker = navigation.getParam("datePicker", false)
  const placeholder = navigation.getParam("placeholder", defaultValue);
  const caption = navigation.getParam("caption", "");
  const title = navigation.getParam("fieldTitle", "");
  const beforeSave = navigation.getParam("beforeSave", null);
  const onSave = navigation.getParam("onSave", null);

  const styles = StyleSheet.create({
    container: { flex: 1, padding: 16, backgroundColor: "#E8EEE8" },
  });

  const handleDefaultValueChange = (newValue) => setDefaultValue(newValue)
  const handleGenderChange = (gender) => setDefaultValue(gender)
  const handleDatePicked = (date) => setDefaultValue(date)
  const handleSavePress = async () => {
    setIsLoading(true);

    let canSave = false;
    if(beforeSave) canSave = await beforeSave(defaultValue);
    else canSave = true;

    if(canSave && defaultValue.trim().length > 0){
      if(onSave) {
        await onSave(defaultValue.trim()); 
        OfflineDatabase.synchronize();
      }
      else await saveFirebase(defaultValue.trim());

      setIsLoading(false);
      navigation.goBack();
    }else setIsLoading(false);
  }

  const saveFirebase = async (value) => {
    const collection = new Collection(databaseCollection);
    const myDocument = new Document(databaseDocumentId);
    const updateQuery = new UpdateDocument();
    
    const updateObject = {};
    updateObject[`${databaseFieldName}`] = JSON.parse(JSON.stringify(value));
    await updateQuery.executeQuery(collection, myDocument, updateObject);
  }

  return(
    <Container>
      <AppHeader navigation={navigation} style={{ backgroundColor: "#E8EEE8" }}/>
      <View style={styles.container}>
        <Title style={{ marginBottom: 8 }}>{title}</Title>
        {(isGenderPicker)? (
          <GenderPicker value={defaultValue} onValueChange={handleGenderChange}/>
        ):(isDatePicker)?(
          <DatePicker onDatePicked={handleDatePicked}/>
        ):(
          <TextInput
            style={{ marginBottom: 0 }} placeholder={placeholder} maxLength={maxLength}
            value={defaultValue} onChangeText={handleDefaultValueChange} />
        )}
        <Caption>{caption}</Caption>
        <View style={{ paddingVertical: 8 }}/>
        <Button text={props.t("save")} isLoading={isLoading} onPress={handleSavePress}/>
      </View>
    </Container>
  )
}
EditSingleFieldScreen.navigationOptions = { header: null }
export default withTranslation()(withNavigation(EditSingleFieldScreen))