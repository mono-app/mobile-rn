import React from "react";
import { StyleSheet, View } from "react-native";
import { 
  Dialog, Paragraph, Portal, 
  Button as MaterialButton 
} from "react-native-paper";
import AppHeader from "src/components/AppHeader";
import Container from "src/components/Container";
import Button from "src/components/Button";
import ApplicationInformationCard from "src/screens/AccountSetupScreen/ApplicationInformationCard";
import PeopleAPI from "src/api/people";

function ApplicationInformationSetupScreen(props){
  const { navigation } = props;
  const onFinish = navigation.getParam("onFinish", () => {});
  const applicationInformationCard = React.useRef(null);
  const [isError, setError] = React.useState(false);
  const [isLoading, setLoading] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState("");
  const defaultId = navigation.getParam("defaultId","")
  const defaultNickName = navigation.getParam("defaultNickName","")

  const styles = StyleSheet.create({
    content: { padding: 16, flex: 1, backgroundColor: "#E8EEE8", color: "black" },
  })

  const handleSavePress = async () => {
    setLoading(true)
    let data = JSON.parse(JSON.stringify(applicationInformationCard.current.getState()))
    data.id = data.id.trim()
    data.nickName = data.nickName.trim()
    if(data.id && data.nickName){
      const isAvailable = await PeopleAPI.isMonoIdAvailable(data.id)
      if(isAvailable){
        onFinish(data);
        navigation.goBack();
      }else{
        setErrorMessage("Mono ID sudah digunakan!")
        setError(true)
      }
    }
    setLoading(false)
  }

  const handleErrorDialogDismiss = () => {
    setError(false)
    setErrorMessage("")
  }

  return (
    <Container style={{ }}>
      <AppHeader navigation={navigation} style={{ backgroundColor: "#E8EEE8" }}/>
      <View style={styles.content}>
        <ApplicationInformationCard ref={applicationInformationCard} defaultId={defaultId} defaultNickName={defaultNickName}/>
        <Button style={{ marginTop: 8 }} text="Simpan" isLoading={isLoading} disabled={isLoading} onPress={handleSavePress}/>
      </View>
      <Portal>
        <Dialog visible={isError} onDismiss={handleErrorDialogDismiss}>
          <Dialog.Title>Ops!</Dialog.Title>
          <Dialog.Content>
            <Paragraph>{errorMessage}</Paragraph>
          </Dialog.Content>
          <Dialog.Actions>
            <MaterialButton onPress={handleErrorDialogDismiss}>Mengerti</MaterialButton>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </Container>
  );
}
export default ApplicationInformationSetupScreen;