import React from "react";
import QRCodeScanner from 'react-native-qrcode-scanner';
import { StackActions } from "react-navigation";
import { View } from "react-native";
import { Button } from "react-native-paper";
import FriendsAPI from "src/api/friends"
import AppHeader from "src/components/AppHeader";
import { withCurrentUser } from "src/api/people/CurrentUser";
import { withTranslation } from 'react-i18next';

class ScanQRCodeSCreen extends React.PureComponent{
  static navigationOptions = () => { 
    return {
      header: null
    };
  }

  handleViewMyQRCodePress = () => this.props.navigation.navigate("MyQR");
  handleQRCodeScannerRead = async e => {
    const peopleEmail = e.data;
    try{
      if(peopleEmail!==this.props.currentUser.email){
        await new FriendsAPI().setFriends(this.props.currentUser.email, peopleEmail, { id: "QRCode", value: "QR Code" });
        this.props.navigation.dispatch(StackActions.replace({ routeName: "PeopleInformation", params: {
          peopleEmail, source: { id: "QRCode", value: "QR Code" }
        }}))
      }
    }catch{

    }
  }

  constructor(props){
    super(props);

    this.handleViewMyQRCodePress = this.handleViewMyQRCodePress.bind(this);
    this.handleQRCodeScannerRead = this.handleQRCodeScannerRead.bind(this);
  }
  
  render(){
    return(
      <View style={{ flex: 1 }}>
        <AppHeader navigation={this.props.navigation} style={{ backgroundColor: "transparent" }}/>
        <QRCodeScanner
          onRead={this.handleQRCodeScannerRead}
          style={{ backgroundColor: "#EF6F6C" }}
          showMarker={true}
          checkAndroid6Permissions={true}/>
        <View style={{ padding: 16 }}>
          <Button onPress={this.handleViewMyQRCodePress}>{this.props.t("seeMyQrCode")}</Button>
        </View>
      </View>
    )
  }
}

export default withTranslation()(withCurrentUser(ScanQRCodeSCreen))