import React from "react";
import PersonalInformation from "src/entities/personalInformation";
import { StyleSheet } from "react-native";
import { withTranslation } from 'react-i18next';

import AppHeader from "src/components/AppHeader";
import Container from "src/components/Container";
import Button from "src/components/Button";
import CustomSnackbar from "src/components/CustomSnackbar";
import PersonalInformationCard from "src/screens/AccountSetupScreen/PersonalInformationCard";
import { View } from "react-native";

function PersonalInformationSetupScreen(props){
  const { navigation } = props;

  const onFinish = navigation.getParam("onFinish", () => {});
  const defaultGivenName = navigation.getParam("defaultGivenName","")
  const defaultFamilyName = navigation.getParam("defaultFamilyName","")
  const defaultGender = navigation.getParam("defaultGender","male")
  
  const [ snackbarMessage, setSnackbarMessage ] = React.useState(null);

  const personalInformationCard = React.useRef(null);

  const styles = StyleSheet.create({
    content: { padding: 16, flex: 1, backgroundColor: "#E8EEE8", color: "black" },
  })

  const handleDismiss = () => setSnackbarMessage(null)
  const handleSavePress = () => {
    try{
      const data = personalInformationCard.current.getState()
      const personalInformation = new PersonalInformation(data.givenName, data.familyName, data.gender)
      onFinish(personalInformation);
      navigation.goBack();
    }catch(err){
      setSnackbarMessage(err.message);
    }
  }

  return (
    <Container style={{ }}>
      <AppHeader navigation={navigation} style={{ backgroundColor: "#E8EEE8" }}/>
      <View style={styles.content}>
        <PersonalInformationCard t={props.t} ref={personalInformationCard} defaultGivenName={defaultGivenName} defaultFamilyName={defaultFamilyName} defaultGender={defaultGender}/>
        <Button style={{ marginTop: 8 }} text={props.t("save")} onPress={handleSavePress}/>
      </View>
      <CustomSnackbar isError={true} message={snackbarMessage} onDismiss={handleDismiss} />
    </Container>
  );
}
export default withTranslation()(PersonalInformationSetupScreen)