import React from "react";
import { View, StyleSheet, TouchableOpacity } from "react-native";
import { Text, Title, withTheme, Subheading } from "react-native-paper";
import { default as FontAwesome } from "react-native-vector-icons/FontAwesome";
import SquareAvatar from "src/components/Avatar/Square";
import Header from "modules/Classroom/components/Header";
import CurrentUserAPI from "src/api/people/CurrentUser";
import SchoolAPI from "modules/Classroom/api/school"
import StudentAPI from "modules/Classroom/api/student"

const INITIAL_STATE = {
  isLoading: false,
  studentEmail: "",
  profilePicture: "https://picsum.photos/200/200/?random",
  schoolId: "",
  school: {},
  userName: ""
};
class StudentHomeScreen extends React.PureComponent {
  static navigationOptions = () => {
    return { header: null };
  };

  loadSchoolInformation = async () => {
    const school = await SchoolAPI.getDetail(this.state.schoolId);
    this.setState({school})
  }

  loadProfileInformation = async () => {
    const currentUserEmail = await CurrentUserAPI.getCurrentUserEmail()
    const student = await StudentAPI.getDetail(this.state.schoolId, currentUserEmail)
    this.setState({userName: student.name, studentEmail: currentUserEmail})
  
  }

  handleStudentProfilePress = () => {
    payload = {
      schoolId: this.state.schoolId,
      studentEmail: this.state.studentEmail
    }
    this.props.navigation.navigate("MyProfile", payload);
  }

  handleClassListPress = () => {
    payload = {
      schoolId: this.state.schoolId,
      studentEmail: this.state.studentEmail
    }
    this.props.navigation.navigate("MyClass", payload);
  }

  handleAnnouncementPress = () => {
    payload = {
      schoolId : this.state.schoolId,
      studentEmail : this.state.studentEmail
    }
    this.props.navigation.navigate("Announcement", payload);
  }
  
  constructor(props) {    
    super(props);
    INITIAL_STATE.schoolId = SchoolAPI.currentSchoolId
    this.state = INITIAL_STATE;
    this.loadSchoolInformation = this.loadSchoolInformation.bind(this);
    this.loadProfileInformation = this.loadProfileInformation.bind(this);
    this.handleStudentProfilePress = this.handleStudentProfilePress.bind(this);
    this.handleClassListPress = this.handleClassListPress.bind(this);
    this.handleAnnouncementPress = this.handleAnnouncementPress.bind(this);
  }

  componentDidMount(){
    this.loadSchoolInformation();
    this.loadProfileInformation();
  }

  render() {
    return (
      <View style={styles.groupContainer}>
        <Header navigation={this.props.navigation} title={this.state.school.name} />
        <View style={styles.logo}>
          <SquareAvatar size={100} uri={this.state.profilePicture}/>
          <TouchableOpacity onPress={this.handleStudentProfilePress} style={{marginTop:16}}>
            <Text style={{ color: this.props.theme.colors.primary }}>Lihat Profile</Text>
          </TouchableOpacity>
          <Title style={{marginTop: 22}}>
            Selamat Datang,
          </Title>
          <Subheading>{this.state.userName}</Subheading>
        </View>

        <View style={{marginBottom: 64}}/>

        <View style={styles.buttonContainer}>
          <TouchableOpacity onPress={this.handleClassListPress}>
              <View style={styles.button} >
                <View style={{flex:1, justifyContent:"center",alignItems:"center"}}>
                  <FontAwesome name="list" style={{color: "#fff"}} size={24} />
                </View>
              </View>
              <Text>Kelas Saya</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={this.handleAnnouncementPress} >
              <View style={styles.button} >
                <View style={{flex:1, justifyContent:"center",alignItems:"center"}}>
                  <FontAwesome name="comment" style={{color: "#fff"}} size={24} />
                </View>
              </View>
              <Text>Pengumuman</Text>
          </TouchableOpacity>
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

export default withTheme(StudentHomeScreen)