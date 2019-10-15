import React from "react";
import { StyleSheet } from "react-native";
import { withCurrentUser } from "src/api/people/CurrentUser";

import AppHeader from "src/components/AppHeader";
import MonoIDSearch from "src/screens/AddContactScreen/MonoIDSearch";
import { Text } from "react-native-paper";
import { View, TouchableOpacity } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { default as MaterialCommunityIcons } from "react-native-vector-icons/MaterialCommunityIcons";
import { default as EvilIcons } from "react-native-vector-icons/EvilIcons";

function AddContactScreen(props){
  const { currentUser } = props;
  const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: "#E8EEE8" },
    menuContainer: {
      backgroundColor: "white", padding: 16, paddingTop: 8, paddingBottom: 8,
      display: "flex", flexDirection: "row", alignItems: "center"
    }
  })

  const handleScanQRCodePress = () => props.navigation.navigate("ScanQRCode")

  return (
    <KeyboardAwareScrollView style={styles.container}>
      <AppHeader navigation={props.navigation} style={{ backgroundColor: "#E8EEE8" }}/>
      <MonoIDSearch currentUser={currentUser}/>
      <View style={{ marginBottom: 16, flex: 1, alignItems: "center" }}>
        <Text style={{ color: "#5E8864" }}>Mono ID: {currentUser.applicationInformation.id}</Text>
      </View>
      <View>
        <TouchableOpacity style={styles.menuContainer} onPress={handleScanQRCodePress}>
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
AddContactScreen.navigationOptions = { header: null }
export default withCurrentUser(AddContactScreen);