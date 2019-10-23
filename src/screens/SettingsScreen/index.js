import React from "react";
import firebase from "react-native-firebase";
import Logger from "src/api/logger";
import StorageAPI from "src/api/storage";
import PeopleAPI from "src/api/people";
import OfflineDatabase from "src/api/database/offline";
import ImageCompress from "src/api/ImageCompress"
import { withTutorial } from "src/api/Tutorial";
import { withCurrentUser } from "src/api/people/CurrentUser";
import { Q } from "@nozbe/watermelondb"

import MenuListItemWithIcon from "src/components/MenuListItemWithIcon";
import AppHeader from "src/components/AppHeader";
import HeadlineTitle from "src/components/HeadlineTitle";
import PeopleProfileHeader from "src/components/PeopleProfile/Header";
import { ScrollView, ForceTouchGestureHandler } from "react-native-gesture-handler";
import { View, FlatList, StyleSheet } from "react-native";
import { default as FontAwesome } from "react-native-vector-icons/FontAwesome";
import { default as MaterialIcons } from "react-native-vector-icons/MaterialIcons";
import { default as EvilIcons } from "react-native-vector-icons/EvilIcons";

function SettingsScreen(props){
  const { isLoggedIn } = props;

  const [ status, setStatus ] = React.useState("");
  const [ isUploadingImage, setUploadingImage ] = React.useState(false);
  const [ currentUser, setCurrentUser ] = React.useState(null);
  
  const styles = StyleSheet.create({
    profileContainer: {
      flex:1,backgroundColor: "white", flexDirection: "row", display: "flex",
      paddingHorizontal: 16, paddingVertical: 32, alignItems: "center",
      borderBottomWidth: 1, borderBottomColor: "#E8EEE8"
    }
  });

  const handleStatusPress = () => props.navigation.navigate("StatusChange");
  const handleProfilePicturePress = async () => {
    try{
      if(isUploadingImage) return
      const result = await StorageAPI.openGallery(false);
      
      setUploadingImage(true)
      const compressedRes = await ImageCompress.compress(result.uri, result.size)
      await PeopleAPI.changeProfilePicture(currentUser.me.email, compressedRes.uri);
      setUploadingImage(false)
    }catch(err){ Logger.log("SettingsScreen.handleProfilePicutrePress#err", err) }
  }

  // React.useEffect(() => {
  //   const fetchData = async () => {
  //     Logger.log("SettingsScreen", "get latest status");
  //     const data  = await StatusAPI.getLatestStatus(currentUser.email);
  //     if(data && data.content) setStatus(data.content);
  //   }
  //   fetchData();
  //   props.settingScreenTutorial.start()
  // }, [(currentUser.statistic && currentUser.statistic.totalStatus)?currentUser.statistic.totalStatus:0])

  const fetchUser = async () => {
    const email = firebase.auth().currentUser.email;
    const usersCollection = OfflineDatabase.database.collections.get("users");
    const [ user ] = await usersCollection.query(Q.where("email", email)).fetch();
    const normalizedUser = await PeopleAPI.normalize(user);
    Logger.log("SettingsScreen.fetchUser#normalizedUser", normalizedUser);
    setCurrentUser(normalizedUser);
  }

  React.useEffect(() => {
    OfflineDatabase.synchronize();
    fetchUser();
  }, [])

  if(!isLoggedIn || !currentUser) return null;
  return (
    <View style={{ flex: 1 }}>
      <AppHeader style={{ backgroundColor: "transparent", elevation: 0 }}/>
      <HeadlineTitle style={{ marginLeft: 16, marginRight: 16 }}>Settings</HeadlineTitle>
      <ScrollView>
        <View style={styles.profileContainer}>
            <PeopleProfileHeader
              style={{ flex:1 }} people={currentUser} isLoading={isUploadingImage}
              onStatusPress={handleStatusPress} 
              onProfilePicturePress={handleProfilePicturePress}
              profilePicture={currentUser.profilePicture.downloadUrl}
              showTutorialSettingChangeProfilePic={props.z}
              settingScreenTutorial={props.settingScreenTutorial}/>
          <EvilIcons name="chevron-right" size={24} style={{ color: "#5E8864" }}/>
        </View>

        <View>
          <FlatList
            data={[
              {title: "Show my QR Code", icon: <FontAwesome name="qrcode" size={24}/>, navigateTo: "MyQR"},
              {title: "Account", icon: <MaterialIcons name="vpn-key" size={24}/>, navigateTo: "Account"},
              {title: "Chats", icon: <MaterialIcons name="chat" size={24}/>, navigateTo: "ChatSettings"},
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
export default withTutorial(withCurrentUser(SettingsScreen));