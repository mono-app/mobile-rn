import React from "react";
import uuid from "uuid/v4";
import { View, Image, FlatList, StyleSheet } from "react-native";
import { Text, Portal, Dialog, Paragraph, ActivityIndicator } from "react-native-paper";
import { NavigationEvents } from "react-navigation";
import { default as FontAwesome } from "react-native-vector-icons/FontAwesome";
import { default as MaterialIcons } from "react-native-vector-icons/MaterialIcons";

import PeopleAPI from "src/api/people";
import StorageAPI from "src/api/storage";

import MenuListItemWithIcon from "src/components/MenuListItemWithIcon";
import BirthdaySetupBanner from "src/screens/SettingsScreen/banners/BirthdaySetupBanner";
import { ScrollView, TouchableOpacity } from "react-native-gesture-handler";
import { default as EvilIcons } from "react-native-vector-icons/EvilIcons";

const INITIAL_STATE = { 
  isLoading: false, nickName: "", status: "Tulis statusmu disini...", profilePicture: "https://picsum.photos/200/200/?random" 
}

export default class SettingsScreen extends React.Component {
  static navigationOptions = { title: "Settings" }

  handleStatusPress = () => this.props.navigation.navigate("StatusChange");
  handleScreenWillFocus = () => {
    const peopleAPI = new PeopleAPI();
    peopleAPI.getCurrentUserEmail().then(currentUserEmail => {
      const promises = [ peopleAPI.getDetail(), peopleAPI.getLatestStatus() ]
      return Promise.all(promises);
    }).then(results => {
      const userData = results[0];
      const status = results[1]? results[1]: {content: "Tulis statusmu disini..."}
      const profilePicture = userData.applicationInformation.profilePicture? userData.applicationInformation.profilePicture: "https://picsum.photos/200/200/?random" ;
      this.setState({ nickName: userData.applicationInformation.nickName, status: status.content, profilePicture });
    }).catch(err => console.error(err));
  }

  handleProfilePicturePress = () => {
    this.props.navigation.navigate("Gallery", {
      multiple: false,
      onComplete: this.handleProfilePictureSave
    });
  }

  handleProfilePictureSave = selectedImage => {
    this.setState({ isLoading: true });
    const imagePath = selectedImage.image.uri;
    const storagePath = `/main/profilePicture/${uuid()}.png`;
    const peopleAPI = new PeopleAPI();

    let downloadUrl = null;
    StorageAPI.uploadFile(storagePath, imagePath).then(url => {
      downloadUrl = url;
      return peopleAPI.getCurrentUserEmail();
    }).then(currentUserEmail => {
      return peopleAPI.changeProfilePicture(null, storagePath);
    }).then(() => {
      this.setState({ isLoading: false, profilePicture: downloadUrl });
    });
  }

  constructor(props){
    super(props);

    this.state = INITIAL_STATE;
    this.handleScreenWillFocus = this.handleScreenWillFocus.bind(this);
    this.handleStatusPress = this.handleStatusPress.bind(this);
    this.handleProfilePicturePress = this.handleProfilePicturePress.bind(this);
    this.handleProfilePictureSave = this.handleProfilePictureSave.bind(this);
  }
  
  render(){
    return (
      <View style={{ flex: 1 }}>
        <NavigationEvents onWillFocus={this.handleScreenWillFocus}/>

        <BirthdaySetupBanner {...this.props}/>

        <Portal>
          <Dialog
            visible={this.state.isLoading}>
            <Dialog.Content>
              <View style={{ flexDirection: "row", justifyContent: "space-evenly"}}>
                <ActivityIndicator/>
                <Paragraph>Harap Tunggu Sebentar...</Paragraph> 
              </View>
            </Dialog.Content>
          </Dialog>
        </Portal>
        
        <ScrollView>
          <View style={styles.profileContainer}>
            <TouchableOpacity onPress={this.handleProfilePicturePress}>
              <Image style={styles.profilePicture} source={{uri: this.state.profilePicture}}/>
            </TouchableOpacity>
            <View style={styles.profileDescriptionContainer}>
              <Text style={{ fontSize: 16, fontWeight: "500", marginBottom: 4}}>{this.state.nickName}</Text>
              <TouchableOpacity style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }} onPress={this.handleStatusPress}>
                <Text style={{ fontSize: 12, marginRight: 16 }}>{this.state.status}</Text>
                <EvilIcons name="chevron-right" size={24} style={{ color: "#5E8864" }}/>
              </TouchableOpacity>
            </View>
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
                    key={index}
                    onPress={() => this.props.navigation.navigate(item.navigateTo)}
                    icon={item.icon}
                    title={item.title}/>
              )}}/>
            </View>
          </ScrollView>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  profileContainer: {
    backgroundColor: "white",
    flexDirection: "row",
    padding: 16,
    paddingTop: 32,
    paddingBottom: 32,
    borderBottomWidth: 1,
    borderBottomColor: "#E8EEE8"
  },
  profilePicture: {
    width: 70, 
    height: 70,
    borderRadius: 8,
    marginRight: 16
  },
  profileDescriptionContainer: {
    width: 0,
    flexGrow: 1,
  },
  listItemContainer: {
    borderBottomWidth: 1,
    borderBottomColor: "#E8EEE8",
    backgroundColor: "white",
    flexDirection: "row",
    padding: 16,
    alignItems: "center"
  },
  listDescriptionContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between"
  }
})