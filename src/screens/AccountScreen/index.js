import React from "react";
import SInfo from "react-native-sensitive-info";
import firebase from "react-native-firebase";
import moment from "moment";
import { View, StyleSheet, TouchableOpacity } from "react-native";
import { NavigationEvents } from 'react-navigation';
import { Text } from "react-native-paper";
import { default as EvilIcons } from "react-native-vector-icons/EvilIcons";

import PeopleAPI from "src/api/people";
import Navigator, { StackNavigator } from "src/api/navigator";
import SignOutDialog from "src/screens/AccountScreen/dialogs/SignOutDialog";

const INITIAL_STATE = { nickName: "", monoId: "", dateOfBirth: "", gender: "" }

export default class AccountScreen extends React.Component{
  static navigationOptions = { 
    headerTitle: "Account",
    headerStyle: { backgroundColor: "#E8EEE8", elevation: 0 }
  };

  handleBeforeDateOfBirthDave = value => moment(value, "DD/MM/YYYY").isValid();
  handleSignOutPress = e => this.signOutDialog.toggleShow();
  handleProceedSignOutPress = e => {
    firebase.auth().signOut().then(() => {
      return SInfo.deleteItem("currentUserEmail", {})
    }).then(() => {
      const navigator = new StackNavigator(this.props.navigation);
      navigator.resetTo("Splash", { key: null });
    })
  }

  handleNickNamePress = e => {
    new PeopleAPI().getCurrentUserEmail().then(currentUserEmail => {
      const payload = {
        databaseCollection: "users",
        databaseDocumentId: currentUserEmail,
        databaseFieldName: "applicationInformation.nickName", 
        fieldValue: this.state.nickName,
        fieldTitle: "Nama Panggilan",
        sourceTabName: "Setting"
      }
      const navigator = new Navigator(this.props.navigation);
      navigator.navigateTo(`${payload.sourceTabName}EditSingleFieldScreen`, payload);
    })
  }

  handleMonoIdPress = e => {
    new PeopleAPI().getCurrentUserEmail().then(currentUserEmail => {
      const payload = {
        databaseCollection: "users",
        databaseDocumentId: currentUserEmail,
        databaseFieldName: "applicationInformation.id", 
        fieldValue: this.state.monoId,
        fieldTitle: "Mono ID",
        sourceTabName: "Setting"
      }
      const navigator = new Navigator(this.props.navigation);
      navigator.navigateTo(`${payload.sourceTabName}EditSingleFieldScreen`, payload);
    })
  }

  handleDateOfBirthPress = e => {
    new PeopleAPI().getCurrentUserEmail().then(currentUserEmail => {
      const payload = {
        databaseCollection: "users",
        databaseDocumentId: currentUserEmail,
        databaseFieldName: "personalInformation.dateOfBirth",
        caption: "Format tanggal lahir: 22/12/2007",
        placeholder: "DD/MM/YYYY",
        fieldValue: this.state.dateOfBirth,
        fieldTitle: "Tanggal Lahir",
        beforeSave: this.handleBeforeDateOfBirthDave
      }
      const navigator = new Navigator(this.props.navigation);
      navigator.navigateTo("EditSingleField", payload);
    })
  }

  handleScreenDidFocus = () => {
    const peopleAPI = new PeopleAPI();
    peopleAPI.getCurrentUserEmail().then(currentUserEmail => {
      return peopleAPI.getDetail(currentUserEmail);
    }).then(userData => {
      const { id, nickName } = userData.applicationInformation;
      const { dateOfBirth, gender } = userData.personalInformation;
      this.setState({ nickName, monoId: id, dateOfBirth, gender });
    })
  }

  constructor(props){
    super(props);

    this.state = INITIAL_STATE;
    this.signOutDialog = null;
    this.stringMapping = { male: "Pria", female: "Wanita" }
    this.handleScreenDidFocus = this.handleScreenDidFocus.bind(this);
    this.handleNickNamePress = this.handleNickNamePress.bind(this);
    this.handleMonoIdPress = this.handleMonoIdPress.bind(this);
    this.handleSignOutPress = this.handleSignOutPress.bind(this);
    this.handleDateOfBirthPress = this.handleDateOfBirthPress.bind(this);
    this.handleProceedSignOutPress = this.handleProceedSignOutPress.bind(this);
    this.handleBeforeDateOfBirthDave = this.handleBeforeDateOfBirthDave.bind(this);
  }

  render(){
    return (
      <View style={styles.container}>
        <NavigationEvents onDidFocus={this.handleScreenDidFocus}/>
        <SignOutDialog 
          ref={i => this.signOutDialog = i}
          onSignOutPress={this.handleProceedSignOutPress}/>

        <View style={styles.groupContainer}>
          <TouchableOpacity onPress={this.handleNickNamePress}>
            <View style={styles.menu}>
              <Text style={{ fontWeight: "500" }}>Nama Panggilan</Text>
              <View style={{ display: "flex", flexDirection: "row", alignItems: "center" }}>
                <Text>{this.state.nickName}</Text>
                <EvilIcons name="chevron-right" size={24} style={{ color: "#5E8864" }}/>
              </View>
            </View>
          </TouchableOpacity>
          
          <TouchableOpacity onPress={this.handleMonoIdPress}>
            <View style={styles.menu}>
              <Text style={{ fontWeight: "500" }}>Mono ID</Text>
              <View style={{ display: "flex", flexDirection: "row", alignItems: "center" }}>
                <Text>{this.state.monoId}</Text>
                <EvilIcons name="chevron-right" size={24} style={{ color: "#5E8864" }}/>
              </View>
            </View>
          </TouchableOpacity>
        </View>

        <View style={styles.groupContainer}>
          <TouchableOpacity onPress={() => {}}>
            <View style={styles.menu}>
              <Text style={{ fontWeight: "500" }}>Gender</Text>
              <View style={{ display: "flex", flexDirection: "row", alignItems: "center" }}>
                {this.state.gender?(
                  <Text>{this.stringMapping[this.state.gender]}</Text>
                ):null}
                <EvilIcons name="chevron-right" size={24} style={{ color: "#5E8864" }}/>
              </View>
            </View>
          </TouchableOpacity>
          <TouchableOpacity onPress={this.handleDateOfBirthPress}>
            <View style={styles.menu}>
              <Text style={{ fontWeight: "500" }}>Tanggal Lahir</Text>
              <View style={{ display: "flex", flexDirection: "row", alignItems: "center" }}>
                {this.state.dateOfBirth?(
                  <Text>{moment(this.state.dateOfBirth, "DD/MM/YYYY").format("DD MMM YYYY")}</Text>
                ):null}
                <EvilIcons name="chevron-right" size={24} style={{ color: "#5E8864" }}/>
              </View>
            </View>
          </TouchableOpacity>
        </View>

        <View style={styles.groupContainer}>
          <TouchableOpacity onPress={this.handleSignOutPress}>
            <View style={styles.menu}>
              <Text style={{ fontWeight: "500" }}>Sign Out</Text>
              <View style={{ display: "flex", flexDirection: "row", alignItems: "center" }}>
                <EvilIcons name="chevron-right" size={24} style={{ color: "#5E8864" }}/>
              </View>
            </View>
          </TouchableOpacity>
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#E8EEE8", color: "black" },
  groupContainer: { marginBottom: 16 },
  menu: { 
    padding: 16,
    backgroundColor: "white", 
    display: "flex", 
    justifyContent: "space-between",
    alignItems: "center",
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#E8EEE8",
  }
});
