import React from "react";
import firebase from "react-native-firebase";
import moment from "moment";
import libphonenumber from 'libphonenumber-js';
import VerifyPhoneAPI from "src/api/verifyphone"
import { StackActions, NavigationEvents, NavigationActions } from "react-navigation";
import { withCurrentUser } from "src/api/people/CurrentUser";

import TextInput from "src/components/TextInput";
import Button from "src/components/Button";
import { Text, View, StyleSheet, TouchableOpacity } from "react-native";
import { Portal, Dialog, Paragraph, Button as MaterialButton, Snackbar } from "react-native-paper";

const INITIAL_STATE = { 
  isAskingOTP: false,
  isInsertingOTP: false,
  showDialog: false,
  otp: "", 
  phoneNumber: "",
  otpRequestId: "",
  showSnackbarFailVerification: false,
  isVerificationLoading: false,
  showSnackbarPhoneNoInvalid: false
}

class VerifyPhoneScreen extends React.PureComponent{
  static navigationOptions = { header: null }
  
  handleDismissDialog = () => this.setState({showDialog: false});
  handleBackToSignIn = () => this.props.navigation.dispatch(StackActions.pop({n: 2}));
  handlePhoneNumberChange = phoneNumber => this.setState({phoneNumber});
  handleOTPChange = otp => {this.setState({otp, isInsertingOTP: true});}
  handleAskOTP = async () => {
    const phoneNum = this.validatePhoneNumber(this.state.phoneNumber,"ID","62")
    if(!phoneNum){
      this.setState({ showSnackbarPhoneNoInvalid: true })
      return
    }
    //const response = await VerifyPhoneAPI.sendCode(phoneNum)
    const response = "fds"

    if(response){
      const otpRequestId = response
      VerifyPhoneAPI.currentNexmoRequestId = otpRequestId
      this.setState({ isAskingOTP: true, otpRequestId })
    }
  }

  validatePhoneNumber = (phoneNumber0, countryCode, numCode) => {
    // numCode: 62
    // countryCode: ID
    let result = phoneNumber0.toString()
    if(result.length<=2){
      return null
    }

    const phoneNumber1 = libphonenumber.parsePhoneNumberFromString(result, countryCode)
    if(phoneNumber1 && phoneNumber1.isPossible()){
      // check if there is `+` 
      if(result.substring(0,1)==="+") result = result.substr(1);
      if(!result.toLowerCase().match(/^[0-9]+$/)) return null;

      // change 0 to numCode 
      if(result.substring(0,1)==="0"){
        result = result.substr(1);
        result = numCode+""+result;
      }
      // if 2 first letter is not same with numCode, add the numCode at the beginning
      if(result.substring(0,2)!==numCode) result = `${numCode}${result}`;
      const phoneNumber2 = libphonenumber.parsePhoneNumberFromString(`+${result}`, countryCode);
      if(phoneNumber2.isValid()) return result
    }
    return null
  }

  handleVerifyClick = async () => {
    this.setState({isVerificationLoading: true})

    //const response = await VerifyPhoneAPI.checkCode(this.state.otpRequestId,this.state.otp)
    const response = true
    if(response){
      VerifyPhoneAPI.currentNexmoRequestId = null

      const email = this.props.navigation.getParam("email", null);
      const password = this.props.navigation.getParam("password", null);
      try{
        await firebase.auth().createUserWithEmailAndPassword(email, password);
      }catch{
        
      }
      const db = firebase.firestore();
      const userDocumentRef = db.collection("users").doc(email)
      const userSnapshot = await userDocumentRef.get()
      if(userSnapshot.exists){
        userDocumentRef.update({
          phoneNumber: { value: this.state.phoneNumber, isVerified: true }
        }).then(() => this.setState({ showDialog: true, isVerificationLoading: false }))
      }else{
        userDocumentRef.set({
          phoneNumber: { value: this.state.phoneNumber, isVerified: true },
          isCompleteSetup: false
        }).then(() => this.setState({ showDialog: true, isVerificationLoading: false }))
      }
    }else{
      this.setState({showSnackbarFailVerification:true})
    }
  }

  handleContinueClick = () => {
    this.props.navigation.dispatch(
      StackActions.reset({
        index: 0,
        actions: [ NavigationActions.navigate({ routeName: 'Splash' }) ],
      })
    );
  }

  handleScreenWillBlur = () => {
    if(this.authListener) this.authListener();
  }

