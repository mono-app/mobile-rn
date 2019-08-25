import React from "react";
import { withCurrentUser, useCurrentUser } from "src/api/people/CurrentUser";
import { useStatus } from "src/api/people";

import MenuListItemWithIcon from "src/components/MenuListItemWithIcon";
import SquareAvatar from "src/components/Avatar/Square";
import AppHeader from "src/components/AppHeader";
import HeadlineTitle from "src/components/HeadlineTitle";
import PeopleProfileHeader from "src/components/PeopleProfile/Header";
import { ScrollView, TouchableOpacity } from "react-native-gesture-handler";
import { View, FlatList, StyleSheet } from "react-native";
import { Text } from "react-native-paper";
import { default as FontAwesome } from "react-native-vector-icons/FontAwesome";
import { default as MaterialIcons } from "react-native-vector-icons/MaterialIcons";
import { default as EvilIcons } from "react-native-vector-icons/EvilIcons";

function SettingsScreen(props){
  const { currentUser, isLoggedIn } = useCurrentUser();
  const status = useStatus(currentUser.email);
  const styles = StyleSheet.create({
    profilePicture: { width: 70,  height: 70, borderRadius: 8, marginRight: 16 },
    listDescriptionContainer: { flex: 1, flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
    profileDescriptionContainer: { width: 0, flexGrow: 1 },
    profileContainer: {
      display: "flex", flexDirection: "row", alignItems: "center", padding: 16,
      paddingTop: 32, paddingBottom: 32, borderBottomWidth: 1, borderBottomColor: "#E8EEE8"
    },
    listItemContainer: {
      borderBottomWidth: 1, borderBottomColor: "#E8EEE8", backgroundColor: "white",
      flexDirection: "row", padding: 16, alignItems: "center"
    },
  });
 
  if(!isLoggedIn) return null;
  return (
    <View style={{ flex: 1 }}>
      <AppHeader/>
      <HeadlineTitle style={{ marginLeft: 16, marginRight: 16 }}>Settings</HeadlineTitle>
      <ScrollView>
        <TouchableOpacity style={styles.profileContainer}>
          <PeopleProfileHeader 
            style={{ flex: 1, borderBottomWidth: 0 }}
            profilePicture={currentUser.profilePicture}
            title={currentUser.applicationInformation.nickName}
            subtitle={status.content}/>
          <EvilIcons name="chevron-right" size={24} style={{ color: "#5E8864" }}/>
        </TouchableOpacity>
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
                  key={index} icon={item.icon} title={item.title}
                  onPress={() => props.navigation.navigate(item.navigateTo)} />
            )}}/>
          </View>
        </ScrollView>
    </View>
  )
}

export default SettingsScreen;