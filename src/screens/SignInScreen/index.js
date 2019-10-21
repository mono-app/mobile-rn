import React from 'react';
import firebase from 'react-native-firebase';
import NavigatorAPI from "src/api/navigator";
import PeopleAPI from "src/api/people"
import UserMappingAPI from "src/api/usermapping"
import { StyleSheet } from "react-native";
import { withCurrentUser } from "src/api/people/CurrentUser";
import Logo from "assets/logo-vertical.png";
import Button from "src/components/Button";
import TextInput from "src/components/TextInput";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { View, Image } from 'react-native';
import {Dialog, Paragraph, Portal, Button as MaterialButton } from "react-native-paper";
import { withTranslation } from 'react-i18next';

function SignInScreen(props){
  const [ email, setEmail ] = React.useState("");
  const [ password, setPassword ] = React.useState("");
  const [ isLoading, setIsLoading ] = React.useState(false);
  const [isError, setError] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState("");
  const { t } = props;

  const styles = StyleSheet.create({
    container: { flex:1, flexDirection: 'column', backgroundColor: '#fff', justifyContent: 'flex-start', alignItems: "stretch" },
    contentWrapper: { paddingLeft: 32, paddingRight: 32 },
    formWrapper: { justifyContent: 'space-between' },
    title: { marginBottom: 16, fontSize: 14, lineHeight: 14 * 1.5 },
    createAccountContainer: { position: 'absolute', bottom: 32, left: 0, right: 0 },
    logo: { width: 150, height: 150, alignSelf:"center" ,resizeMode: "contain", marginHorizontal: 32, marginVertical: 64 }
  });

  const handleEmailChange = (email) => setEmail(email);
  const handlePasswordChange = (password) => setPassword(password);
  const handleCreateAccountPress = () => props.navigation.navigate('SignUp');
  const handleLoginpress = async () => {
    if(email && password){
      setIsLoading(true);
      try{
        const isExists = await PeopleAPI.isExists(email)
        if(isExists){
          const { user } = await firebase.auth().signInWithEmailAndPassword(email.toLowerCase(), password);
          props.setCurrentUserEmail(user.email);
        }else{
          setErrorMessage(t('emailNotRegistered'))
          setError(true)
        }

      }catch{
        setErrorMessage(t("wrongPassword"))
        setError(true)
      }finally{
        setIsLoading(false);
      }
    }else{
      setErrorMessage(t("pleaseFillEmPass"))
      setError(true)
    }
  }
  
  const handleErrorDialogDismiss = () => {
    setError(false)
    setErrorMessage("")
  }

  React.useEffect(() => {
    const storeToken = async () => {
      await UserMappingAPI.setAccessToken(email)
      const firebaseUser = firebase.auth().currentUser;
      if(firebaseUser !== null) {
        const fcmToken = await firebase.messaging().getToken();
        if (fcmToken) {
            await PeopleAPI.storeMessagingToken(firebaseUser.email,fcmToken)
        }
      }
    }

    if(props.isLoggedIn){
      if(props.currentUser.phoneNumber !== undefined && props.currentUser.isCompleteSetup !== undefined){
        let routeNameForReset = "MainTabNavigator";
        if(props.currentUser.phoneNumber && props.currentUser.phoneNumber.isVerified===true){
          if(props.currentUser.isCompleteSetup){
            routeNameForReset = "MainTabNavigator"
            storeToken()
          } else {
            routeNameForReset = "AccountSetup"
          }
          const navigator = new NavigatorAPI(props.navigation);
          navigator.resetTo(routeNameForReset);  
        }else if(props.currentUser.phoneNumber && props.currentUser.phoneNumber.isVerified===false){
          if(email && password){
            props.navigation.navigate("VerifyPhone", {email, password});
          }
        }
      }
    }
  }, [props.currentUser.isCompleteSetup, props.isLoggedIn])

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
        <Dialog visible={isError} onDismiss={handleErrorDialogDismiss}>
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
export default withTranslation()(withCurrentUser(SignInScreen));