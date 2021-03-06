import React from 'react';
import NavigatorAPI from "src/api/navigator";
import AuthenticationAPI from "src/api/authentication";
import User from "src/entities/user";
import { StyleSheet } from "react-native";

import Logo from "assets/logo-vertical.png";
import Button from "src/components/Button";
import TextInput from "src/components/TextInput";
import CustomSnackbar from "src/components/CustomSnackbar";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { View, Image } from 'react-native';
import { Paragraph } from "react-native-paper";
import { withTranslation } from 'react-i18next';
import { withCurrentUser } from "src/api/people/CurrentUser"

function SignInScreen(props){
  const { navigation, t } = props;

  const [ email, setEmail ] = React.useState("");
  const [ password, setPassword ] = React.useState("");
  const [ isLoading, setIsLoading ] = React.useState(false);
  const [ errorMessage, setErrorMessage ] = React.useState(null);

  const styles = StyleSheet.create({
    container: { flex:1, flexDirection: 'column', backgroundColor: '#fff', justifyContent: 'flex-start', alignItems: "stretch" },
    contentWrapper: { paddingLeft: 32, paddingRight: 32 },
    formWrapper: { justifyContent: 'space-between' },
    title: { marginBottom: 16, fontSize: 14, lineHeight: 14 * 1.5 },
    createAccountContainer: { position: 'absolute', bottom: 32, left: 0, right: 0 },
    logo: { width: 150, height: 150, alignSelf:"center" ,resizeMode: "contain", marginHorizontal: 32, marginVertical: 64 }
  });

  const goto = (routeName) => {
    const navigator = new NavigatorAPI(navigation);
    navigator.resetTo(routeName);
  }

  const handleErrorDialogDismiss = () => setErrorMessage(null)
  const handleError = (message) => setErrorMessage(message);
  const handleEmailChange = (email) => setEmail(email);
  const handlePasswordChange = (password) => setPassword(password);
  const handleCreateAccountPress = () => props.navigation.navigate('SignUp');
  const handleLoginpress = async () => {
    setIsLoading(true);
    try{
      const user = new User();
      user.email = email;
      user.password = password;

      const authenticatedUser = await AuthenticationAPI.signIn(user);
      props.setCurrentUserId(authenticatedUser.id);
      goto("Splash");
    }catch(err){
      if(err.code==="auth/invalid-email") handleError(props.t("wrongEmailFormat"))
      if(err.code==="email/not-valid") handleError(props.t("wrongEmailFormat"))
      else if (err.code==="password/weak") handleError(props.t("minPassChar"))
      else if (err.code==="auth/user-not-found") handleError(props.t("userNotRegistered"))
      else if (err.code==="auth/wrong-password") handleError(props.t("wrongPassword"))
      else handleError(err.message);
      
    }finally{ setIsLoading(false) }
  }
  

  return (
    <React.Fragment>
      <KeyboardAwareScrollView keyboardShouldPersistTaps={'handled'} style={{flex:1}}>
        <Image style={styles.logo} source={Logo}/>
        <View style={styles.contentWrapper}>
          <Paragraph style={styles.title}>
            {t("loginLabel")}
          </Paragraph>
          <View style={styles.formWrapper}>
            <TextInput
              placeholder="Email" textContentType="emailAddress" autoCapitalize="none" keyboardType="email-address"
              value={email} onChangeText={handleEmailChange} style={{ paddingVertical: 16, marginBottom: 8 }}/>
            <TextInput
              placeholder="Password" textContentType="password"
              secureTextEntry={true} value={password} style={{ paddingVertical: 16 }}
              onChangeText={handlePasswordChange}/>
            <Button onPress={handleLoginpress} isLoading={isLoading} disabled={isLoading} text={t('login')} style={{ marginBottom: 4 }}/>
            <Button onPress={handleCreateAccountPress} text={t("createAccount")} outlined/>
            <Paragraph style={{ fontWeight: '500', textAlign: 'center' }}>
            </Paragraph>
          </View>
        </View>
      </KeyboardAwareScrollView>
      <CustomSnackbar isError={true} message={errorMessage} onDismiss={handleErrorDialogDismiss}/>
    </React.Fragment>
  );
}
export default withTranslation()(withCurrentUser(SignInScreen));