import React from "react";
import { View, Image, StyleSheet } from "react-native";
import { Text, Card, ActivityIndicator } from "react-native-paper";
import { NavigationEvents } from "react-navigation";
import QRCode from "react-native-qrcode-svg"
import SInfo from "react-native-sensitive-info";

import { GetDocument } from "../../api/database/query";
import { UserCollection } from "../../api/database/collection";
import { Document } from "../../api/database/document";

const INITIAL_STATE = { isLoading: true, userId: "", nickName: "" }

export default class MyQRScreen extends React.Component{
  static navigationOptions = { headerTitle: "My QR Code" }

  handleScreenWillFocus = () => {
    this.setState({isLoading: true});

    SInfo.getItem("currentUserEmail", {}).then(currentUserEmail => {
      const userCollection = new UserCollection();
      const userDocument = new Document(currentUserEmail);
      const getDocumentQuery = new GetDocument();
      getDocumentQuery.setGetConfiguration("default");
      return getDocumentQuery.executeQuery(userCollection, userDocument);
    }).then(doc => {
      if(doc.exists){
        const userData = doc.data();
        const userId = doc.id;
        const nickName = userData.applicationInformation.nickName;
        this.setState({ isLoading: false, userId, nickName })
      }
    }).catch(err => console.error(err));
  }

  constructor(props){
    super(props);

    this.state = INITIAL_STATE;
  }

  render(){
    return(
      <View style={styles.container}>
        <NavigationEvents onWillFocus={this.handleScreenWillFocus}/>
        <Card>
          <Card.Content>
            <View style={styles.profileContainer}>
              <Image style={styles.profilePicture} source={{uri: "https://picsum.photos/200/200/?random"}}/>
              <View style={styles.profileDescriptionContainer}>
                <Text style={{ fontSize: 16, fontWeight: "500", marginBottom: 4}}>{this.state.nickName}</Text>
                <Text style={{ fontSize: 12}}>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</Text>
              </View>
            </View>
            <View style={{ flexDirection: "row", marginBottom: 32, marginTop: 32, justifyContent: "center" }}>
              {this.state.isLoading
              ?<ActivityIndicator size="large" color="#0EAD69"/>
              :<QRCode size={200} value={this.state.userId}/>}
            </View>
            <Text style={styles.smallDescription}>Scan QR Code diatas ini untuk menambahkan aku dalam daftar pertemanan-mu</Text>
          </Card.Content>
        </Card>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 32, backgroundColor: "#E8EEE8" },
  profileContainer: {
    backgroundColor: "white",
    flexDirection: "row",
    alignItems: "center",
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#E8EEE8"
  },
  profilePicture: {
    width: 70, 
    height: 70,
    borderRadius: 8,
    marginRight: 16
  },
  profileDescriptionContainer: { width: 0, flexGrow: 1 },
  smallDescription: { fontSize: 12, textAlign: "center", color: "#5E8864" }
})