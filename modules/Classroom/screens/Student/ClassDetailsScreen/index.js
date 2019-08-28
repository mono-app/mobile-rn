import React from "react";
import { View,StyleSheet } from "react-native";
import { ScrollView, TouchableOpacity } from "react-native-gesture-handler";
import {
  ActivityIndicator,
  Dialog,
  Text,
  Caption,
} from "react-native-paper";
import AppHeader from "src/components/AppHeader";
import ClassAPI from "modules/Classroom/api/class";
import TeacherAPI from "modules/Classroom/api/teacher";
import PeopleProfileHeader from "src/components/PeopleProfile/Header";
import PeopleInformationContainer from "src/components/PeopleProfile/InformationContainer";
import { default as EvilIcons } from "react-native-vector-icons/EvilIcons";
import { default as FontAwesome } from "react-native-vector-icons/FontAwesome";
import { withCurrentStudent } from "modules/Classroom/api/student/CurrentStudent";

const INITIAL_STATE = { isLoadingProfile: true, class: null, teacher: {} };
class ClassDetailsScreen extends React.PureComponent {
  static navigationOptions = ({ navigation }) => {
    return {
      header: (
        <AppHeader
          navigation={navigation}
          title="Info Kelas"
          style={{ backgroundColor: "transparent" }}
        />
      )
    };
  };
  
  loadClassInformation = async () => {
    this.setState({ isLoadingProfile: true });

    const class_ = await ClassAPI.getDetail(this.props.currentSchool.id, this.classId);
    this.setState({ isLoadingProfile: false, class: class_ });
  };

  loadTeacherInformation = async () => {
    const teachers = await TeacherAPI.getClassTeachers(this.props.currentSchool.id, this.classId);
    const teacher = teachers[0];
    this.setState({teacher});
  }

  handleStudentListScreen = () => {
    payload = {
      schoolId: this.props.currentSchool.id,
      classId: this.classId
    }
    this.props.navigation.navigate("StudentList", payload)
  }

  handleTaskListScreen = () => {
    payload = {
      schoolId: this.props.currentSchool.id,
      classId: this.classId,
      subject: this.state.class.subject,
      subjectDesc: this.state.class.room+" | "+this.state.class.academicYear+" | Semester "+this.state.class.semester
    }

    this.props.navigation.navigate("TaskList", payload)
  }

  handleClassFilesScreenPress = () => {
    payload = {
      schoolId: this.props.currentSchool.id,
      classId: this.classId,
      subject: this.state.class.subject,
      subjectDesc: this.state.class.room+" | "+this.state.class.academicYear+" | Semester "+this.state.class.semester
    }
    this.props.navigation.navigate("ClassFiles", payload)
  }

  constructor(props) {
    super(props);
    this.classId = this.props.navigation.getParam("classId", null);
    this.state = INITIAL_STATE;
    this.loadClassInformation = this.loadClassInformation.bind(this);
    this.handleStudentListScreen = this.handleStudentListScreen.bind(this);
    this.handleClassFilesScreenPress = this.handleClassFilesScreenPress.bind(this);
  }

  componentDidMount() {
    this.loadClassInformation();
    this.loadTeacherInformation();
  }

  render() {
    if (this.state.isLoadingProfile) {
      return (
        <Dialog visible={true}>
          <Dialog.Content
            style={{ flexDirection: "row", justifyContent: "space-evenly" }}
          >
            <ActivityIndicator />
            <View>
              <Text>Sedang memuat data</Text>
              <Caption>Harap tunggu...</Caption>
            </View>
          </Dialog.Content>
        </Dialog>
      );
    } else 
    return (
      <View style={{ backgroundColor: "#E8EEE8" }}>
        <ScrollView>
          <View style={{  marginTop: 16 }}/>  
          <PeopleProfileHeader
            profilePicture="https://picsum.photos/200/200/?random"
            nickName={this.state.class.subject}
            />
          <View style={{  marginVertical: 16 }}>  
            <PeopleInformationContainer
              fieldName="Ruangan"
              fieldValue={this.state.class.room}/>
            <PeopleInformationContainer
              fieldName="Semester"
              fieldValue={this.state.class.semester}/>
           <PeopleInformationContainer
              fieldName="Tahun Ajaran"
              fieldValue={this.state.class.academicYear}/>
            <PeopleInformationContainer
              fieldName="Guru"
              fieldValue={this.state.teacher.name}/>
          </View>
          
          <View style={{  padding: 16, backgroundColor: "#fff" }}>
            <Text style={{fontWeight: "bold"}}>Informasi Kelas</Text>
            <View style={{flexDirection:"row"}}>
              <Text>{this.state.class.information}</Text>
            </View>
          </View>

          <View style={{  marginVertical: 16 }}>
            <TouchableOpacity onPress={this.handleStudentListScreen}>
              <View style={styles.listItemContainer}>
                <View style={styles.listDescriptionContainer}>
                  <View style={{flexDirection:"row"}}>
                    <FontAwesome name="users" size={24} style={{marginRight:16, width: 30}}/>
                    <Text style={styles.label}>Daftar Murid</Text>
                  </View>
                  <View style={{flexDirection:"row",textAlign: "right"}}>
                    <EvilIcons name="chevron-right" size={24} style={{ color: "#5E8864" }}/>
                  </View>
                </View>
              </View>
            </TouchableOpacity>
            <TouchableOpacity onPress={this.handleClassFilesScreenPress}>
              <View style={styles.listItemContainer}>
                <View style={styles.listDescriptionContainer}>
                  <View style={{flexDirection:"row"}}>
                    <FontAwesome name="paperclip" size={24} style={{marginRight:16, width: 30}}/>
                    <Text style={styles.label}>Berkas</Text>
                  </View>
                  <View style={{flexDirection:"row",textAlign: "right"}}>
                    <EvilIcons name="chevron-right" size={24} style={{ color: "#5E8864" }}/>
                  </View>
                </View>
              </View>
            </TouchableOpacity>
            <TouchableOpacity onPress={this.handleTaskListScreen}>
              <View style={styles.listItemContainer}>
                <View style={styles.listDescriptionContainer}>
                  <View style={{flexDirection:"row"}}>
                    <FontAwesome name="list-alt" size={24} style={{marginRight:16, width: 30}}/>
                    <Text style={styles.label}>Daftar Tugas</Text>
                  </View>
                  <View style={{flexDirection:"row",textAlign: "right"}}>
                    <EvilIcons name="chevron-right" size={24} style={{ color: "#5E8864" }}/>
                  </View>
                </View>
              </View>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    )
  }
}
const styles = StyleSheet.create({
  profileContainer: {
    backgroundColor: "white",
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 8,
    paddingBottom: 32,
    borderBottomWidth: 1,
    borderBottomColor: "#E8EEE8"
  },
  listItemContainer: {
    borderBottomWidth: 1,
    borderBottomColor: "#E8EEE8",
    backgroundColor: "white",
    flexDirection: "row",
    padding: 16,
    alignItems: "center"
  },
  listDescriptionContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between"
  },
  label: {
    fontWeight: "normal"
  }
})

export default withCurrentStudent(ClassDetailsScreen)
