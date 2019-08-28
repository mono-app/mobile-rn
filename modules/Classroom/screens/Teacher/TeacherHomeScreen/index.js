import React from "react";
import { View, StyleSheet, TouchableOpacity } from "react-native";
import { Text, Title, withTheme, Subheading } from "react-native-paper";
import { default as FontAwesome } from "react-native-vector-icons/FontAwesome";
import SquareAvatar from "src/components/Avatar/Square";
import Header from "modules/Classroom/components/Header";
import SchoolAPI from "modules/Classroom/api/school"
import TeacherAPI from "modules/Classroom/api/teacher";
import { withCurrentUser } from "src/api/people/CurrentUser"

const INITIAL_STATE = {
  isLoading: false,
  teacherEmail: "",
  profilePicture: "https://picsum.photos/200/200/?random",
  schoolId: "",
  school: {},
  userName: ""
};

class TeacherHomeScreen extends React.PureComponent {
  static navigationOptions = () => {
    return { header: null };
  };

  loadSchoolInformation = async () => {
    const school = await SchoolAPI.getDetail(this.state.schoolId);
    this.setState({school})
  }

  handleAddPress = e => {
    payload = {
      schoolId: this.state.schoolId
    }
    this.props.navigation.navigate("AddTask", payload);
  };

  handleDataMasterPress = e => {
    payload = {
      schoolId: this.state.schoolId
    }
    this.props.navigation.navigate("SchoolAdminDataMaster", payload);
  };

  handleTeacherProfilePress = e => {
    payload = {
      schoolId: this.state.schoolId,
      teacherEmail: this.state.teacherEmail
    }
    this.props.navigation.navigate("MyProfile", payload);
  };

  handleClassListPress = e => {
    payload = {
      schoolId: this.state.schoolId,
      teacherEmail: this.state.teacherEmail
    }
    this.props.navigation.navigate("MyClass", payload);
  }

  loadProfileInformation = async () => {
    const currentUserEmail = this.props.currentUser.email
    const teacher = await TeacherAPI.getDetail(this.state.schoolId, currentUserEmail)
    if(teacher.profilePicture){
      this.setState({ profilePicture: teacher.profilePicture.downloadUrl });
    }
    this.setState({userName: teacher.name, teacherEmail: currentUserEmail})

  }
  
  constructor(props) {    
    super(props);
    INITIAL_STATE.schoolId = SchoolAPI.currentSchoolId
    this.state = INITIAL_STATE;
    this.loadSchoolInformation = this.loadSchoolInformation.bind(this);
    this.handleAddPress = this.handleAddPress.bind(this);
    this.handleDataMasterPress = this.handleDataMasterPress.bind(this);
    this.handleTeacherProfilePress = this.handleTeacherProfilePress.bind(this);
    this.handleClassListPress = this.handleClassListPress.bind(this);
    this.loadProfileInformation = this.loadProfileInformation.bind(this);
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
          <TouchableOpacity onPress={this.handleTeacherProfilePress} style={{marginTop:16}}>
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
              <Text>Lihat kelas</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={this.handleAddPress} >
              <View style={styles.button} >
                <View style={{flex:1, justifyContent:"center",alignItems:"center"}}>
                  <FontAwesome name="plus" style={{color: "#fff"}} size={24} />
                </View>
              </View>
              <Text>Tambah Tugas</Text>
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

export default withCurrentUser(withTheme(TeacherHomeScreen))
