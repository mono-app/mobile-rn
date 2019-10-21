import React from "react";
import { StyleSheet } from "react-native";
import { withTranslation } from 'react-i18next';
import AppHeader from "src/components/AppHeader";
import Container from "src/components/Container";
import Button from "src/components/Button";
import PersonalInformationCard from "src/screens/AccountSetupScreen/PersonalInformationCard";
import { View } from "react-native";

function PersonalInformationSetupScreen(props){
  const { navigation } = props;
  const onFinish = navigation.getParam("onFinish", () => {});
  const defaultGivenName = navigation.getParam("defaultGivenName","")
  const defaultFamilyName = navigation.getParam("defaultFamilyName","")
  const defaultGender = navigation.getParam("defaultGender","male")
  const personalInformationCard = React.useRef(null);

  const styles = StyleSheet.create({
    content: { padding: 16, flex: 1, backgroundColor: "#E8EEE8", color: "black" },
  })

  const handleSavePress = () => {
    let data = JSON.parse(JSON.stringify(personalInformationCard.current.getState()))
    data.givenName = data.givenName.trim()
    data.familyName = data.familyName.trim()
    if(data.givenName && data.familyName){
      onFinish(data);
      navigation.goBack();
    }
  }

  return (
    <Container style={{ }}>
      <AppHeader navigation={navigation} style={{ backgroundColor: "#E8EEE8" }}/>
      <View style={styles.content}>
        <PersonalInformationCard t={props.t} ref={personalInformationCard} defaultGivenName={defaultGivenName} defaultFamilyName={defaultFamilyName} defaultGender={defaultGender}/>
        <Button style={{ marginTop: 8 }} text="Simpan" onPress={handleSavePress}/>
      </View>
    </Container>
  );
}
export default withTranslation()(PersonalInformationSetupScreen)