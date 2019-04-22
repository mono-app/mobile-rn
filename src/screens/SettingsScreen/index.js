import React from "react";
import { 
  Text, View, Image, FlatList,
  StyleSheet, TouchableOpacity
} from "react-native";
import { NavigationEvents } from "react-navigation";
import { default as FontAwesome } from "react-native-vector-icons/FontAwesome";
import { default as MaterialIcons } from "react-native-vector-icons/MaterialIcons";
import { default as EvilIcons } from "react-native-vector-icons/EvilIcons";
import SInfo from "react-native-sensitive-info";

import { UserCollection } from "../../api/database/collection";
import { Document } from "../../api/database/document";
import { GetDocument } from "../../api/database/query";

const INITIAL_STATE = { nickName: "" }

export default class SettingsScreen extends React.Component {
  static navigationOptions = { title: "Settings" }

  handleScreenWillFocus = () => {
    SInfo.getItem("currentUserEmail", {}).then(currentUserEmail => {
      const userCollection = new UserCollection();
      const userDocument = new Document(currentUserEmail);
      const getDocumentQuery = new GetDocument();
      getDocumentQuery.setGetConfiguration("default");
      return getDocumentQuery.executeQuery(userCollection, userDocument);
    }).then(doc => {
      if(doc.exists){
        const userData = doc.data();
        this.setState({ nickName: userData.applicationInformation.nickName });
      }
    }).catch(err => console.error(err));
  }

  constructor(props){
    super(props);

    this.state = INITIAL_STATE;
    this.handleScreenWillFocus = this.handleScreenWillFocus.bind(this);
  }
  
  render(){
    return (
      <View style={{ flex: 1 }}>
        <NavigationEvents onWillFocus={this.handleScreenWillFocus}/>
        <View style={styles.profileContainer}>
          <Image style={styles.profilePicture} source={{uri: "https://picsum.photos/200/200/?random"}}/>
          <View style={styles.profileDescriptionContainer}>
            <Text style={{ fontSize: 16, fontWeight: "500", marginBottom: 4}}>{this.state.nickName}</Text>
            <Text style={{ fontSize: 12}}>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</Text>
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
                <TouchableOpacity onPress={() => this.props.navigation.navigate(item.navigateTo)}>
                  <View key={index} style={styles.listItemContainer}>
                    {item.icon}
                    <View style={styles.listDescriptionContainer}>
                      <Text style={{ marginLeft: 16 }}>{item.title}</Text>
                      <EvilIcons name="chevron-right" size={24} style={{ color: "#5E8864" }}/>
                    </View>
                  </View>
                </TouchableOpacity>
            )}}/>
          </View>
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