import React from "react";
import { View, StyleSheet } from "react-native";
import { Text, } from "react-native-paper";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { default as MaterialCommunityIcons } from "react-native-vector-icons/MaterialCommunityIcons";
import { default as EvilIcons } from "react-native-vector-icons/EvilIcons";

import MonoIDSearch from "./MonoIDSearch";

export default class AddContactScreen extends React.Component{
  static navigationOptions = {
    headerTitle: "Add Contact",
    headerStyle: { backgroundColor: "#E8EEE8", elevation: 0 }
  };

  render(){
    return (
      <KeyboardAwareScrollView style={styles.container}>
        <MonoIDSearch {...this.props}/>
        <View style={{ marginBottom: 16, flex: 1, alignItems: "center" }}>
          <Text style={{ color: "#5E8864" }}>Mono ID: franziz</Text>
        </View>
        <View>
          <View style={styles.menuContainer}>
            <MaterialCommunityIcons name="qrcode-scan" size={36} style={{ marginRight: 16 }}/>
            <View style={{ display: "flex", flex: 1, flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
              <View style={{ display: "flex", flexDirection: "column" }}>
                <Text style={{ fontWeight: "500", fontSize: 16 }}>Scan</Text>
                <Text>Menambahkan teman dengan QR code</Text>
              </View>
              <EvilIcons name="chevron-right" size={24} style={{ color: "#5E8864" }}/>
            </View>
          </View>
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