  handleScreenDidFocus = () => {
    this.authListener = firebase.auth().onAuthStateChanged(user => {
      if(this.props.currentUser.phoneNumber !== undefined && this.props.currentUser.isCompleteSetup !== undefined){

        const db = firebase.firestore();
        if(user && !this.props.currentUser.isCompleteSetup){
          db.collection("users").doc(user.email).set({
            isCompleteSetup: false,
            phoneNumber: { value: this.state.phoneNumber, isVerified: false },
            creationTime: parseInt(moment(user.metadata.creationTime).format("x"))
          })
        }else if(user && this.props.currentUser.isCompleteSetup){
          db.collection("users").doc(user.email).update({
            phoneNumber: { value: this.state.phoneNumber, isVerified: false },
          })
        }
      }

    })
  }


  constructor(props){
    super(props);
    this.state = INITIAL_STATE;
    
    this.authListener = null;
    this.databaseListener = null;
    this.handleBackToSignIn = this.handleBackToSignIn.bind(this);
    this.handlePhoneNumberChange = this.handlePhoneNumberChange.bind(this);
    this.handleOTPChange = this.handleOTPChange.bind(this);
    this.handleAskOTP = this.handleAskOTP.bind(this);
    this.handleContinueClick = this.handleContinueClick.bind(this);
    this.handleScreenDidFocus = this.handleScreenDidFocus.bind(this);
    this.handleScreenWillBlur = this.handleScreenWillBlur.bind(this);
    this.validatePhoneNumber = this.validatePhoneNumber.bind(this);
    
  }

  componentDidUpdate(){
    if(this.isAskingOTP && this.txtVerificationCode && !this.isInsertingOTP) this.txtVerificationCode.focus();
  }

  render(){
    return(
      <View style={{flex: 1}}>
        <View style={styles.container}>
          <NavigationEvents onDidFocus={this.handleScreenDidFocus} onwillBlue={this.handleScreenWillBlur}/>
          <Text style={{ fontWeight: "500", fontSize: 24, marginBottom: 4 }}>Verifikasi Nomor HP-mu</Text>
          <Text style={{ fontSize: 12, marginBottom: 16 }}>Mohon verifikasi nomor HP-mu agar kami lebih mudah dalam menanganin masalah. Kami akan mengirimkan kode verifikasi OTP kepada Anda. Pastikan nomor yang dimasukan adalah aktif. Format: 62xxxxxxxxx</Text>
          <View style={{flexDirection:"row"}}>
          <TextInput style={{ marginRight: 8 }} value="+62" editable={false}/>
          <TextInput 
          style={{flex:1}}
            placeholder="Contoh: 81215288888" textContentType="telephoneNumber" keyboardType="number-pad"
            editable={!this.state.isAskingOTP} value={this.state.phoneNumber}
            onChangeText={this.handlePhoneNumberChange}/>
            </View>
          {(this.state.isAskingOTP)?(
            <View>
              <TextInput
                placeholder="Kode Verifikasi" keyboardType="number-pad"
                value={this.state.otp} onChangeText={this.handleOTPChange} autoFocus/>
              <Button onPress={this.handleVerifyClick} isLoading={this.state.isVerificationLoading} text="Verifikasi"/>
            </View>
          ):(<Button onPress={this.handleAskOTP} text="Minta Kode Verifikasi"/>)}
          <TouchableOpacity style={styles.backToSignInContainer} onPress={this.handleBackToSignIn}>
            <Text style={{ textAlign: "center", color: "#0EAD69", fontWeight: "500" }}>Saya punya akun. Kembali ke Sign In</Text>
          </TouchableOpacity>
          <Portal>
            <Dialog visible={this.state.showDialog}>
              <Dialog.Title>Sukses</Dialog.Title>
              <Dialog.Content>
                <Paragraph>Registrasi Sukses!</Paragraph>
              </Dialog.Content>
              <Dialog.Actions>
                <MaterialButton onPress={this.handleContinueClick}>Lanjutkan</MaterialButton>
              </Dialog.Actions>
            </Dialog>
          </Portal>
        </View>
        <Snackbar
          visible={this.state.showSnackbarFailVerification}
          onDismiss={() => this.setState({ showSnackbarFailVerification: false })}
          style={{ backgroundColor:"red" }} duration={Snackbar.DURATION_SHORT}>
          Kode Verifikasi Salah
        </Snackbar>
      <Snackbar
        visible= {this.state.showSnackbarPhoneNoInvalid}
        onDismiss={() => this.setState({ showSnackbarPhoneNoInvalid: false })}
        style={{ backgroundColor:"red" }} duration={Snackbar.DURATION_SHORT}>
        Nomor Telepon Tidak Valid
      </Snackbar>
     </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    paddingLeft: 32, paddingRight: 32, flex: 1,
    alignItems: "stretch", justifyContent: "center"
  },
  backToSignInContainer: { position: "absolute", bottom: 32, left: 0, right: 0 }
})

export default withCurrentUser(VerifyPhoneScreen);