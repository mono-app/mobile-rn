import React from "react";
import { View, FlatList, StyleSheet } from "react-native";
import { Text, Snackbar } from "react-native-paper";
import TaskAPI from "modules/Classroom/api/task";
import TaskListItem from "../../../components/TaskListItem";
import AppHeader from "src/components/AppHeader";
import { TouchableOpacity } from "react-native-gesture-handler";

const INITIAL_STATE = { isLoading: true, schoolId: "1hZ2DiIYSFa5K26oTe75", showSnackbarSuccessDeleting: false };

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
    this.setState({ taskList: [] });

    const taskList = await TaskAPI.getTasks(this.state.schoolId, this.classId);
    this.setState({ taskList });
  }

 

  handleClassPress = (item) => {
    payload = {
      taskId: item.id,
      classId: this.classId,
      subject: this.subject,
      subjectDesc: this.subjectDesc,
      onDeleteSuccess: () => {this.loadTasks; this.setState({showSnackbarSuccessDeleting: true})}
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
       
        <View style={{marginTop: 16}}/>
        <FlatList
          style={{ backgroundColor: "#E8EEE8" }}
          data={this.state.taskList}
          renderItem={({ item, index }) => {
            return (
              <TaskListItem 
                onPress={() => this.handleClassPress(item)}
                key={index} task={item}/>
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
