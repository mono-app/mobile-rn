import React from "react";
import { View, FlatList, StyleSheet } from "react-native";
import { Text, Snackbar } from "react-native-paper";
import TaskAPI from "modules/Classroom/api/task";
import TaskListItem from "modules/Classroom/components/TaskListItem";
import AppHeader from "src/components/AppHeader";
import { withCurrentStudent } from "modules/Classroom/api/student/CurrentStudent";
import { withTranslation } from 'react-i18next';

const INITIAL_STATE = { isRefreshing: true, showSnackbarSuccessDeleting: false, taskList: [] };

class TaskListScreen extends React.PureComponent {
  static navigationOptions = () => {
    return {
      header: null
    };
  };

  handleRefresh = () => this.loadTasks()

  loadTasks = async () => {
    if(this._isMounted)
      this.setState({ taskList: [], isRefreshing: true });

    const taskList = await TaskAPI.getActiveTasks(this.props.currentSchool.id, this.classId);
    if(this._isMounted)
      this.setState({ taskList, isRefreshing: false });
  }

  handleTaskPress = (item) => {
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
    this._isMounted = null
    this.loadTasks = this.loadTasks.bind(this);
    this.classId = this.props.navigation.getParam("classId", "");
    this.subject = this.props.navigation.getParam("subject", "");
    this.subjectDesc = this.props.navigation.getParam("subjectDesc", "");
    this.handleTaskPress = this.handleTaskPress.bind(this);
    this.handleRefresh = this.handleRefresh.bind(this);

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
            title={this.props.t("taskList")}
            style={{ backgroundColor: "white" }}
          />
        <View style={{marginTop: 16,
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
        {(this.state.taskList.length===0)?<Text style={{marginTop:16, textAlign:"center"}}>{this.props.t("listEmpty")}</Text>:null}
        <View style={{marginTop: 16}}/>
        <FlatList
          style={{ backgroundColor: "#E8EEE8" }}
          data={this.state.taskList}
          refreshing={this.state.isRefreshing} 
          onRefresh={this.handleRefresh} 
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => {
            return (
              <TaskListItem 
                onPress={() => this.handleTaskPress(item)}
                task={item}/>
            )
          }}
        />
        <Snackbar
          visible= {this.state.showSnackbarSuccessDeleting}
          onDismiss={() => this.setState({ showSnackbarSuccessDeleting: false })}
          style={{backgroundColor:"#0ead69"}}
          duration={Snackbar.DURATION_SHORT}>
          {this.props.t("deleteTaskSuccess")}
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
export default withTranslation()(withCurrentStudent(TaskListScreen))
