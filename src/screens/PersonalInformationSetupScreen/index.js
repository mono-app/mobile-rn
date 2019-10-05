import React from "react";
import { StyleSheet } from "react-native";

import AppHeader from "src/components/AppHeader";
import Container from "src/components/Container";
import Button from "src/components/Button";
import PersonalInformationCard from "src/screens/AccountSetupScreen/PersonalInformationCard";
import { View } from "react-native";

function PersonalInformationSetupScreen(props){
  const { navigation } = props;
  const onFinish = navigation.getParam("onFinish", () => {});
  const personalInformationCard = React.useRef(null);

  const styles = StyleSheet.create({
    content: { padding: 16, flex: 1, backgroundColor: "#E8EEE8", color: "black" },
  })

  const handleSavePress = () => {
    const data = personalInformationCard.current.getState();
    onFinish(data);
    navigation.goBack();
  }

  return (
    <Container style={{ }}>
      <AppHeader navigation={navigation} style={{ backgroundColor: "#E8EEE8" }}/>
      <View style={styles.content}>
        <PersonalInformationCard ref={personalInformationCard}/>
        <Button style={{ marginTop: 8 }} text="Simpan" onPress={handleSavePress}/>
      </View>
    </Container>
  );
}
export default PersonalInformationSetupScreen;