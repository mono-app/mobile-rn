import React from "react";
import { View, FlatList, StyleSheet } from "react-native";
import { Text, Snackbar } from "react-native-paper";
import TaskAPI from "modules/Classroom/api/task";
import TaskListItem from "../../../components/TaskListItem";
import AppHeader from "src/components/AppHeader";
import { TouchableOpacity } from "react-native-gesture-handler";

const INITIAL_STATE = { isLoading: true, showSnackbarSuccessDeleting: false };

export default class TaskListScreen extends React.PureComponent {
  static navigationOptions = ({ navigation }) => {
    return {
      header: (
        <AppHeader
          navigation={navigation}
          title={navigation.getParam("subject", "")}
          subtitle={navigation.getParam("subjectDesc", "")}
          style={{ backgroundColor: "transparent" }}
        />
      )
    };
  };

  loadTasks = async () => {
    this.setState({ taskList: [] });

    const taskList = await TaskAPI.getActiveTasks(this.schoolId, this.classId);
    this.setState({ taskList });
  }

  handleAddTaskPress = () => {
    payload = {
      schoolId: this.schoolId,
      classId: this.classId,
      subject: this.subject,
      subjectDesc: this.subjectDesc
    }
    this.props.navigation.navigate("AddTask",payload);
  }

  handleClassPress = (item) => {
    payload = {
      schoolId: this.schoolId,
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
    this.schoolId = this.props.navigation.getParam("schoolId", "");
    this.classId = this.props.navigation.getParam("classId", "");
    this.subject = this.props.navigation.getParam("subject", "");
    this.subjectDesc = this.props.navigation.getParam("subjectDesc", "");
    this.loadTasks = this.loadTasks.bind(this);
    this.handleAddTaskPress = this.handleAddTaskPress.bind(this);
    this.handleClassPress = this.handleClassPress.bind(this);
  }

  componentDidMount(){
    this.loadTasks();
  }

  render() {
    return (
      <View style={{ flex: 1, backgroundColor: "#E8EEE8" }}>
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

const styles = StyleSheet.create({
  listItemContainer: {
    padding: 16,
    flexDirection: "row",
    justifyContent: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#E8EEE8"
  }
});
