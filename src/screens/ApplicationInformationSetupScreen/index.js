import React from "react";
import { StyleSheet } from "react-native";

import AppHeader from "src/components/AppHeader";
import Container from "src/components/Container";
import Button from "src/components/Button";
import ApplicationInformationCard from "src/screens/AccountSetupScreen/ApplicationInformationCard";
import { View } from "react-native";

function ApplicationInformationSetupScreen(props){
  const { navigation } = props;
  const onFinish = navigation.getParam("onFinish", () => {});
  const applicationInformationCard = React.useRef(null);

  const styles = StyleSheet.create({
    content: { padding: 16, flex: 1, backgroundColor: "#E8EEE8", color: "black" },
  })

  const handleSavePress = () => {
    const data = applicationInformationCard.current.getState();
    onFinish(data);
    navigation.goBack();
  }

  return (
    <Container style={{ }}>
      <AppHeader navigation={navigation} style={{ backgroundColor: "#E8EEE8" }}/>
      <View style={styles.content}>
        <ApplicationInformationCard ref={applicationInformationCard}/>
        <Button style={{ marginTop: 8 }} text="Simpan" onPress={handleSavePress}/>
      </View>
    </Container>
  );
}
export default ApplicationInformationSetupScreen;