import React from "react";
import { View, StyleSheet, TouchableOpacity } from "react-native";
import { Text } from "react-native-paper";
import { default as FontAwesome } from "react-native-vector-icons/FontAwesome";
import SquareAvatar from "src/components/Avatar/Square";
import Header from "modules/Classroom/components/Header";
import SchoolAPI from "modules/Classroom/api/school"
import SchoolAdminAPI from "modules/Classroom/api/schooladmin"
import CurrentUserAPI from "src/api/people/CurrentUser";

const INITIAL_STATE = {
  isLoading: false,
  profilePicture: "https://picsum.photos/200/200/?random",
  schoolId: "",
  school: {},
  userName: ""
};

export default class SchoolAdminHomeScreen extends React.PureComponent {
  static navigationOptions = () => {
    return { header: null };
  };

  loadSchoolInformation = async () => {
    const school = await SchoolAPI.getDetail(this.state.schoolId);
    this.setState({school})
  }

  loadUserName = async () => {
    const currentUserEmail = await CurrentUserAPI.getCurrentUserEmail()

    const schoolAdmin = await SchoolAdminAPI.getDetail(this.state.schoolId, currentUserEmail)
    this.setState({userName: schoolAdmin.name})
  }

  handleAddPress = e => {
    payload = {
      schoolId: this.state.schoolId
    }
    this.props.navigation.navigate("SchoolAdminAdd", payload);
  };

  handleDataMasterPress = e => {
    payload = {
      schoolId: this.state.schoolId
    }
    this.props.navigation.navigate("SchoolAdminDataMaster", payload);
  };

  handleArchiveClass = e => {
    payload = {
      schoolId: this.state.schoolId
    }
    this.props.navigation.navigate("ArchiveClassList", payload);
  };
  
  constructor(props) {
    super(props);
    INITIAL_STATE.schoolId = SchoolAPI.currentSchoolId
    this.state = INITIAL_STATE;
    this.loadSchoolInformation = this.loadSchoolInformation.bind(this);
    this.loadUserName = this.loadUserName.bind(this);
    this.handleAddPress = this.handleAddPress.bind(this);
    this.handleDataMasterPress = this.handleDataMasterPress.bind(this);
    this.handleArchiveClass = this.handleArchiveClass.bind(this);
  }

  componentDidMount(){
    this.loadSchoolInformation();
    this.loadUserName();
  }

  render() {
    return (
      <View style={styles.groupContainer}>
        <Header navigation={this.props.navigation} title={this.state.school.name} />

        <View style={styles.logo}>
          <SquareAvatar size={100} uri={this.state.profilePicture}/>
          <Text style={{ fontWeight: "700", marginTop: 16, fontSize: 20 }}>
            Selamat Datang,
          </Text>
          <Text style={{ fontWeight: "400", fontSize: 16 }}>{this.state.userName}</Text>
        </View>

        <View style={{marginBottom: 64}}/>

        <View style={styles.buttonContainer}>
          <TouchableOpacity onPress={this.handleAddPress} >
            <View style={styles.button} >
              <View style={{flex:1, justifyContent:"center",alignItems:"center"}}>
                <FontAwesome name="plus" style={{color: "#fff"}} size={24} />
              </View>
            </View>
            <Text>Tambah</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={this.handleDataMasterPress}>
            <View style={styles.button} >
              <View style={{flex:1, justifyContent:"center",alignItems:"center"}}>
                <FontAwesome name="cog" style={{color: "#fff"}} size={24} />
              </View>
            </View>
            <Text>Data Master</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={this.handleArchiveClass}>
            <View style={styles.button} >
              <View style={{flex:1, justifyContent:"center",alignItems:"center"}}>
                <FontAwesome name="folder" style={{color: "#fff"}} size={24} />
              </View>
            </View>
            <Text>Arsip Kelas</Text>
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
