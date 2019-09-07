import React from "react";
import { View, FlatList } from "react-native";
import MySearchbar from "src/components/MySearchbar"
import TaskAPI from "modules/Classroom/api/task";
import ArchiveListItem from "modules/Classroom/components/ArchiveListItem";
import AppHeader from "src/components/AppHeader";
import { withCurrentTeacher } from "modules/Classroom/api/teacher/CurrentTeacher";

const INITIAL_STATE = { isLoading: true, showSnackbarSuccessDeleting: false, taskList: [], filteredTaskList: [] };

class TaskArchiveListScreen extends React.PureComponent {
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
    if(this._isMounted)
      this.setState({ taskList: [] });
    const taskList = await TaskAPI.getExpiredTasks(this.props.currentSchool.id, this.classId);
    if(this._isMounted)
     this.setState({ taskList, filteredTaskList: taskList });
  }

  handleTaskSubmissionPress = (task) => {
    const payload = {
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
      schoolId: this.props.currentSchool.id,
      classId: this.classId,
      taskId: task.id,
      subject: this.subject,
      subjectDesc: this.subjectDesc
    }
    this.props.navigation.navigate(`Discussions`, payload);
  }

  handleSearchPress = (searchText) => {
    this.setState({filteredTaskList: []})

    const clonedTaskList = JSON.parse(JSON.stringify(this.state.taskList))
    const newSearchText = JSON.parse(JSON.stringify(searchText)) 
    if(searchText){
      const filteredTaskList = clonedTaskList.filter((task) => {
        return (task.title.toLowerCase().indexOf(newSearchText.toLowerCase()) >= 0)
      })
      this.setState({filteredTaskList})
    } else {
      this.setState({filteredTaskList: clonedTaskList})
    }
  }

  constructor(props) {
    super(props);
    this.state = INITIAL_STATE;
    this._isMounted = null
    this.classId = this.props.navigation.getParam("classId", "");
    this.subject = this.props.navigation.getParam("subject", "");
    this.subjectDesc = this.props.navigation.getParam("subjectDesc", "");
    this.loadTasks = this.loadTasks.bind(this);
    this.handleSearchPress = this.handleSearchPress.bind(this);
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
  
        <View style={{ margin: 16 }}>
          <MySearchbar 
            onSubmitEditing={this.handleSearchPress}
            placeholder="Cari Tugas" />
        </View>
        <FlatList
          style={{ backgroundColor: "#E8EEE8" }}
          data={this.state.filteredTaskList}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => {
            return (
              <ArchiveListItem 
                onSubmissionPress={() => this.handleTaskSubmissionPress(item)}
                onDiscussionPress={() => this.handleDiscussionPress(item)}
                task={item}/>
            )
          }}
        />
      </View>
    );
  }
}

export default withCurrentTeacher(TaskArchiveListScreen)
