import React from "react";
import { View, StyleSheet, TouchableOpacity } from "react-native";
import { ActivityIndicator, Caption, Dialog, Text, Title, withTheme, Subheading } from "react-native-paper";
import { default as FontAwesome } from "react-native-vector-icons/FontAwesome";
import SquareAvatar from "src/components/Avatar/Square";
import Header from "modules/Classroom/components/Header";
import SchoolAPI from "modules/Classroom/api/school"
import { withCurrentStudent } from "modules/Classroom/api/student/CurrentStudent";
import { withCurrentUser } from "src/api/people/CurrentUser"
import { withTranslation } from 'react-i18next';

const INITIAL_STATE = {
  isLoading: false,
  profilePicture: "https://picsum.photos/200/200/?random",
  schoolId: "",
};
class StudentHomeScreen extends React.PureComponent {
  static navigationOptions = () => {
    return { header: null };
  };

  handleStudentProfilePress = () => {
    payload = {
      schoolId: this.props.currentSchool.id,
      studentEmail: this.props.currentStudent.email
    }
    this.props.navigation.navigate("MyProfile", payload);
  }

  handleClassListPress = () => {
    payload = {
      schoolId: this.props.currentSchool.id,
      studentEmail: this.props.currentStudent.email
    }
    this.props.navigation.navigate("MyClass", payload);
  }

  handleAnnouncementPress = () => {
    payload = {
      schoolId : this.props.currentSchool.id,
      studentEmail: this.props.currentStudent.email
    }
    this.props.navigation.navigate("Announcement", payload);
  }

  
  handleMyDiscussionsPress = () => {
    payload = {
      schoolId : this.props.currentSchool.id,
    }
    this.props.navigation.navigate("MyDiscussions", payload);
  }

  constructor(props) {    
    super(props);
    INITIAL_STATE.schoolId = SchoolAPI.currentSchoolId
    this.state = INITIAL_STATE;
    this._isMounted = null
    this.handleStudentProfilePress = this.handleStudentProfilePress.bind(this);
    this.handleClassListPress = this.handleClassListPress.bind(this);
    this.handleAnnouncementPress = this.handleAnnouncementPress.bind(this);
    this.handleMyDiscussionsPress = this.handleMyDiscussionsPress.bind(this);
  }

  async componentDidMount(){
    this._isMounted = true
    if(this._isMounted)
     this.setState({isLoading: true})
    await this.props.setCurrentStudentEmail(this.state.schoolId, this.props.currentUser.email)
    if(this._isMounted)
      this.setState({isLoading: false})
  }
  
  componentWillUnmount() {
    this._isMounted = false;
  }

  render() {
    if(this.state.isLoading){
      return (
        <Dialog visible={true}>
          <Dialog.Content style={{ flexDirection: "row", justifyContent: "space-evenly" }}>
            <ActivityIndicator/>
            <View>
              <Text>{this.props.t("loadData")}</Text>
              <Caption>{this.props.t("pleaseWait")}</Caption>
            </View>
          </Dialog.Content>
        </Dialog>
      )
    }
    return (
      <View style={styles.groupContainer}>
        <Header navigation={this.props.navigation} title={this.props.currentSchool.name} />
        <View style={styles.logo}>
          <SquareAvatar size={100} uri={(this.props.currentStudent.profilePicture)? this.props.currentStudent.profilePicture.downloadUrl : this.state.profilePicture }/>
          <TouchableOpacity onPress={this.handleStudentProfilePress} style={{marginTop:16}}>
            <Text style={{ color: this.props.theme.colors.primary }}>{this.props.t("seeProfile")}</Text>
          </TouchableOpacity>
          <Title style={{marginTop: 22}}>
            {this.props.t("welcomeComa")}
          </Title>
          <Subheading>{this.props.currentStudent.name}</Subheading>
        </View>

        <View style={{marginBottom: 64}}/>

        <View style={{display:"flex"}}>
          <View style={styles.buttonContainer}>
            <TouchableOpacity onPress={this.handleClassListPress} style={{ alignItems: "center"}}>
                <View style={styles.button} >
                  <View style={{flex:1, justifyContent:"center",alignItems:"center"}}>
                    <FontAwesome name="list" style={{color: "#fff"}} size={24} />
                  </View>
                </View>
                <Text>{this.props.t("myClass")}</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={this.handleAnnouncementPress} style={{ alignItems: "center"}}>
                <View style={styles.button} >
                  <View style={{flex:1, justifyContent:"center",alignItems:"center"}}>
                    <FontAwesome name="comment" style={{color: "#fff"}} size={24} />
                  </View>
                </View>
                <Text> {this.props.t("announcement")} </Text>
            </TouchableOpacity>
          </View>
          <View style={styles.buttonContainer}>
            <TouchableOpacity onPress={this.handleMyDiscussionsPress} style={{ alignItems: "center"}}>
                <View style={styles.button} >
                  <View style={{flex:1, justifyContent:"center",alignItems:"center"}}>
                    <FontAwesome name="list" style={{color: "#fff"}} size={24} />
                  </View>
                </View>
                <Text>{this.props.t("myDiscussion")}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#E8EEE8", color: "black" },
  logo: {
    marginTop: 36,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center"
  },
  groupContainer: {  flex: 1, backgroundColor: "#E8EEE8"},
  buttonContainer: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-evenly"
  },
  menu: {
    padding: 16,
    backgroundColor: "white",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#E8EEE8"
  },
  button: {
    alignItems: "center",
    alignSelf: "center",
    backgroundColor: "#0EAD69",
    height: 60,
    width: 60,
    borderColor: "#fff",
    borderRadius: 12
  }
});

export default withTranslation()(withCurrentUser(withCurrentStudent(withTheme(StudentHomeScreen))))