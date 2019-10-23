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
import PeopleProfileHeader from "src/components/PeopleProfile/Header";
import PeopleInformationContainer from "src/components/PeopleProfile/InformationContainer";
import { default as EvilIcons } from "react-native-vector-icons/EvilIcons";
import { default as FontAwesome } from "react-native-vector-icons/FontAwesome";
import { withCurrentTeacher } from "modules/Classroom/api/teacher/CurrentTeacher";
import RoomsAPI from "src/api/rooms"
import TaskAPI from "modules/Classroom/api/task"
import StudentAPI from "modules/Classroom/api/student"
import FileAPI from "modules/Classroom/api/file"
import { IconButton } from "react-native-paper";

const INITIAL_STATE = { isLoadingProfile: true, class: null, totalTask:0, totalStudent:0, totalFiles: 0 };
class ClassProfileScreen extends React.PureComponent {
  static navigationOptions = () => {
    return {
      header: null
    };
  };
  
  loadClassInformation = async () => {
    if(this._isMounted)
      this.setState({ isLoadingProfile: true });

    const class_ = await ClassAPI.getDetail(this.props.currentSchool.id, this.classId);

    TaskAPI.getTotalActiveTasks(this.props.currentSchool.id, this.classId).then(totalTask => {
      this.setState({totalTask})
    })

    StudentAPI.getTotalClassStudent(this.props.currentSchool.id, this.classId).then(totalStudent => {
      this.setState({totalStudent})
    })

    FileAPI.getTotalClassFiles(this.props.currentSchool.id, this.classId).then(totalFiles => {
      this.setState({totalFiles})
    })

    if(this._isMounted)
        this.setState({ isLoadingProfile: false, class: class_ });
  };

  handleStudentListScreen = () => {
    payload = {
      classId: this.classId
    }
    this.props.navigation.navigate("StudentList", payload)
  }

  handleTaskListScreen = () => {
    payload = {
      classId: this.classId,
      subject: this.state.class.subject,
      subjectDesc: this.state.class.room+" | "+this.state.class.academicYear+" | Semester "+this.state.class.semester
    }

    this.props.navigation.navigate("TaskList", payload)
  }

  handleClassFilesScreenPress = () => {

    payload = {
      classId: this.classId,
      subject: this.state.class.subject,
      subjectDesc: this.state.class.room+" | "+this.state.class.academicYear+" | Semester "+this.state.class.semester
    }
    this.props.navigation.navigate("ClassFiles", payload)
  }

  handleAddTask = () => {
    payload = {
      classId: this.classId,
      subject: this.state.class.subject,
      subjectDesc: this.state.class.room+" | "+this.state.class.academicYear+" | Semester "+this.state.class.semester
    }
    this.props.navigation.navigate("AddTask",payload);
  }

  handleMassScoringPress = () => {
    payload = {
      classId: this.classId,
    }
    this.props.navigation.navigate("MassScoring", payload);
  }

  
  handleGroupChatPress = async () => {
    const room = await RoomsAPI.createGroupClassRoomIfNotExists(this.props.currentSchool.id, this.classId)
    if(room){
      this.props.navigation.navigate("GroupChat", { room });
    }
  }

  constructor(props) {
    super(props);
    this.state = INITIAL_STATE;
    this._isMounted = null
    this.classId = this.props.navigation.getParam("classId", null);
    this.loadClassInformation = this.loadClassInformation.bind(this);
    this.handleStudentListScreen = this.handleStudentListScreen.bind(this);
    this.handleAddTask = this.handleAddTask.bind(this);
    this.handleClassFilesScreenPress = this.handleClassFilesScreenPress.bind(this);
    this.handleGroupChatPress = this.handleGroupChatPress.bind(this);
  }

  componentDidMount() {
    this._isMounted = true
    this.loadClassInformation();
  }
  
  componentWillUnmount() {
    this._isMounted = false;
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
      <View style={{flex:1, backgroundColor: "#E8EEE8" }}>
        <AppHeader
            navigation={this.props.navigation}
            title="Info Kelas"
            style={{ backgroundColor: "white" }}
          />
        <ScrollView>
          <View style={{  marginTop: 16 }}/>  
          <View style={{flexDirection:"row", backgroundColor: "white"}}>
            <PeopleProfileHeader
              style={{padding:16, flex:2}}
              profilePicture="https://picsum.photos/200/200/?random"
              title={this.state.class.subject}
              />
            <View style={{flex:1, justifyContent:"center", alignItems:"center"}}>
              <TouchableOpacity onPress={this.handleGroupChatPress}>
                <IconButton icon="comment" size={32}></IconButton>
              </TouchableOpacity>
            </View>
          </View>
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
                    <Text>{this.state.totalStudent}</Text>
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
                    <Text>{this.state.totalFiles}</Text>
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
                    <Text>{this.state.totalTask}</Text>
                    <EvilIcons name="chevron-right" size={24} style={{ color: "#5E8864" }}/>
                  </View>
                </View>
              </View>
            </TouchableOpacity>
            <TouchableOpacity onPress={this.handleAddTask}>
              <View style={styles.listItemContainer}>
                <View style={styles.listDescriptionContainer}>
                  <View style={{flexDirection:"row"}}>
                    <FontAwesome name="pencil" size={24} style={{marginRight:16, width: 30}}/>
                    <Text style={styles.label}>Tambah Tugas</Text>
                  </View>
                  <View style={{flexDirection:"row",textAlign: "right"}}>
                    <EvilIcons name="chevron-right" size={24} style={{ color: "#5E8864" }}/>
                  </View>
                </View>
              </View>
            </TouchableOpacity>
            <TouchableOpacity onPress={this.handleMassScoringPress}>
              <View style={styles.listItemContainer}>
                <View style={styles.listDescriptionContainer}>
                  <View style={{flexDirection:"row"}}>
                    <FontAwesome name="pencil" size={24} style={{marginRight:16, width: 30}}/>
                    <Text style={styles.label}>Penilaian Massal</Text>
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

export default withCurrentTeacher(ClassProfileScreen)
