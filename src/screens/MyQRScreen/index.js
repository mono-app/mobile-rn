import React from "react";
import { withCurrentUser } from "src/api/people/CurrentUser";
import { withTheme } from "react-native-paper";
import { withNavigation } from "react-navigation";
import { useStatus } from "src/api/people";

import QRCode from "react-native-qrcode-svg"
import AppHeader from "src/components/AppHeader";
import PeopleProfileHeader from "src/components/PeopleProfile/Header";
import { View, StyleSheet } from "react-native";
import { Text, Card } from "react-native-paper";

function MyQRScreen(props){
  const { currentUser, navigation } = props;
  const status = useStatus(currentUser.email);
  const styles = StyleSheet.create({
    container: { flex: 1, padding: 32, backgroundColor: "#E8EEE8" },
    smallDescription: { fontSize: 12, textAlign: "center", color: "#5E8864" }
  })

  return(
    <View style={{ display: "flex", flexDirection: "column", flexGrow: 1 }}>
      <AppHeader navigation={navigation} style={{ backgroundColor: "#E8EEE8" }}/>
      <View style={styles.container}>
        <Card>
          <Card.Content>
            <View style={{ paddingBottom: 16, borderBottomColor: "#E8EEE8", borderBottomWidth: 1 }}>
              <PeopleProfileHeader 
                style={{ paddingHorizontal: 16 }}
                profilePicture={currentUser.profilePicture} 
                title={currentUser.applicationInformation.nickName}
                subtitle={status.content}/>
            </View>
            <View style={{ flexDirection: "row", marginBottom: 32, marginTop: 32, justifyContent: "center" }}>
              <QRCode size={200} value={currentUser.email}/>
            </View>
            <Text style={styles.smallDescription}>Scan QR Code diatas ini untuk menambahkan aku dalam daftar pertemanan-mu</Text>
          </Card.Content>
        </Card>
      </View>
    </View>
  )
}

export default 
withNavigation(
  withCurrentUser(
    withTheme(MyQRScreen)
  )
);