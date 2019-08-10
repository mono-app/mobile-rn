import React from "react";
import { View, StyleSheet } from "react-native";
import { Text, Snackbar } from "react-native-paper";
import TaskAPI from "modules/Classroom/api/task";
import SubmissionAPI from "modules/Classroom/api/submission";
import AppHeader from "src/components/AppHeader";
import moment from "moment"
import { TouchableOpacity, ScrollView } from "react-native-gesture-handler";
import { default as EvilIcons } from "react-native-vector-icons/EvilIcons";

const INITIAL_STATE = { isLoading: true,schoolId: "1hZ2DiIYSFa5K26oTe75", task:{}, showSnackbarFailDeleting: false };

export default class TaskDetailsScreen extends React.PureComponent {
  static navigationOptions = ({ navigation }) => {
    return {
      header: (
        <AppHeader
          navigation={navigation}
          title="Detail Tugas"
          style={{ backgroundColor: "transparent" }}
        />
      )
    };
  };

  loadTask = async () => {
    const api = new TaskAPI();
    const task = await api.getDetail(this.state.schoolId, this.classId, this.taskId);
    this.setState({ isFetching: false, task });
  }


  handleTaskSubmissionPress = () => {
    const payload = {
      schoolId: this.state.schoolId,
      classId: this.classId,
      taskId: this.taskId,
      title: this.state.task.title,
      subject: this.subject,
      subjectDesc: this.subjectDesc
    }
    this.props.navigation.navigate(`TaskSubmissionList`, payload);
  }

  handleDiscussionPress = () => {
    const payload = {
      schoolId: this.state.schoolId,
      classId: this.classId,
      taskId: this.taskId,
      subject: this.subject,
      subjectDesc: this.subjectDesc
    }
    this.props.navigation.navigate(`Discussions`, payload);
  }
  
  handleSubmissionTaskPress = () => {
    const payload = {
      schoolId: this.state.schoolId,
      classId: this.classId,
      taskId: this.taskId,
      subject: this.subject,
      subjectDesc: this.subjectDesc
    }
    this.props.navigation.navigate(`TaskSubmission`, payload);
  }

  handleDelete = async () => {
    const total = await SubmissionAPI.getSubmissionsCount(this.state.schoolId, this.classId, this.taskId);
    
    if(total===0){
      await TaskAPI.deleteTask(this.state.schoolId, this.classId, this.taskId);
      const { navigation } = this.props;
      navigation.state.params.onDeleteSuccess();
      navigation.goBack();   
    }else{
      this.setState({showSnackbarFailDeleting: true});
    }
  }

  constructor(props) {
    super(props);
    this.state = INITIAL_STATE;
    this.loadTask = this.loadTask.bind(this);
    this.classId = this.props.navigation.getParam("classId", "");
    this.taskId = this.props.navigation.getParam("taskId", "");
    this.subject = this.props.navigation.getParam("subject", "");
    this.subjectDesc = this.props.navigation.getParam("subjectDesc", "");
    this.handleTaskSubmissionPress = this.handleTaskSubmissionPress.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
  }

  componentDidMount(){
    this.loadTask();
  }

  render() {
    return (
      <View>
        <ScrollView>
          <View style={{ flex: 1, backgroundColor: "#E8EEE8", paddingBottom:16 }}>
            <View style={styles.subjectContainer}>
                  <Text style={{fontWeight: "bold", fontSize: 18}}>
                    {this.subject}
                  </Text>
                  <Text style={{fontSize: 18}}>
                    {this.subjectDesc}
                  </Text>
            </View>
              <View style={styles.listItemContainer}>
                <View style={styles.listDescriptionContainer}>
                  <Text style={styles.label}>Nama Tugas</Text>
                  <Text style={styles.value}>{this.state.task.title}</Text>
                  
                </View>
              </View>
              <View style={styles.listItemContainer}>
                <View style={styles.listDescriptionContainer}>
                  <Text style={styles.label}>Tanggal Pengumpulan</Text>   
                  <Text style={styles.value}>{(this.state.task.dueDate)?moment(this.state.task.dueDate.seconds * 1000).format("DD MMMM YYYY"):""}</Text>
                  
                </View>
              </View>
              <View style={styles.listItemContainer}>
                <View style={styles.listDescriptionContainer}>
                  <Text style={styles.label}>Jam Pengumpulan</Text>
                  <Text style={styles.value}>{(this.state.task.dueDate)?moment(this.state.task.dueDate.seconds * 1000).format("HH:mm"):""}</Text>
                  
                </View>
              </View>
              <View style={styles.listItemContainer}>
                <View style={styles.listDescriptionContainer}>
                  <Text style={styles.label}>Detail Tugas</Text>
                  <Text style={styles.value}>{this.state.task.details}</Text>
                 
                </View>
              </View>
            <View style={{marginTop: 8}}/>
            <TouchableOpacity  onPress={this.handleTaskSubmissionPress}>
              <View style={styles.listItemContainer}>
                <View style={styles.listDescriptionContainer}>
                <Text>Lihat pengumpulan</Text>
                  <View style={{flexDirection:"row",textAlign: "right"}}>
                    <EvilIcons name="chevron-right" size={24} style={{ color: "#5E8864" }}/>
                  </View>
                </View>
              </View>
            </TouchableOpacity>
            <View style={{marginTop: 8}}/>

            <TouchableOpacity  onPress={this.handleDiscussionPress}>
              <View style={styles.listItemContainer}>
                <View style={styles.listDescriptionContainer}>
                  <Text>Diskusi</Text>
                  <View style={{flexDirection:"row",textAlign: "right"}}>
                    <EvilIcons name="chevron-right" size={24} style={{ color: "#5E8864" }}/>
                  </View>
                </View>
              </View>
            </TouchableOpacity>

            <TouchableOpacity onPress={this.handleSubmissionTaskPress}>
              <View style={{backgroundColor:"#EF6F6C", padding: 12, margin:16, borderRadius:8 }}>
                  <Text style={{alignSelf: "center",alignItems:"center", color: "#fff"}}>Kumpulkan Tugas</Text>
              </View>
            </TouchableOpacity>
            
          </View>
        </ScrollView>
       
        <Snackbar
          visible= {this.state.showSnackbarFailDeleting}
          onDismiss={() => this.setState({ showSnackbarFailDeleting: false })}
          style={{backgroundColor:"red"}}
          duration={Snackbar.DURATION_SHORT}>
          Tidak bisa menghapus karena sudah ada murid yang mengumpulkan tugas
        </Snackbar>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  subjectContainer:{
    marginVertical: 16,
    backgroundColor: "#fff",
    flexDirection: "column",
    padding: 16
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
    justifyContent: "space-between"
  },
  label:{
    fontWeight: "bold",
    flex:2
  },
  value:{
    flex: 3
  }
});
