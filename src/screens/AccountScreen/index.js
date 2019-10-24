import React from "react";
import moment from "moment";
import firebase from "react-native-firebase";
import OfflineDatabase from "src/api/database/offline";
import { withCurrentUser } from "src/api/people/CurrentUser";
import { withTranslation } from 'react-i18next';
import { Q } from "@nozbe/watermelondb"

import MonoIdField from "src/screens/AccountScreen/fields/monoId";
import NickNameField from "src/screens/AccountScreen/fields/nickName";
import SignOutDialog from "src/screens/AccountScreen/dialogs/SignOutDialog";
import AppHeader from "src/components/AppHeader";
import Container from "src/components/Container";
import { View, StyleSheet, TouchableOpacity } from "react-native";
import { Text } from "react-native-paper";
import { default as EvilIcons } from "react-native-vector-icons/EvilIcons";

function AccountScreen(props){
  const { navigation, currentUser } = props;
  const { applicationInformation, personalInformation } = currentUser;

  const [ isSignOutDialogShown, setIsSignOutDialogShown ] = React.useState(false);
  const [ people, setPeople ] =  React.useState(null);

  const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: "#E8EEE8", color: "black" },
    groupContainer: { marginBottom: 16 },
    menu: { 
      padding: 16, backgroundColor: "white",  display: "flex",  justifyContent: "space-between",
      alignItems: "center", flexDirection: "row", borderBottomWidth: 1, borderBottomColor: "#E8EEE8",
    }
  });

  const handleSignOutPress = () => setIsSignOutDialogShown(true);
  const handleSignOutDialogCancel = () => setIsSignOutDialogShown(false);
  const handleNickNamePress = () => {
    const payload = {
      fieldValue: applicationInformation.nickName,
      fieldTitle: props.t("nickName"),
    }
    navigation.navigate("EditSingleField", payload);
  }

  const handleBirthdayPress = () => {
    const payload = {
      databaseCollection: "users",
      databaseDocumentId: currentUser.email,
      databaseFieldName: "personalInformation.birthday",
      caption: "Format tanggal lahir: 22/12/2007",
      placeholder: "DD/MM/YYYY",
      fieldValue: personalInformation.birthday,
      fieldTitle: props.t("birthDate"),
      datePicker: true,
      beforeSave: (value) => moment(value, "DD/MM/YYYY").isValid()
    }
    navigation.navigate("EditSingleField", payload);
  }

  const handleGenderPress = () => {
    const payload = {
      databaseCollection: "users",
      databaseDocumentId: currentUser.email,
      databaseFieldName: "personalInformation.gender", 
      fieldValue: (personalInformation.gender)? personalInformation.gender: "male",
      fieldTitle: props.t("gender"),
      genderPicker: true
    }
    navigation.navigate("EditSingleField", payload);
  }

  const fetchPeople = async () => {
    const email = firebase.auth().currentUser.email;
    const usersCollection = OfflineDatabase.database.collections.get("users");
    const [ user ] = await usersCollection.query(Q.where("email", email)).fetch();
    setPeople(user);
  }

  React.useEffect(() => {
    fetchPeople();
  }, [])

  if(!people) return null;
  return (
    <Container>
      <AppHeader navigation={navigation} style={{ backgroundColor: "#E8EEE8" }}/>
      <View style={styles.container}>
        <SignOutDialog show={isSignOutDialogShown} onCancel={handleSignOutDialogCancel}/>

        <View style={styles.groupContainer}>
          
          <NickNameField style={styles.menu} people={people}/>
          <MonoIdField style={styles.menu} people={people}/>
          <View style={styles.menu}>
            <Text style={{ fontWeight: "500" }}>Email</Text>
            <View style={{ display: "flex", flexDirection: "row", alignItems: "center" }}>
              <Text>{currentUser.email}</Text>
            </View>
          </View>
        </View>

        <View style={styles.groupContainer}>
          <TouchableOpacity onPress={handleGenderPress}>
            <View style={styles.menu}>
              <Text style={{ fontWeight: "500" }}>{props.t("gender")}</Text>
              <View style={{ display: "flex", flexDirection: "row", alignItems: "center" }}>
                {personalInformation.gender?(
                  <Text>{personalInformation.gender === "male"? "Pria": "Wanita"}</Text>
                ):null}
                <EvilIcons name="chevron-right" size={24} style={{ color: "#5E8864" }}/>
              </View>
            </View>
          </TouchableOpacity>
          <TouchableOpacity onPress={handleBirthdayPress}>
            <View style={styles.menu}>
              <Text style={{ fontWeight: "500" }}>{props.t("birthDate")}</Text>
              <View style={{ display: "flex", flexDirection: "row", alignItems: "center" }}>
                {personalInformation.birthday?(
                  <Text>{moment(personalInformation.birthday, "DD/MM/YYYY").format("DD MMM YYYY")}</Text>
                ):<Text>-</Text>}
                <EvilIcons name="chevron-right" size={24} style={{ color: "#5E8864" }}/>
              </View>
            </View>
          </TouchableOpacity>
        </View>

        <View style={styles.groupContainer}>
          <TouchableOpacity onPress={handleSignOutPress}>
            <View style={styles.menu}>
              <Text style={{ fontWeight: "500" }}>{props.t("logout")}</Text>
              <View style={{ display: "flex", flexDirection: "row", alignItems: "center" }}>
                <EvilIcons name="chevron-right" size={24} style={{ color: "#5E8864" }}/>
              </View>
            </View>
          </TouchableOpacity>
        </View>
      </View>
    </Container> 
  )
}

AccountScreen.navigationOptions = { header: null } 
export default withTranslation()(withCurrentUser(AccountScreen))