import React from "react";
import { View, FlatList, StyleSheet } from "react-native";
import { Text, Searchbar } from "react-native-paper";
import TaskAPI from "modules/Classroom/api/task";
import ArchiveListItem from "modules/Classroom/components/ArchiveListItem";
import AppHeader from "src/components/AppHeader";

const INITIAL_STATE = { isLoading: true, showSnackbarSuccessDeleting: false };

export default class ArchiveListScreen extends React.PureComponent {
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
    const taskList = await TaskAPI.getExpiredTasks(this.schoolId, this.classId);
    this.setState({ taskList });
  }

  handleTaskSubmissionPress = (task) => {
    const payload = {
      schoolId: this.schoolId,
      classId: this.classId,
      taskId: task.id,
      title: task.title,
      subject: this.subject,
      subjectDesc: this.subjectDesc
    }
    this.props.navigation.navigate(`TaskSubmissionList`, payload);
  }

  handleDiscussionPress = (task) => {
    const payload = {
      schoolId: this.schoolId,
      classId: this.classId,
      taskId: task.id,
      subject: this.subject,
      subjectDesc: this.subjectDesc
    }
    this.props.navigation.navigate(`Discussions`, payload);
  }

  constructor(props) {
    super(props);
    this.state = INITIAL_STATE;
    this.loadTasks = this.loadTasks.bind(this);
    this.schoolId = this.props.navigation.getParam("schoolId", "");
    this.classId = this.props.navigation.getParam("classId", "");
    this.subject = this.props.navigation.getParam("subject", "");
    this.subjectDesc = this.props.navigation.getParam("subjectDesc", "");
  }

  componentDidMount(){
    this.loadTasks();
  }

  render() {
    return (
      <View style={{ flex: 1, backgroundColor: "#E8EEE8" }}>
  
        <View style={{ margin: 16 }}>
          <Searchbar placeholder="Cari Tugas" />
        </View>
        <FlatList
          style={{ backgroundColor: "#E8EEE8" }}
          data={this.state.taskList}
          renderItem={({ item, index }) => {
            return (
              <ArchiveListItem 
                onSubmissionPress={() => this.handleTaskSubmissionPress(item)}
                onDiscussionPress={() => this.handleDiscussionPress(item)}
                key={index} task={item}/>
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
