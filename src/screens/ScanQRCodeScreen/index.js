import React from "react";
import QRCodeScanner from 'react-native-qrcode-scanner';
import { StackActions } from "react-navigation";
import { View } from "react-native";
import { Button } from "react-native-paper";

import AppHeader from "src/components/AppHeader";

export default class ScanQRCodeSCreen extends React.PureComponent{
  static navigationOptions = ({ navigation }) => { return {
    header: <AppHeader navigation={navigation} style={{ backgroundColor: "transparent" }}/>
  }}

  handleViewMyQRCodePress = () => this.props.navigation.navigate("MyQR");
  handleQRCodeScannerRead = e => {
    const peopleEmail = e.data;
    this.props.navigation.dispatch(StackActions.replace({ routeName: "PeopleInformation", params: {
      peopleEmail, source: { id: "QRCode", value: "QR Code" }
    }}))
  }

  constructor(props){
    super(props);

    this.handleViewMyQRCodePress = this.handleViewMyQRCodePress.bind(this);
    this.handleQRCodeScannerRead = this.handleQRCodeScannerRead.bind(this);
  }
  
  render(){
    return(
      <View style={{ flex: 1 }}>
        <QRCodeScanner
          onRead={this.handleQRCodeScannerRead}
          style={{ backgroundColor: "red" }}
          showMarker={true}
          checkAndroid6Permissions={true}/>
        <View style={{ padding: 16 }}>
          <Button onPress={this.handleViewMyQRCodePress}>Lihat QR Code Saya</Button>
        </View>
      </View>
    )
  }
}