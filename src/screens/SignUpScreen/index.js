import React from "react";
import PeopleAPI from "src/api/people";
import HelperAPI from "src/api/helper";
import { StackActions } from "react-navigation";
import { StyleSheet } from "react-native";

import Button from "src/components/Button";
import TextInput from "src/components/TextInput";
import { View, TouchableOpacity } from "react-native";
import { Text, Title, Dialog, Paragraph, Portal, Button as MaterialButton } from "react-native-paper";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

const INITIAL_STATE = { 
  email: "",  password: "",  verifyPassword: "", isError: false,
  errorMessage: "", isLoading: false
}

export default class SignUpScreen extends React.PureComponent{
  static navigationOptions = { header: null }
  
  handleBackToSignIn = () => this.props.navigation.dispatch(StackActions.pop({n: 1}));
  handleErrorDialogDismiss = () => this.setState({isError: false, errorMessage: ""});
  handleEmailChange = email => this.setState({email});
  handlePasswordChange = password => this.setState({password});
  handleVerifyPasswordChange = verifyPassword => this.setState({verifyPassword});
  handleContinuePress = async () => {
    this.setState({isLoading:true})
    if(this.state.email === null || this.state.email === "" || this.state.email === undefined){
      this.setState({isError: true, errorMessage: "Email tidak boleh kosong!"});
    }else if(!HelperAPI.validateEmail(this.state.email)){
      this.setState({isError: true, errorMessage: "Format email tidak benar!"});
    }else if(this.state.password === null || this.state.password === "" || this.state.password === undefined){
      this.setState({isError: true, errorMessage: "Password tidak boleh kosong!"});
    }else if(this.state.password !== this.state.verifyPassword){
      this.setState({isError: true, errorMessage: "Password tidak sama!"});
    }else if(this.state.password.length < 6){
      this.setState({isError: true, errorMessage: "Password minimal 6 karakter!"});
    }else {
      let email = JSON.parse(JSON.stringify(this.state.email))
      email = email.toLowerCase()
      const isExists = await PeopleAPI.isExists(email)
      if(isExists===false){
        this.props.navigation.navigate("VerifyPhone", {email, password: this.state.password});
      }else{
        this.setState({isError: true, errorMessage: "Email sudah digunakan!"});
      }
    }
    this.setState({isLoading:false})
  }

  constructor(props){
    super(props);

    this.state = INITIAL_STATE;
    this.handleBackToSignIn = this.handleBackToSignIn.bind(this);
  }

  render(){
    return(
      <KeyboardAwareScrollView contentContainerStyle={styles.container}>
        <Title>Form Registrasi Pengguna Baru</Title>
        <Paragraph style={{ marginBottom: 16 }}>Masukan email dan password untuk mendaftar pada aplikasi ini. Mohon untuk tidak pernah membagikan password kepada siapapun</Paragraph>
        <View>
          <TextInput
            placeholder="Alamat Email" textContentType="emailAddress" style={{ marginBottom: 8, paddingVertical: 16 }}
            value={this.state.email} onChangeText={this.handleEmailChange} autoCapitalize="none"/>
          <TextInput
            placeholder="Password" textContentType="password" style={{ marginBottom: 8, paddingVertical: 16 }}
            secureTextEntry={true} value={this.state.password} onChangeText={this.handlePasswordChange}/>
          <TextInput
            placeholder="Ulangi Password" textContentType="password" style={{ paddingVertical: 16 }}
            secureTextEntry={true} value={this.state.verifyPassword} onChangeText={this.handleVerifyPasswordChange}/>
          <Button text="Lanjutkan" onPress={this.handleContinuePress} isLoading={this.state.isLoading} disabled={this.state.isLoading}/>
        </View>
        <TouchableOpacity style={styles.backToSignInContainer} onPress={this.handleBackToSignIn}>
          <Text style={{ textAlign: "center", color: "#0EAD69", fontWeight: "500" }}>Saya punya akun. Kembali ke Sign In</Text>
        </TouchableOpacity>
        <Portal>
          <Dialog visible={this.state.isError} onDismiss={this.handleErrorDialogDismiss}>
            <Dialog.Title>Ops!</Dialog.Title>
            <Dialog.Content>
              <Paragraph>{this.state.errorMessage}</Paragraph>
            </Dialog.Content>
            <Dialog.Actions>
              <MaterialButton onPress={this.handleErrorDialogDismiss}>Mengerti</MaterialButton>
            </Dialog.Actions>
          </Dialog>
        </Portal>
      </KeyboardAwareScrollView>
    )
  }
}

const styles = StyleSheet.create({
  container: { paddingHorizontal: 32, flex: 1, alignItems: "stretch", justifyContent: "center" },
  backToSignInContainer: { position: "absolute", bottom: 32, left: 0, right: 0 }
})