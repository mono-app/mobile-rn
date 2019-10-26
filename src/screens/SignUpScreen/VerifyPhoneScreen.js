import React from "react";
import VerifyPhoneAPI from "src/api/verifyphone";
import User from "src/entities/user";
import PhoneNumber from "src/entities/phoneNumber";
import Otp from "src/entities/otp";
import { StackActions, NavigationEvents, NavigationActions } from "react-navigation";
import { withCurrentUser } from "src/api/people/CurrentUser";
import { withTranslation } from 'react-i18next';
import { StyleSheet } from "react-native";

import TextInput from "src/components/TextInput";
import Button from "src/components/Button";
import { View, TouchableOpacity } from "react-native";
import { Text, Portal, Dialog, Paragraph, Button as MaterialButton, Snackbar, Title } from "react-native-paper";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

const INITIAL_STATE = { 
  isAskingOTP: false, isInsertingOTP: false, showDialog: false,
  otp: "",  phoneNumber: "", otpRequestId: "",
  showSnackbarFailVerification: false, snackbarFailMessage: "", isVerificationLoading: false
}

class VerifyPhoneScreen extends React.PureComponent{
  static navigationOptions = { header: null }
  
  handleDismissDialog = () => this.setState({showDialog: false});
  handleBackToSignIn = () => this.props.navigation.dispatch(StackActions.pop({n: 2}));
  handlePhoneNumberChange = phoneNumber => this.setState({phoneNumber});
  handleOTPChange = (otp) => this.setState({otp, isInsertingOTP: true});
  handleErrorDismiss = () => this.setState({ errorMessage: null });
  handleError = (err) => this.setState({ errorMessage: err.message });
  handleAskOTP = async () => {
    this.setState({ isVerificationLoading: true })
    try{
      const phoneNumber = new PhoneNumber(this.state.phoneNumber, false);
      const { requestId } = await VerifyPhoneAPI.sendCode(phoneNumber, true);
      this.setState({ isAskingOTP: true, otpRequestId: requestId });
    }catch(err){
      this.handleError(err);
    }finally{
      this.setState({ isVerificationLoading: false });
    }
  }

  handleVerifyClick = async () => {
    this.setState({ isVerificationLoading: true })
    try{
      const otp = new Otp(this.state.otp);
      await VerifyPhoneAPI.checkCode(this.state.otprequestId, otp, true);

      const user = User.create(this.email, this.password);
      user.phoneNumber = new PhoneNumber(this.state.phoneNumber, false);
      await PeopleAPI.createUser(user);
    }catch(err){
      this.handleError(err);
    }finally{
      this.setState({ isVerificationLoading: false });
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

  constructor(props){
    super(props);
    this.state = INITIAL_STATE;
    this.email = this.props.navigation.getParam("email", null);
    this.password = this.props.navigation.getParam("password", null);
    this.handleBackToSignIn = this.handleBackToSignIn.bind(this);
    this.handlePhoneNumberChange = this.handlePhoneNumberChange.bind(this);
    this.handleOTPChange = this.handleOTPChange.bind(this);
    this.handleAskOTP = this.handleAskOTP.bind(this);
    this.handleContinueClick = this.handleContinueClick.bind(this);
    this.handleErrorDismiss = this.handleErrorDismiss.bind(this);
  }

  componentDidUpdate(){
    if(this.isAskingOTP && this.txtVerificationCode && !this.isInsertingOTP) this.txtVerificationCode.focus();
  }

  render(){
    return(
      <React.Fragment>
        <KeyboardAwareScrollView keyboardShouldPersistTaps={'handled'} contentContainerStyle={styles.container}>
          <Title style={{ fontWeight: "500", fontSize: 24, marginBottom: 4 }}>{this.props.t("phoneVerifyLabel")}</Title>
          <Paragraph style={{ marginBottom: 16 }}>{this.props.t('phoneVerifyDescLabel')}</Paragraph>
          <View style={{flexDirection:"row"}}>
            <TextInput style={{ marginRight: 8 }} value="+62" editable={false}/>
            <TextInput 
              style={{ flex: 1 }} placeholder={this.props.t("example")+": 81215288888"} 
              textContentType="telephoneNumber" keyboardType="number-pad"
              editable={!this.state.isAskingOTP} value={this.state.phoneNumber}
              onChangeText={this.handlePhoneNumberChange}/>
          </View>
          {(this.state.isAskingOTP)?(
            <React.Fragment>
              <TextInput
                placeholder={this.props.t("verificationCode")} keyboardType="number-pad"
                value={this.state.otp} onChangeText={this.handleOTPChange} autoFocus/>
              <Button onPress={this.handleVerifyClick} isLoading={this.state.isVerificationLoading} disabled={this.state.isVerificationLoading} text={(this.state.isVerificationLoading)?"":this.props.t("verify")}/>
            </React.Fragment>
          ):(<Button onPress={this.handleAskOTP} isLoading={this.state.isVerificationLoading} disabled={this.state.isVerificationLoading} text={(this.state.isVerificationLoading)?"":this.props.t("askVerificationCode")}/>)}
          <TouchableOpacity style={styles.backToSignInContainer} onPress={this.handleBackToSignIn}>
            <Text style={{ textAlign: "center", color: "#0EAD69", fontWeight: "500" }}>{this.props.t("backSignIn")}</Text>
          </TouchableOpacity>
        </KeyboardAwareScrollView>

        <Portal>
          <Dialog visible={this.state.showDialog}>
            <Dialog.Title>{this.props.t("success")}</Dialog.Title>
            <Dialog.Content>
              <Paragraph>{this.props.t("registrationSuccess")}</Paragraph>
            </Dialog.Content>
            <Dialog.Actions>
              <MaterialButton onPress={this.handleContinueClick}>{this.props.t("next")}</MaterialButton>
            </Dialog.Actions>
          </Dialog>
        </Portal>

        <Snackbar
          visible={this.state.errorMessage} onDismiss={this.handleErrorDismiss}
          style={{ backgroundColor:"#EF6F6C" }} duration={Snackbar.DURATION_SHORT}>
          {this.state.errorMessage}
        </Snackbar>
     </React.Fragment>
    )
  }
}

const styles = StyleSheet.create({
  container: { paddingHorizontal: 32, flex: 1, alignItems: "stretch", justifyContent: "center" },
  backToSignInContainer: { position: "absolute", bottom: 32, left: 0, right: 0 }
})

export default withTranslation()(withCurrentUser(VerifyPhoneScreen))
