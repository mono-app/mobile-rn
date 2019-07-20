import React from 'react';
import {
  StyleSheet, Text, View, TouchableOpacity
} from 'react-native';
import { NavigationEvents } from 'react-navigation';
import firebase from 'react-native-firebase';

import Navigator from "src/api/navigator";
import PeopleAPI from 'src/api/people';

import Button from "src/components/Button";
import TextInput from "src/components/TextInput";

const INITIAL_STATE = { email: "", password: "", isLoading: false }

export default class SignInScreen extends React.PureComponent {
  static navigationOptions = { header: null }
  
  handleScreenWillBlur = () => this.authListener();
  handleCreateAccountPress = () => this.props.navigation.navigate('SignUp');
  handleScreenWillFocus = () => {
    this.authListener = firebase.auth().onAuthStateChanged(user => {
      if(user){
        const navigator = new Navigator(this.props.navigation);
        new PeopleAPI().handleSignedIn(user.email, navigator);
      }
    })
  }

  onLoginPressed = () => {
    firebase.auth().signInWithEmailAndPassword(this.state.email, this.state.password);
  };

  constructor(props) {
    super(props);

    this.state = INITIAL_STATE;
    this.authListener = null;
    this.onLoginPressed = this.onLoginPressed.bind(this);
    this.handleCreateAccountPress = this.handleCreateAccountPress.bind(this);
    this.handleScreenWillFocus = this.handleScreenWillFocus.bind(this);
    this.handleScreenWillBlur = this.handleScreenWillBlur.bind(this);
  }

  render() {
    return (
      <View style={styles.container}>
        <NavigationEvents 
          onWillBlur={this.handleScreenWillBlur} 
          onWillFocus={this.handleScreenWillFocus}/>

        <View style={styles.contentWrapper}>
          <Text style={styles.title}>
            Masukan alamat Email dan Password anda kemudian tekan Masuk
          </Text>
          <View style={styles.formWrapper}>
            <TextInput
              placeholder="Email ID"
              textContentType="emailAddress"
              value={this.state.email}
              onChangeText={email => this.setState({ email })}
            />
            <TextInput
              placeholder="Password"
              textContentType="password"
              secureTextEntry={true}
              value={this.state.password}
              onChangeText={password => this.setState({ password })}
            />
            <Button onPress={this.onLoginPressed} text="Masuk"/>
            <Text style={{ fontWeight: '500', textAlign: 'center' }}>
              Saya lupa password saya. Reset Password
            </Text>
          </View>
        </View>
        <TouchableOpacity
          style={styles.createAccountContainer}
          onPress={this.handleCreateAccountPress}>
          <Text style={{ textAlign: 'center', color: '#0EAD69', fontWeight: '500', }}> Buat Akun </Text>
        </TouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: '#fff',
    alignItems: 'stretch',
    justifyContent: 'center',
  },
  contentWrapper: {
    paddingLeft: 32,
    paddingRight: 32,
  },
  formWrapper: {
    justifyContent: 'space-between',
  },
  title: {
    marginBottom: 32,
    fontSize: 14,
    lineHeight: 14 * 1.5,
  },
  createAccountContainer: {
    position: 'absolute',
    bottom: 32,
    left: 0,
    right: 0,
  },
});
