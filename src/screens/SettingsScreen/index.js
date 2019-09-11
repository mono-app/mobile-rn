import React from "react";
import Logger from "src/api/logger";
import StatusAPI from "src/api/status";
import { withCurrentUser } from "src/api/people/CurrentUser";

import MenuListItemWithIcon from "src/components/MenuListItemWithIcon";
import AppHeader from "src/components/AppHeader";
import HeadlineTitle from "src/components/HeadlineTitle";
import PeopleProfileHeader from "src/components/PeopleProfile/Header";
import { ScrollView } from "react-native-gesture-handler";
import { View, FlatList, StyleSheet } from "react-native";
import { default as FontAwesome } from "react-native-vector-icons/FontAwesome";
import { default as MaterialIcons } from "react-native-vector-icons/MaterialIcons";
import { default as EvilIcons } from "react-native-vector-icons/EvilIcons";

function SettingsScreen(props){
  const [ status, setStatus ] = React.useState("");
  const { currentUser, isLoggedIn } = props;
  const styles = StyleSheet.create({
    profileContainer: {
      backgroundColor: "white", flexDirection: "row", display: "flex",
      padding: 16, paddingTop: 32, paddingBottom: 32, alignItems: "center",
      borderBottomWidth: 1, borderBottomColor: "#E8EEE8"
    }
  });

  const handleStatusPress = () => props.navigation.navigate("StatusChange");

  React.useEffect(() => {
    const fetchData = async () => {
      Logger.log("SettingsScreen", "get latest status");
      const { content } = await StatusAPI.getLatestStatus(currentUser.email);
      setStatus(content);
    }
    fetchData();
  }, [currentUser.statistic.totalStatus])

  if(!isLoggedIn) return null;
  return (
    <View style={{ flex: 1 }}>
      <AppHeader style={{ backgroundColor: "transparent", elevation: 0 }}/>
      <HeadlineTitle style={{ marginLeft: 16, marginRight: 16 }}>Settings</HeadlineTitle>
      <ScrollView>
        <View style={styles.profileContainer}>
          <PeopleProfileHeader
            style={{ flex: 1 }}
            onStatusPress={handleStatusPress}
            profilePicture={currentUser.profilePicture}
            title={currentUser.applicationInformation.nickName}
            subtitle={status}/>
          <EvilIcons name="chevron-right" size={24} style={{ color: "#5E8864" }}/>
        </View>
        <View>
          <FlatList
            data={[
              {title: "Show my QR Code", icon: <FontAwesome name="qrcode" size={24}/>, navigateTo: "MyQR"},
              {title: "Account", icon: <MaterialIcons name="vpn-key" size={24}/>, navigateTo: "Account"},
              {title: "Chats", icon: <MaterialIcons name="chat" size={24}/>, navigateTo: "Chats"},
              {title: "Privacy", icon: <MaterialIcons name="lock" size={24}/>, navigateTo: "Privacy"},
              {title: "Help", icon: <FontAwesome name="question-circle" size={24}/>, navigateTo: "Help"}
            ]}
            renderItem={({ item, index }) => {
              return (
                <MenuListItemWithIcon
                  key={index} item={item} onPress={() => props.navigation.navigate(item.navigateTo)} />
            )}}/>
          </View>
        </ScrollView>
    </View>
  )
}
SettingsScreen.navigationOptions = { header: null }
export default withCurrentUser(SettingsScreen);