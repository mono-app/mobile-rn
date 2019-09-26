import React from "react";
import { 
  Text, View, StyleSheet, TouchableOpacity
} from "react-native";
import { StackActions, NavigationEvents, NavigationActions } from "react-navigation";
import { 
  Portal, Dialog, Paragraph, Button as MaterialButton, Snackbar 
} from "react-native-paper";
import firebase from "react-native-firebase";
import moment from "moment"
import VerifyPhoneAPI from "src/api/verifyphone"
import TextInput from "../../components/TextInput";
import Button from "../../components/Button";
import { withCurrentUser } from "src/api/people/CurrentUser";

const INITIAL_STATE = { 
  isAskingOTP: false,
  isInsertingOTP: false,
  showDialog: false,
  otp: "", 
  phoneNumber: "",
  otpRequestId: "",
  showSnackbarFailVerification: false,
  isVerificationLoading: false
}

class VerifyPhoneScreen extends React.Component{
  static navigationOptions = { header: null }
  
  handleBackToSignIn = () => this.props.navigation.dispatch(StackActions.pop({n: 2}));
  handlePhoneNumberChange = phoneNumber => this.setState({phoneNumber});
  handleOTPChange = otp => {this.setState({otp, isInsertingOTP: true});}
  handleAskOTP = async () => {
    //const response = await VerifyPhoneAPI.sendCode(this.state.phoneNumber)
    const response = "fds"

    if(response){
      const otpRequestId = response
      VerifyPhoneAPI.currentNexmoRequestId = otpRequestId
      this.setState({isAskingOTP: true, otpRequestId})
    }
  }
  handleDismissDialog = () => this.setState({showDialog: false});
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
      console.log("===================")
      console.log(email)
      console.log(password)
      const db = firebase.firestore();
      db.collection("users").doc(email).update({
        phoneNumber: { value: this.state.phoneNumber, isVerified: true }
      }).then(() => this.setState({ showDialog: true }))
    }else{
      this.setState({showSnackbarFailVerification:true})
    }
    this.setState({isVerificationLoading: false})
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
      if(props.currentUser.phoneNumber !== undefined && props.currentUser.isCompleteSetup !== undefined){

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
  }

  // componentDidMount(){
  // }

  // componentWillUnmount(){ this.authListener() }

  componentDidUpdate(){
    if(this.isAskingOTP && this.txtVerificationCode && !this.isInsertingOTP) this.txtVerificationCode.focus();
  }

  render(){
    return(
      <View style={styles.container}>
        <NavigationEvents
          onDidFocus={this.handleScreenDidFocus}
          onwillBlue={this.handleScreenWillBlur}/>
        <Text style={{ fontWeight: "500", fontSize: 24, marginBottom: 4 }}>Verifikasi Nomor HP-mu</Text>
        <Text style={{ fontSize: 12, marginBottom: 16 }}>Mohon verifikasi nomor HP-mu agar kami lebih mudah dalam menanganin masalah. Kami akan mengirimkan kode verifikasi OTP kepada Anda. Pastikan nomor yang dimasukan adalah aktif. Format: 62xxxxxxxxx</Text>
        <TextInput 
          placeholder="Contoh: 6281215288888"
          textContentType="telephoneNumber"
          keyboardType="number-pad"
          editable={!this.state.isAskingOTP}
          value={this.state.phoneNumber}
          onChangeText={this.handlePhoneNumberChange}/>
        {(this.state.isAskingOTP)?(
          <View>
            <TextInput
              autoFocus={true}
              placeholder="Kode Verifikasi"
              keyboardType="number-pad"
              value={this.state.otp}
              onChangeText={this.handleOTPChange}/>
            <Button onPress={this.handleVerifyClick} isLoading={this.state.isVerificationLoading} text="Verifikasi"/>
          </View>
        ):(<Button onPress={this.handleAskOTP} text="Minta Kode Verifikasi"/>)
        }
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
        <Snackbar
          visible= {this.state.showSnackbarFailVerification}
          onDismiss={() => this.setState({ showSnackbarFailVerification: false })}
          style={{backgroundColor:"red",flex: 1}}
          duration={Snackbar.DURATION_SHORT}>
          Kode Verifikasi Salah
        </Snackbar>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    paddingLeft: 32,
    paddingRight: 32,
    flex: 1,
    alignItems: "stretch",
    justifyContent: "center"
  },
  backToSignInContainer: {
    position: "absolute",
    bottom: 32,
    left: 0,
    right: 0
  }
})

export default withCurrentUser(VerifyPhoneScreen);