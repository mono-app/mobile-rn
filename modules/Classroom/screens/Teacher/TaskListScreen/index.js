import React from "react";
import { View, FlatList, StyleSheet } from "react-native";
import { Text, Snackbar } from "react-native-paper";
import TaskAPI from "modules/Classroom/api/task";
import TaskListItem from "modules/Classroom/components/TaskListItem";
import AppHeader from "src/components/AppHeader";
import { TouchableOpacity } from "react-native-gesture-handler";
import { withCurrentTeacher } from "modules/Classroom/api/teacher/CurrentTeacher";

const INITIAL_STATE = { isLoading: true, showSnackbarSuccessDeleting: false };

class TaskListScreen extends React.PureComponent {
  static navigationOptions = () => {
    return {
      header: null
    };
  };

  loadTasks = async () => {
    if(this._isMounted)
      this.setState({ taskList: [] });

    const taskList = await TaskAPI.getActiveTasks(this.props.currentSchool.id, this.classId);
    if(this._isMounted)
      this.setState({ taskList });
  }

  handleAddTaskPress = () => {
    payload = {
      classId: this.classId,
      subject: this.subject,
      subjectDesc: this.subjectDesc
    }
    this.props.navigation.navigate("AddTask",payload);
  }

  handleClassPress = (item) => {
    payload = {
      taskId: item.id,
      classId: this.classId,
      subject: this.subject,
      subjectDesc: this.subjectDesc,
      onDeleteSuccess: () => {
        this.loadTasks()
        this.setState({showSnackbarSuccessDeleting: true})
        }
    }
    this.props.navigation.navigate("TaskDetails", payload);
  }

  constructor(props) {
    super(props);
    this.state = INITIAL_STATE;
    this._isMounted = null
    this.classId = this.props.navigation.getParam("classId", "");
    this.subject = this.props.navigation.getParam("subject", "");
    this.subjectDesc = this.props.navigation.getParam("subjectDesc", "");
    this.loadTasks = this.loadTasks.bind(this);
    this.handleAddTaskPress = this.handleAddTaskPress.bind(this);
    this.handleClassPress = this.handleClassPress.bind(this);
  }

  componentDidMount(){
    this._isMounted = true
    this.loadTasks();
  }
  
  componentWillUnmount() {
    this._isMounted = false;
  }

  render() {
    return (
      <View style={{ flex: 1, backgroundColor: "#E8EEE8" }}>
        <AppHeader
            navigation={this.props.navigation}
            title={this.props.navigation.getParam("subject", "")}
            subtitle={this.props.navigation.getParam("subjectDesc", "")}
            style={{ backgroundColor: "white" }}
          />
        <View style={{marginTop: 16,
                      backgroundColor: "#DCDCDC",
                      padding: 16}}>
          <TouchableOpacity onPress={this.handleAddTaskPress}>
            <Text style={{fontWeight:"bold"}}>
              + Tambah Tugas
            </Text>
          </TouchableOpacity>
        </View>
        <View style={{marginTop: 16}}/>
        <FlatList
          style={{ backgroundColor: "#E8EEE8" }}
          data={this.state.taskList}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => {
            return (
              <TaskListItem 
                onPress={() => this.handleClassPress(item)}
                task={item}/>
            )
          }}
        />
        <Snackbar
          visible= {this.state.showSnackbarSuccessDeleting}
          onDismiss={() => this.setState({ showSnackbarSuccessDeleting: false })}
          style={{backgroundColor:"#0ead69"}}
          duration={Snackbar.DURATION_SHORT}>
          Tugas Berhasil Dihapus
        </Snackbar>
      </View>
    );
  }
}
export default withCurrentTeacher(TaskListScreen)
