import React from "react";
import firebase from "react-native-firebase";
import moment from "moment";
import { withNavigation } from "react-navigation";
import { withCurrentUser } from "src/api/people/CurrentUser";

import CurrentUserAPI from "src/api/people/CurrentUser";
import Navigator, { StackNavigator } from "src/api/navigator";
import HeadlineTitle from "src/components/HeadlineTitle";
import SignOutDialog from "src/screens/AccountScreen/dialogs/SignOutDialog";
import AppHeader from "src/components/AppHeader";
import { View, StyleSheet, TouchableOpacity } from "react-native";
import { Text } from "react-native-paper";
import { default as EvilIcons } from "react-native-vector-icons/EvilIcons";

function AccountScreen(props){
  const [ isSignOutDialogShown, setIsSignOutDialogShown ] = React.useState(false);
  const { navigation, currentUser } = props;
  const { applicationInformation, personalInformation } = currentUser;
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
      databaseCollection: "users",
      databaseDocumentId: currentUser.email,
      databaseFieldName: "applicationInformation.nickName", 
      fieldValue: applicationInformation.nickName,
      fieldTitle: "Nama Panggilan",
    }
    navigation.navigate("EditSingleField", payload);
  }

  const handleDateOfBirthPress = () => {
    const payload = {
      databaseCollection: "users",
      databaseDocumentId: currentUser.email,
      databaseFieldName: "personalInformation.dateOfBirth",
      caption: "Format tanggal lahir: 22/12/2007",
      placeholder: "DD/MM/YYYY",
      fieldValue: personalInformation.dateOfBirth,
      fieldTitle: "Tanggal Lahir",
      beforeSave: (value) => moment(value, "DD/MM/YYYY").isValid()
    }
    navigation.navigate("EditSingleField", payload);
  }

  if(currentUser === {}) return;
  return (
    <View style={{ display: "flex", flexDirection: "column", flexGrow: 1 }}>
      <AppHeader navigation={navigation} style={{ backgroundColor: "#E8EEE8" }}/>
      <View style={styles.container}>
        <SignOutDialog show={isSignOutDialogShown} onCancel={handleSignOutDialogCancel}/>

        <View style={styles.groupContainer}>
          <TouchableOpacity onPress={handleNickNamePress}>
            <View style={styles.menu}>
              <Text style={{ fontWeight: "500" }}>Nama Panggilan</Text>
              <View style={{ display: "flex", flexDirection: "row", alignItems: "center" }}>
                <Text>{applicationInformation.nickName}</Text>
                <EvilIcons name="chevron-right" size={24} style={{ color: "#5E8864" }}/>
              </View>
            </View>
          </TouchableOpacity>
          
          <View style={styles.menu}>
            <Text style={{ fontWeight: "500" }}>Mono ID</Text>
            <View style={{ display: "flex", flexDirection: "row", alignItems: "center" }}>
              <Text>{applicationInformation.id}</Text>
            </View>
          </View>
        </View>

        <View style={styles.groupContainer}>
          <TouchableOpacity onPress={() => {}}>
            <View style={styles.menu}>
              <Text style={{ fontWeight: "500" }}>Gender</Text>
              <View style={{ display: "flex", flexDirection: "row", alignItems: "center" }}>
                {personalInformation.gender?(
                  <Text>{personalInformation.gender === "male"? "Pria": "Wanita"}</Text>
                ):null}
                <EvilIcons name="chevron-right" size={24} style={{ color: "#5E8864" }}/>
              </View>
            </View>
          </TouchableOpacity>
          <TouchableOpacity onPress={handleDateOfBirthPress}>
            <View style={styles.menu}>
              <Text style={{ fontWeight: "500" }}>Tanggal Lahir</Text>
              <View style={{ display: "flex", flexDirection: "row", alignItems: "center" }}>
                {personalInformation.dateOfBirth?(
                  <Text>{moment(personalInformation.dateOfBirth, "DD/MM/YYYY").format("DD MMM YYYY")}</Text>
                ):null}
                <EvilIcons name="chevron-right" size={24} style={{ color: "#5E8864" }}/>
              </View>
            </View>
          </TouchableOpacity>
        </View>

        <View style={styles.groupContainer}>
          <TouchableOpacity onPress={handleSignOutPress}>
            <View style={styles.menu}>
              <Text style={{ fontWeight: "500" }}>Sign Out</Text>
              <View style={{ display: "flex", flexDirection: "row", alignItems: "center" }}>
                <EvilIcons name="chevron-right" size={24} style={{ color: "#5E8864" }}/>
              </View>
            </View>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  )
}
export default withCurrentUser(AccountScreen)