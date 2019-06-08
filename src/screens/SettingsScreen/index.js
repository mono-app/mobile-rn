import React from "react";
import { View, FlatList, StyleSheet } from "react-native";
import { Text, Portal, Dialog, Paragraph, ActivityIndicator } from "react-native-paper";
import { default as FontAwesome } from "react-native-vector-icons/FontAwesome";
import { default as MaterialIcons } from "react-native-vector-icons/MaterialIcons";

import CurrentUserAPI from "src/api/people/CurrentUser";
import PeopleAPI from "src/api/people";

import MenuListItemWithIcon from "src/components/MenuListItemWithIcon";
import BirthdaySetupBanner from "src/screens/SettingsScreen/banners/BirthdaySetupBanner";
import SquareAvatar from "src/components/Avatar/Square";
import { ScrollView, TouchableOpacity } from "react-native-gesture-handler";
import { default as EvilIcons } from "react-native-vector-icons/EvilIcons";

const INITIAL_STATE = { 
  isLoading: false, nickName: "", status: "Tulis statusmu disini...", profilePicture: "https://picsum.photos/200/200/?random" 
}

export default class SettingsScreen extends React.Component {
  static navigationOptions = { title: "Settings" }

  loadProfileInformation = async () => {
    const applicationInformation = await CurrentUserAPI.getApplicationInformation();
    const profilePicture = applicationInformation.profilePicture? applicationInformation.profilePicture: "https://picsum.photos/200/200/?random";
    this.setState({ nickName: applicationInformation.nickName, profilePicture });
  }

  loadStatus = () => {
    CurrentUserAPI.getCurrentUserEmail().then(currentUserEmail => {
      return new PeopleAPI().getLatestStatus(currentUserEmail);
    }).then(status => {
      if(!status) status = { content: "Tulis statusmu disini..." };
      this.setState({ status: status.content });
    })
  }

  handleStatusPress = () => this.props.navigation.navigate("StatusChange");
  handleProfilePicturePress = () => {
    this.props.navigation.navigate("Gallery", {
      multiple: false,
      onComplete: this.handleProfilePictureSave
    });
  }

  handleProfilePictureSave = selectedImage => {
    this.setState({ isLoading: true });
    const peopleAPI = new PeopleAPI();
    peopleAPI.getCurrentUserEmail().then(currentUserEmail => {
      const imagePath = selectedImage.image.uri;
      return peopleAPI.changeProfilePicture(null, imagePath);
    }).then(profilePictureUrl => {
      console.log(profilePictureUrl);
      this.setState({ isLoading: false, profilePicture: profilePictureUrl })
    })
  }

  constructor(props){
    super(props);

    this.state = INITIAL_STATE;
    this.dataChangedTrigger = null;
    this.loadProfileInformation = this.loadProfileInformation.bind(this);
    this.handleStatusPress = this.handleStatusPress.bind(this);
    this.handleProfilePicturePress = this.handleProfilePicturePress.bind(this);
    this.handleProfilePictureSave = this.handleProfilePictureSave.bind(this);
  }

  componentDidMount(){
    this.dataChangedTrigger = CurrentUserAPI.addDataChangedTrigger(this.loadProfileInformation);
    this.loadProfileInformation(); 
    this.loadStatus();
  }

  componentWillUnmount(){
    if(this.dataChangedTrigger){
      CurrentUserAPI.removeDataChangedTrigger(this.dataChangedTrigger);
    }
  }
  
  render(){
    return (
      <View style={{ flex: 1 }}>
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
              <SquareAvatar size={70} style={{ marginRight: 16 }} uri={this.state.profilePicture}/>
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