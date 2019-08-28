import React from "react";
import { View, StyleSheet, TouchableOpacity } from "react-native";
import { Text } from "react-native-paper";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { default as MaterialCommunityIcons } from "react-native-vector-icons/MaterialCommunityIcons";
import { default as EvilIcons } from "react-native-vector-icons/EvilIcons";

import CurrentUserAPI, { useCurrentUser } from "src/api/people/CurrentUser";

import AppHeader from "src/components/AppHeader";
import MonoIDSearch from "./MonoIDSearch";

const INITIAL_STATE = { monoId: null }

export default class AddContactScreen extends React.PureComponent{
  static navigationOptions = ({ navigation }) => {
    return { header: (
      <AppHeader style={{ backgroundColor: "#E8EEE8" }} title="Tambah Kontak" navigation={navigation}/> 
    )}
  }

  loadUserInformation = () => {
    CurrentUserAPI.getApplicationInformation().then(applicationInformation => {
      this.setState({ monoId: applicationInformation.id });
    })
  }

  handleScanQRCodePress = () => { this.props.navigation.navigate("ScanQRCode"); }

  constructor(props){
    super(props);

    this.state = INITIAL_STATE;
    this.loadUserInformation = this.loadUserInformation.bind(this);
    this.handleScanQRCodePress = this.handleScanQRCodePress.bind(this);
  }

  componentDidMount(){ this.loadUserInformation(); }

  render(){
    return (
      <KeyboardAwareScrollView style={styles.container}>
        <MonoIDSearch {...this.props}/>
        <View style={{ marginBottom: 16, flex: 1, alignItems: "center" }}>
          <Text style={{ color: "#5E8864" }}>Mono ID: {this.state.monoId}</Text>
        </View>
        <View>
          <TouchableOpacity style={styles.menuContainer} onPress={this.handleScanQRCodePress}>
            <MaterialCommunityIcons name="qrcode-scan" size={36} style={{ marginRight: 16 }}/>
            <View style={{ display: "flex", flex: 1, flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
              <View style={{ display: "flex", flexDirection: "column" }}>
                <Text style={{ fontWeight: "500", fontSize: 16 }}>Scan</Text>
                <Text>Menambahkan teman dengan QR code</Text>
              </View>
              <EvilIcons name="chevron-right" size={24} style={{ color: "#5E8864" }}/>
            </View>
          </TouchableOpacity>
        </View>
      </KeyboardAwareScrollView>
    )
  }
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#E8EEE8" },
  menuContainer: {
    backgroundColor: "white",
    padding: 16,
    paddingTop: 8,
    paddingBottom: 8,
    display: "flex",
    flexDirection: "row",
    alignItems: "center"
  }
})