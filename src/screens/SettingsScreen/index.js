import React from "react";
import Logger from "src/api/logger";
import StatusAPI from "src/api/status";
import StorageAPI from "src/api/storage";
import PeopleAPI from "src/api/people";
import { withTutorial } from "src/api/Tutorial";
import ImageCompress from "src/api/ImageCompress"
import { withCurrentUser } from "src/api/people/CurrentUser";
import MenuListItemWithIcon from "src/components/MenuListItemWithIcon";
import AppHeader from "src/components/AppHeader";
import HeadlineTitle from "src/components/HeadlineTitle";
import PeopleProfileHeader from "src/components/PeopleProfile/Header";
import { ScrollView } from "react-native-gesture-handler";
import { ActivityIndicator, View, FlatList, StyleSheet } from "react-native";
import { default as FontAwesome } from "react-native-vector-icons/FontAwesome";
import { default as MaterialIcons } from "react-native-vector-icons/MaterialIcons";
import { default as EvilIcons } from "react-native-vector-icons/EvilIcons";
import { withTranslation } from 'react-i18next';

function SettingsScreen(props){
  const [ status, setStatus ] = React.useState("");
  const [ isUploadingImage, setUploadingImage ] = React.useState(false);
  
  const { currentUser, isLoggedIn } = props;
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
      if(isUploadingImage){
        return
      }
      const result = await StorageAPI.openGallery(false);
      setUploadingImage(true)
      const compressedRes = await ImageCompress.compress(result.uri, result.size)
      await PeopleAPI.changeProfilePicture(currentUser.id, compressedRes.uri);
      setUploadingImage(false)
    }catch(err){ Logger.log("SettingsScreen.handleProfilePicutrePress#err", err) }
  }

  React.useEffect(() => {
    const fetchData = async () => {
      Logger.log("SettingsScreen", "get latest status");
      const data  = await StatusAPI.getLatestStatus(currentUser.id);
      if(data && data.content) setStatus(data.content);
    }
    fetchData();
    props.settingScreenTutorial.start()
  }, [(currentUser.statistic && currentUser.statistic.totalStatus)?currentUser.statistic.totalStatus:0])

  if(!isLoggedIn) return null;
  return (
    <View style={{ flex: 1 }}>
      <AppHeader style={{ backgroundColor: "transparent", elevation: 0 }}/>
      <HeadlineTitle style={{ marginLeft: 16, marginRight: 16 }}>Settings</HeadlineTitle>
      <ScrollView>
        <View style={styles.profileContainer}>
            <PeopleProfileHeader
              style={{flex:1}}
              onStatusPress={handleStatusPress}
              onProfilePicturePress={handleProfilePicturePress}
              profilePicture={currentUser.profilePicture}
              title={currentUser.applicationInformation.nickName}
              isLoading={isUploadingImage}
              subtitle={status}
              showTutorialChangeProfilePic = {props.showTutorialChangeProfilePic}
              tutorial = {props.settingScreenTutorial}
              />
          <EvilIcons name="chevron-right" size={24} style={{ color: "#5E8864" }}/>
        </View>

        <View>
          <FlatList
            data={[
              {title: props.t("showMyQrCode"), icon: <FontAwesome name="qrcode" size={24}/>, navigateTo: "MyQR"},
              {title: props.t("account"), icon: <MaterialIcons name="vpn-key" size={24}/>, navigateTo: "Account"},
              {title: props.t("chat"), icon: <MaterialIcons name="chat" size={24}/>, navigateTo: "ChatSettings"},
              {title: props.t("privacy"), icon: <MaterialIcons name="lock" size={24}/>, navigateTo: "Privacy"},
              {title: props.t("general"), icon: <MaterialIcons name="settings" size={24}/>, navigateTo: "GeneralSettings"},
              {title: props.t("help"), icon: <FontAwesome name="question-circle" size={24}/>, navigateTo: "Help"}
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
export default withTranslation()(withTutorial(withCurrentUser(SettingsScreen)));