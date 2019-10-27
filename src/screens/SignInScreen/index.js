import React from 'react';
import firebase from 'react-native-firebase';
import NavigatorAPI from "src/api/navigator";
import AuthenticationAPI from "src/api/authentication";
import NotificationAPI from "src/api/notification";
import { StyleSheet } from "react-native";

import Logo from "assets/logo-vertical.png";
import Button from "src/components/Button";
import TextInput from "src/components/TextInput";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { View, Image } from 'react-native';
import { Dialog, Paragraph, Portal, Button as MaterialButton } from "react-native-paper";
import { withTranslation } from 'react-i18next';

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
      const messagingToken = new MessagingToken();
      messagingToken.owner = authenticatedUser;
      messagingToken.token = await firebase.messaging().getToken();
      await NotificationAPI.storeToken(messagingToken)
      goto("Splash");
    }catch(err){
      handleError(err.message);
    }finally{ setIsLoading(false) }
  }
  

  return (
    <KeyboardAwareScrollView keyboardShouldPersistTaps={'handled'} style={{flex:1}}>
      <Image style={styles.logo} source={Logo}/>
      <View style={styles.contentWrapper}>
        <Paragraph style={styles.title}>
          {t("loginLabel")}
        </Paragraph>
        <View style={styles.formWrapper}>
          <TextInput
            placeholder="Email" textContentType="emailAddress" autoCapitalize="none"
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
      <Portal>
        <Dialog visible={!!errorMessage} onDismiss={handleErrorDialogDismiss}>
          <Dialog.Title>Ops!</Dialog.Title>
          <Dialog.Content>
            <Paragraph>{errorMessage}</Paragraph>
          </Dialog.Content>
          <Dialog.Actions>
            <MaterialButton onPress={handleErrorDialogDismiss}>{t("understand")}</MaterialButton>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </KeyboardAwareScrollView>
  );
}
export default withTranslation()(SignInScreen);