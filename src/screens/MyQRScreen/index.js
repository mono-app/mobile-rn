import React from "react";
import QRCode from "react-native-qrcode-svg"
import Spinners from "react-native-spinkit";
import { View, StyleSheet } from "react-native";
import { Text, Card, ActivityIndicator, withTheme } from "react-native-paper";

import CurrentUserAPI from "src/api/people/CurrentUser";
import PeopleAPI from "src/api/people";

import AppHeader from "src/components/AppHeader";
import SquareAvatar from "src/components/Avatar/Square";

const INITIAL_STATE = { 
  isLoading: true, userId: "", nickName: "", profilePicture: null,
  isLoadingStatus: true, status: null
}

class MyQRScreen extends React.Component{
  static navigationOptions = ({ navigation }) => { return {
    header: <AppHeader title="QR Code Saya" navigation={navigation} style={{ backgroundColor: "transparent" }}/>
  }}

  loadPeopleInformation = () => {
    this.setState({ isLoading: true });

    const promises = [ CurrentUserAPI.getCurrentUserEmail(), CurrentUserAPI.getApplicationInformation() ]
    Promise.all(promises).then(results => {
      const userEmail = results[0];
      const applicationInformation =  results[1];
      this.setState({ 
        isLoading: false, email: userEmail, nickName: applicationInformation.nickName,
        profilePicture: applicationInformation.profilePicture
      });
    })
  }

  loadStatus = () => {
    this.setState({ isLoadingStatus: true });
    CurrentUserAPI.getCurrentUserEmail().then(currentUserEmail => {
      return new PeopleAPI().getLatestStatus(currentUserEmail);
    }).then(status => {
      this.setState({ isLoadingStatus: false, status });
    })
  }

  constructor(props){
    super(props);

    this.state = INITIAL_STATE;
    this.loadPeopleInformation = this.loadPeopleInformation.bind(this);
    this.loadStatus = this.loadStatus.bind(this);
  }

  componentDidMount(){
    this.loadPeopleInformation();
    this.loadStatus();
  }

  render(){
    const { colors } = this.props.theme;
    return(
      <View style={styles.container}>
        <Card>
          <Card.Content>
            <View style={styles.profileContainer}>
              <SquareAvatar size={70} uri={this.state.profilePicture} style={{ marginRight: 16 }} />
              <View style={styles.profileDescriptionContainer}>
                <Text style={{ fontSize: 16, fontWeight: "500", marginBottom: 4}}>{this.state.nickName}</Text>
                {this.state.isLoadingStatus?(
                  <Spinners type="ThreeBounce" color={colors.primary}/>
                ):(
                  <Text style={{ fontSize: 12}}>{this.state.status.content}</Text>
                )}
              </View>
            </View>
            <View style={{ flexDirection: "row", marginBottom: 32, marginTop: 32, justifyContent: "center" }}>
              {this.state.isLoading
              ?<ActivityIndicator size="large" color="#0EAD69"/>
              :<QRCode size={200} value={this.state.email}/>}
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
  profileDescriptionContainer: { width: 0, flexGrow: 1 },
  smallDescription: { fontSize: 12, textAlign: "center", color: "#5E8864" }
})

export default withTheme(MyQRScreen);