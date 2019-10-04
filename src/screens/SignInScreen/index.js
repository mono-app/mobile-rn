import React from 'react';
import firebase from 'react-native-firebase';
import NavigatorAPI from "src/api/navigator";
import { withCurrentUser } from "src/api/people/CurrentUser";
import { StyleSheet } from "react-native";
import UserMappingAPI from "src/api/usermapping"
import Button from "src/components/Button";
import TextInput from "src/components/TextInput";
import { Text, View, TouchableOpacity } from 'react-native';
import PeopleAPI from "src/api/people"

function SignInScreen(props){
  const [ email, setEmail ] = React.useState("");
  const [ password, setPassword ] = React.useState("");
  const [ isLoading, setIsLoading ] = React.useState(false);

  const styles = StyleSheet.create({
    container: { flex: 1, flexDirection: 'column', backgroundColor: '#fff', alignItems: 'stretch', justifyContent: 'center' },
    contentWrapper: { paddingLeft: 32, paddingRight: 32 },
    formWrapper: { justifyContent: 'space-between' },
    title: { marginBottom: 32, fontSize: 14, lineHeight: 14 * 1.5 },
    createAccountContainer: { position: 'absolute', bottom: 32, left: 0, right: 0 },
  });

  const handleEmailChange = (email) => setEmail(email);
  const handlePasswordChange = (password) => setPassword(password);
  const handleCreateAccountPress = () => props.navigation.navigate('SignUp');
  const handleLoginpress = async () => {
    if(email && password){
      setIsLoading(true);
      try{
        const { user } = await firebase.auth().signInWithEmailAndPassword(email, password);
        props.setCurrentUserEmail(user.email);
      }catch{
        console.log("wrong username/pass")
      }finally{
        setIsLoading(false);
      }
    }
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
    <View style={styles.container}>
      <View style={styles.contentWrapper}>
        <Text style={styles.title}>
          Masukan alamat Email dan Password anda kemudian tekan Masuk
        </Text>
        <View style={styles.formWrapper}>
          <TextInput
            placeholder="Email ID" textContentType="emailAddress"
            value={email} onChangeText={handleEmailChange}/>
          <TextInput
            placeholder="Password" textContentType="password"
            secureTextEntry={true} value={password}
            onChangeText={handlePasswordChange}/>
          <Button onPress={handleLoginpress} isLoading={isLoading} text="Masuk"/>
          <Text style={{ fontWeight: '500', textAlign: 'center' }}>
            Saya lupa password saya. Reset Password
          </Text>
        </View>
      </View>
      <TouchableOpacity style={styles.createAccountContainer} onPress={handleCreateAccountPress}>
        <Text style={{ textAlign: 'center', color: '#0EAD69', fontWeight: '500', }}> Buat Akun </Text>
      </TouchableOpacity>
    </View>
  );
}
export default withCurrentUser(SignInScreen);