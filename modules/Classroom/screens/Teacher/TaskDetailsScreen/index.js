import React from "react";
import { View, StyleSheet } from "react-native";
import { Text } from "react-native-paper";
import TaskAPI from "../../../api/task";
import AppHeader from "src/components/AppHeader";
import moment from "moment"
import { TouchableOpacity, ScrollView } from "react-native-gesture-handler";
import { default as EvilIcons } from "react-native-vector-icons/EvilIcons";

const INITIAL_STATE = { isLoading: true,schoolId: "1hZ2DiIYSFa5K26oTe75", task:{} };

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

  handleNamePress = e => {
    const payload = {
      schoolId: this.state.schoolId,
      classId: this.classId,
      taskId: this.taskId,
      databaseFieldName: "title", 
      fieldValue: this.state.task.title,
      fieldTitle: "Ubah Nama Tugas",
      onRefresh: (data) => {
        const newTask = JSON.parse(JSON.stringify(this.state.task));
        newTask.title = data;
        this.setState({task: newTask})
      }
    }
    this.props.navigation.navigate(`EditTaskSingleField`, payload);
  }

  handleDueDatePress = e => {
    const payload = {
      isDatetimePicker: true,
      pickerType: "date",
      schoolId: this.state.schoolId,
      classId: this.classId,
      taskId: this.taskId,
      databaseFieldName: "dueDate", 
      fieldValue: this.state.task.dueDate.toDate(),
      fieldTitle: "Ubah Tanggal Pengumpulan",
      onRefresh: this.loadTask  
    }
    this.props.navigation.navigate(`EditTaskSingleField`, payload);
  } 

  handleDueTimePress = e => {
    const payload = {
      isDatetimePicker: true,
      pickerType: "time",
      schoolId: this.state.schoolId,
      classId: this.classId,
      taskId: this.taskId,
      databaseFieldName: "dueDate", 
      fieldValue: this.state.task.dueDate.toDate(),
      fieldTitle: "Ubah Jam Pengumpulan",
      onRefresh: this.loadTask  
    }
    this.props.navigation.navigate(`EditTaskSingleField`, payload);
  } 

  handleDetailPress = e => {
    const payload = {
      isMultiline: true,
      schoolId: this.state.schoolId,
      classId: this.classId,
      taskId: this.taskId,
      databaseFieldName: "details", 
      fieldValue: this.state.task.details,
      fieldTitle: "Ubah Detail Tugas",
      onRefresh: (data) => {
        const newTask = JSON.parse(JSON.stringify(this.state.task));
        newTask.details = data;
        this.setState({task: newTask})
      }
    }
    this.props.navigation.navigate(`EditTaskSingleField`, payload);
  }

  handleTaskSubmissionPress = () => {
    const payload = {
      schoolId: this.state.schoolId,
      classId: this.classId,
      taskId: this.taskId,
      title: this.state.task.title
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

  handleDelete = () => {

  }

  constructor(props) {
    super(props);
    this.state = INITIAL_STATE;
    this.loadTask = this.loadTask.bind(this);
    this.classId = this.props.navigation.getParam("classId", "");
    this.taskId = this.props.navigation.getParam("taskId", "");
    this.subject = this.props.navigation.getParam("subject", "");
    this.subjectDesc = this.props.navigation.getParam("subjectDesc", "");
    this.handleNamePress = this.handleNamePress.bind(this);
    this.handleDetailPress = this.handleDetailPress.bind(this);
    this.handleTaskSubmissionPress = this.handleTaskSubmissionPress.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
  }



  componentDidMount(){
    this.loadTask();
  }

  render() {
    return (
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
          <TouchableOpacity  onPress={this.handleNamePress}>
            <View style={styles.listItemContainer}>
              <View style={styles.listDescriptionContainer}>
                <Text style={styles.label}>Nama Tugas</Text>
                <Text style={styles.value}>{this.state.task.title}</Text>
                <View style={{flexDirection:"row",textAlign: "right"}}>
                  <EvilIcons name="chevron-right" size={24} style={{ color: "#5E8864" }}/>
                </View>
              </View>
            </View>
          </TouchableOpacity>
          <TouchableOpacity  onPress={this.handleDueDatePress}>
            <View style={styles.listItemContainer}>
              <View style={styles.listDescriptionContainer}>
                <Text style={styles.label}>Tanggal Pengumpulan</Text>   
                <Text style={styles.value}>{(this.state.task.dueDate)?moment(this.state.task.dueDate.seconds * 1000).format("DD MMMM YYYY"):""}</Text>
                <View style={{flexDirection:"row",textAlign: "right"}}>
                  <EvilIcons name="chevron-right" size={24} style={{ color: "#5E8864" }}/>
                </View>
              </View>
            </View>
          </TouchableOpacity>
          <TouchableOpacity  onPress={this.handleDueTimePress}>
            <View style={styles.listItemContainer}>
              <View style={styles.listDescriptionContainer}>
                <Text style={styles.label}>Jam Pengumpulan</Text>
                <Text style={styles.value}>{(this.state.task.dueDate)?moment(this.state.task.dueDate.seconds * 1000).format("HH:mm"):""}</Text>
                <View style={{flexDirection:"row",textAlign: "right"}}>
                  <EvilIcons name="chevron-right" size={24} style={{ color: "#5E8864" }}/>
                </View>
              </View>
            </View>
          </TouchableOpacity>
          <TouchableOpacity  onPress={this.handleDetailPress}>
            <View style={styles.listItemContainer}>
              <View style={styles.listDescriptionContainer}>
                <Text style={styles.label}>Detail Tugas</Text>
                <Text style={styles.value}>{this.state.task.details}</Text>
                <View style={{flexDirection:"row",textAlign: "right"}}>
                  <EvilIcons name="chevron-right" size={24} style={{ color: "#5E8864" }}/>
                </View>
              </View>
            </View>
          </TouchableOpacity>
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

          <TouchableOpacity onPress={this.handleDelete}>
            <View style={{backgroundColor:"#EF6F6C", padding: 12, margin:16, borderRadius:8 }}>
                <Text style={{alignSelf: "center",alignItems:"center", color: "#fff"}}>Hapus Tugas</Text>
            </View>
          </TouchableOpacity>
          
        </View>
      </ScrollView>
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
