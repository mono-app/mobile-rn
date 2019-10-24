import React from "react";
import StatusAPI from "src/api/status";
import { withCurrentUser } from "src/api/people/CurrentUser";
import { Text, Card, withTheme } from "react-native-paper";
import { withNavigation } from "react-navigation";
import { default as MaterialCommunityIcons } from "react-native-vector-icons/MaterialCommunityIcons";
import { default as EvilIcons } from "react-native-vector-icons/EvilIcons";
import QRCode from "react-native-qrcode-svg"
import AppHeader from "src/components/AppHeader";
import UserProfileHeader from "src/components/UserProfileHeader";
import { View, StyleSheet, TouchableOpacity } from "react-native";
import { withTranslation } from 'react-i18next';

function MyQRScreen(props){
  const [ status, setStatus ] = React.useState("");
  const { currentUser, navigation } = props;
  const styles = StyleSheet.create({
    container: { flex: 1, padding: 32, backgroundColor: "#E8EEE8" },
    smallDescription: { fontSize: 12, textAlign: "center", color: "#5E8864" },
    menuContainer: {
      backgroundColor: "white", padding: 16, paddingTop: 8, paddingBottom: 8,
      display: "flex", flexDirection: "row", alignItems: "center"
    }
  })
  const handleScanQRCodePress = () => props.navigation.navigate("ScanQRCode")

  React.useEffect(() => {
    const fetchData = async () => {
      const { content } = await StatusAPI.getLatestStatus(currentUser.email);
      setStatus(content);
    }
    fetchData();
  }, [])

  return(
    <View style={{ display: "flex", flexDirection: "column", flexGrow: 1 }}>
      <AppHeader navigation={navigation} style={{ backgroundColor: "#E8EEE8" }}/>
      <View style={styles.container}>
        <Card>
          <Card.Content>
            <View style={{ paddingBottom: 16, borderBottomColor: "#E8EEE8", borderBottomWidth: 1 }}>
              <UserProfileHeader 
                style={{ paddingHorizontal: 16 }}
                profilePicture={currentUser.profilePicture} 
                title={currentUser.applicationInformation.nickName}
                subtitle={status}/>
            </View>
            <View style={{ flexDirection: "row", marginBottom: 32, marginTop: 32, justifyContent: "center" }}>
              <QRCode size={200} value={currentUser.email}/>
            </View>
            <Text style={styles.smallDescription}>{props.t("scanQrDesc")}</Text>
          </Card.Content>
        </Card>

        <View>
          <TouchableOpacity style={styles.menuContainer} onPress={handleScanQRCodePress}>
            <MaterialCommunityIcons name="qrcode-scan" size={36} style={{ marginRight: 16 }}/>
            <View style={{ display: "flex", flex: 1, flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
              <View style={{ display: "flex", flexDirection: "column" }}>
                <Text style={{ fontWeight: "500", fontSize: 16 }}>Scan</Text>
                <Text>{props.t("addFriendQrLabel")}</Text>
              </View>
              <EvilIcons name="chevron-right" size={24} style={{ color: "#5E8864" }}/>
            </View>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  )
}

MyQRScreen.navigationOptions = { header: null }
export default withTranslation()(withNavigation(withCurrentUser(withTheme(MyQRScreen))))