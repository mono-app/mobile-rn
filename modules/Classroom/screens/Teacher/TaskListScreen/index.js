import React from "react";
import { View, FlatList, StyleSheet } from "react-native";
import { Text } from "react-native-paper";
import TaskAPI from "../../../api/task";
import TaskListItem from "../../../components/TaskListItem";
import AppHeader from "src/components/AppHeader";
import TeacherAPI from "modules/Classroom/api/teacher";
import { TouchableOpacity } from "react-native-gesture-handler";

const INITIAL_STATE = { isLoading: true,schoolId: "1hZ2DiIYSFa5K26oTe75" };

export default class TaskListScreen extends React.PureComponent {
  static navigationOptions = ({ navigation }) => {
    return {
      header: (
        <AppHeader
          navigation={navigation}
          title="Daftar Tugas"
          style={{ backgroundColor: "transparent" }}
        />
      )
    };
  };

  loadTasks = async () => {
    const taskList = await TaskAPI.getTasks(this.state.schoolId, this.classId);
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
      subjectDesc: this.subjectDesc
    }
    this.props.navigation.navigate("TaskDetails", payload);
  }

  constructor(props) {
    super(props);
    this.state = INITIAL_STATE;
    this.loadTasks = this.loadTasks.bind(this);
    this.classId = this.props.navigation.getParam("classId", "");
    this.subject = this.props.navigation.getParam("subject", "");
    this.subjectDesc = this.props.navigation.getParam("subjectDesc", "");
    this.handleAddTaskPress = this.handleAddTaskPress.bind(this);
    this.handleClassPress = this.handleClassPress.bind(this);
  }

  componentDidMount(){
    this.loadTasks();
  }

  render() {
    return (
      <View style={{ flex: 1, backgroundColor: "#E8EEE8" }}>
        <View style={{marginTop: 8,
                      backgroundColor: "#fff",
                      flexDirection: "row",
                      padding: 16,
                      alignItems: "center"}}>
          <View style={styles.listDescriptionContainer}>
              <Text style={[styles.label, {fontWeight: "bold"}]}>
                {this.subject}
              </Text>
              <Text style={styles.label}>
                {this.subjectDesc}
              </Text>
          </View>
        </View>
        <View style={{marginTop: 8,
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
          renderItem={({ item, index }) => {
            return (
              <TaskListItem 
                onPress={() => this.handleClassPress(item)}
                key={index} autoFetch={true} classId={this.classId} taskId={item.id}/>
            )
          }}
        />
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
