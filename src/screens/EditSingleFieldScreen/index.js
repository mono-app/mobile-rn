import React from "react";
import { Collection } from "src/api/database/collection";
import { Document } from "src/api/database/document";
import { UpdateDocument } from "src/api/database/query";
import { StyleSheet } from "react-native";
import { withNavigation } from "react-navigation";
import DateTimePicker from "react-native-modal-datetime-picker";
import { TouchableOpacity } from "react-native-gesture-handler";
import moment from "moment"
import TextInput from "src/components/TextInput";
import Button from "src/components/Button";
import AppHeader from "src/components/AppHeader";
import Container from "src/components/Container";
import { Title, Caption, Text } from "react-native-paper";
import { View, Picker } from "react-native";
import { default as EvilIcons } from "react-native-vector-icons/EvilIcons";
import { withTranslation } from 'react-i18next';

function EditSingleFieldScreen(props){
  const { navigation } = props;
  const [ defaultValue, setDefaultValue ] = React.useState(navigation.getParam("fieldValue", ""));
  const [ isLoading, setIsLoading ] = React.useState(false);
  const [ isDatePickerVisible, setDatePickerVisible ] = React.useState(false);
  const databaseCollection = navigation.getParam("databaseCollection", null);
  const databaseDocumentId = navigation.getParam("databaseDocumentId", null);
  const databaseFieldName = navigation.getParam("databaseFieldName", null);
  const isGenderPicker = navigation.getParam("genderPicker", false)
  const isDatePicker = navigation.getParam("datePicker", false)
  const placeholder = navigation.getParam("placeholder", defaultValue);
  const caption = navigation.getParam("caption", null);
  const title = navigation.getParam("fieldTitle", "");
  const beforeSave = navigation.getParam("beforeSave", null);

  const styles = StyleSheet.create({
    container: { flex: 1, padding: 16, backgroundColor: "#E8EEE8" },
    listItemContainer: {
      marginTop: 16,
      backgroundColor: "#fff",
      flexDirection: "row",
      borderRadius: 8,
      padding: 16,
      paddingVertical: 12,
      alignItems: "center"
    },
    listDescriptionContainer: {
      flex: 1,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between"
    },
    label: {
      fontWeight: "bold"
    }
  });

  const handleDefaultValueChange = (newValue) => setDefaultValue(newValue)

  const handleGenderChange = (gender) => {setDefaultValue(gender);}

  const handleDatePicked = (date) => {
    setDefaultValue(moment(date).format("DD/MM/YYYY"))    
    hideDatePicker();
  }

  const showDateTimePicker = () => {
    setDatePickerVisible(true)
  };

  const hideDatePicker = () => {
    setDatePickerVisible(false)
  }

  const handleSavePress = async () => {
    setIsLoading(true);

    let canSave = false;
    if(beforeSave) canSave = await beforeSave(defaultValue);
    else canSave = true;

    if(canSave&&defaultValue.trim().length>0){

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
        {(isGenderPicker)? 
        <View>
          <Picker
            selectedValue={defaultValue}
            onValueChange={handleGenderChange}>
            <Picker.Item label="Perempuan" value="female" />
            <Picker.Item label="Laki-Laki" value="male" />
          </Picker>
        </View>
        : 
        (isDatePicker)? 
        <TouchableOpacity onPress={showDateTimePicker}>
          <View style={styles.listItemContainer}>
            <View style={styles.listDescriptionContainer}>
              <Text style={styles.label}>
                {defaultValue}
              </Text>
              <View style={{ flexDirection: "row", textAlign: "right" }}>
                <EvilIcons
                  name="calendar"
                  size={24}
                  style={{ color: "#5E8864" }}
                />
              </View>
            </View>
          </View>
         
        </TouchableOpacity>
        : 
        <TextInput
        style={{ marginBottom: 0 }} placeholder={placeholder}
        value={defaultValue} onChangeText={handleDefaultValueChange} maxLength={(databaseFieldName==="applicationInformation.nickName")?30:256}/>
        }
       
        {caption !== null?<Caption>{caption}</Caption>:null}
        <View style={{ paddingVertical: 8 }}/>
        <Button text={props.t("save")} isLoading={isLoading} onPress={handleSavePress}/>
      </View>
      <DateTimePicker
          date={(isDatePicker && defaultValue)?moment(defaultValue, "DD-MM-YYYY").toDate():new Date()}
          isVisible={isDatePickerVisible}
          onConfirm={handleDatePicked}
          onCancel={hideDatePicker}
          mode={"date"}
        />
    </Container>
  )
}
EditSingleFieldScreen.navigationOptions = { header: null }
export default withTranslation()(withNavigation(EditSingleFieldScreen))