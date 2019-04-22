import React from "react";
import { View, StyleSheet, Text, TouchableOpacity } from "react-native";
import { NavigationEvents, NavigationActions, StackActions } from 'react-navigation';
import { default as EvilIcons } from "react-native-vector-icons/EvilIcons";
import SInfo from "react-native-sensitive-info";
import firebase from "react-native-firebase";

import { GetDocument } from "../../api/database/query";
import { UserCollection } from "../../api/database/collection";
import { Document } from "../../api/database/document";
import SignOutDialog from "./dialogs/SignOutDialog";
import Navigator, { StackNavigator } from "../../api/navigator";

const INITIAL_STATE = { nickName: "", monoId: "", isSignOutVisible: false }

export default class AccountScreen extends React.Component{
  static navigationOptions = { 
    headerTitle: "Account",
    headerStyle: { backgroundColor: "#E8EEE8", elevation: 0 }
  };

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
    SInfo.getItem("currentUserEmail", {}).then(currentUserEmail => {
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
    SInfo.getItem("currentUserEmail", {}).then(currentUserEmail => {
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

  handleScreenDidFocus = () => {
    SInfo.getItem("currentUserEmail", {}).then(currentUserEmail => {
      const userCollection = new UserCollection();
      const userDocument = new Document(currentUserEmail);
      const getDocumentQuery = new GetDocument();
      getDocumentQuery.setGetConfiguration("default");
      return getDocumentQuery.executeQuery(userCollection, userDocument);
    }).then(doc => {
      if(doc.exists){
        const userData = doc.data();
        const { id, nickName } = userData.applicationInformation;
        this.setState({ nickName, monoId: id });
      }
    }).catch(err => console.error(err));
  }

  constructor(props){
    super(props);

    this.state = INITIAL_STATE;
    this.signOutDialog = null;
    this.handleScreenDidFocus = this.handleScreenDidFocus.bind(this);
    this.handleNickNamePress = this.handleNickNamePress.bind(this);
    this.handleMonoIdPress = this.handleMonoIdPress.bind(this);
    this.handleSignOutPress = this.handleSignOutPress.bind(this);
    this.handleProceedSignOutPress = this.handleProceedSignOutPress.bind(this);
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
