import React from "react";
import { View, Image, StyleSheet } from "react-native";
import Header from "modules/Classroom/components/Header";
import { Button } from "react-native-paper";
import { withTheme } from "react-native-paper";
import PeopleAPI from "src/api/people";
import firebase from "react-native-firebase";

class IntroductionScreen extends React.PureComponent {
  static navigationOptions = () => {
    return {
      header: null
    };
  };

  handleJoinPress = async () => {
    const user = await PeopleAPI.getDetailById(this.firebaseCurrentUser.uid, true)
    const payload = {
      email: user.data.email.address,
      description: "Saya ingin mendaftarkan sekolah saya dengan Classroom"
    }
    this.props.navigation.navigate("ContactSupport", payload)
  }
 
  constructor(props) {
    super(props);
    this.firebaseCurrentUser = firebase.auth().currentUser
    this.handleJoinPress = this.handleJoinPress.bind(this)
  }

  render() {
    return (
        <View style={styles(this.props).mainContainer}>
            <Header navigation={this.props.navigation} title=""  />
            <View style={styles(this.props).container}>
              <View style={{flex:2, ...styles(this.props).centerContent}}>
                <Image source={require('./images/logoclassroom.png')} resizeMode='contain' style={styles(this.props).image}/>

              </View>
              <View style={{flex:7, ...styles(this.props).centerContent}}>
                <Image source={require('./images/teacher.png')} resizeMode='contain' style={styles(this.props).image}/>

              </View>
              <View style={{flex:5, ...styles(this.props).centerContent}}>
                <Image source={require('./images/content1.png')} resizeMode='contain' style={styles(this.props).image}/>

              </View>
              <View style={{flex:3, ...styles(this.props).centerContent}}>
                <Image source={require('./images/content2.png')} resizeMode='contain' style={styles(this.props).image}/>
              </View>
              <View style={{flex:1, ...styles(this.props).centerContent}}>
                <View style={{ flexDirection:"row" }}>
                  <Button mode="contained" style={styles(this.props).button} onPress={this.handleJoinPress}>Yuk Bergabung</Button>
                </View>
              </View>
              <View style={{flex:2, ...styles(this.props).centerContent}}>
                <Image source={require('./images/logomono.png')} resizeMode='contain' style={styles(this.props).image}/>
              </View>
            </View>
        </View>
    );
  }
}

const styles = (props) => StyleSheet.create({
  mainContainer: { flex:1, backgroundColor: "#fff" },
  container: { flex:1, paddingHorizontal: 32 },
  button: { backgroundColor: props.theme.colors.primary, borderRadius:20, color:"#fff" },
  centerContent: { alignItems:"center", justifyContent:"center", padding: 4 },
  image: {width:"100%", height:"100%"}
});

export default withTheme(IntroductionScreen)