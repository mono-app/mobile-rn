import React from "react";
import PeopleAPI from "src/api/people";
import ApplicationInformation from "src/entities/applicationInformation";
import { StyleSheet } from "react-native";

import AppHeader from "src/components/AppHeader";
import Container from "src/components/Container";
import Button from "src/components/Button";
import ApplicationInformationCard from "src/screens/AccountSetupScreen/ApplicationInformationCard";
import CustomSnackbar from "src/components/CustomSnackbar";
import { View } from "react-native";
import { withTranslation } from 'react-i18next';

function ApplicationInformationSetupScreen(props){
  const { navigation } = props;

  const onFinish = navigation.getParam("onFinish", () => {});
  const defaultMonoId = navigation.getParam("defaultMonoId", "");
  const defaultNickName = navigation.getParam("defaultNickName", "");

  const [isLoading, setLoading] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState(null);
  
  const applicationInformationCard = React.useRef(null);  

  const styles = StyleSheet.create({
    content: { padding: 16, flex: 1, backgroundColor: "#E8EEE8", color: "black" },
  })

  const handleDismiss = () => setErrorMessage(null);
  const handleError = (message) => setErrorMessage(message);
  const handleSavePress = async () => {
    setLoading(true)
    try{
      const data = applicationInformationCard.current.getState();
      const applicationInformation = new ApplicationInformation(data.monoId, data.nickName);
      await PeopleAPI.ensureUniqueMonoId(applicationInformation.monoId);
      onFinish(applicationInformation);
      navigation.goBack();
    }catch(err){
      console.log(err);
      handleError(err.message);
    }finally{ setLoading(false) }
  } 

  return (
    <Container style={{ }}>
      <AppHeader navigation={navigation} style={{ backgroundColor: "#E8EEE8" }}/>
      <View style={styles.content}>
        <ApplicationInformationCard t={props.t} ref={applicationInformationCard} defaultMonoId={defaultMonoId} defaultNickName={defaultNickName}/>
        <Button style={{ marginTop: 8 }} text={props.t("save")} isLoading={isLoading} disabled={isLoading} onPress={handleSavePress}/>
      </View>
      <CustomSnackbar isError={true} message={errorMessage} onDismiss={handleDismiss}/>
    </Container>
  );
}
export default withTranslation()(ApplicationInformationSetupScreen);