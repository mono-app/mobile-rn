import React from "react";
import { View, StyleSheet } from "react-native";
import { ActivityIndicator, Dialog, Text, Caption, Snackbar } from "react-native-paper";
import TaskAPI from "modules/Classroom/api/task";
import SubmissionAPI from "modules/Classroom/api/submission";
import DiscussionAPI from "modules/Classroom/api/discussion";
import AppHeader from "src/components/AppHeader";
import moment from "moment"
import { TouchableOpacity, ScrollView } from "react-native-gesture-handler";
import { default as EvilIcons } from "react-native-vector-icons/EvilIcons";
import DeleteDialog from "src/components/DeleteDialog";
import { default as FontAwesome } from "react-native-vector-icons/FontAwesome";
import Button from "src/components/Button";
import { withCurrentTeacher } from "modules/Classroom/api/teacher/CurrentTeacher";
import { withTranslation } from 'react-i18next';

const INITIAL_STATE = { isFetching: true, isDeleting: false ,task:{}, showSnackbarFailDeleting: false, totalSubmission: 0, totalDiscussion: 0 };

class TaskDetailsScreen extends React.PureComponent {
  static navigationOptions = () => {
    return {
      header: null
    };
  };

  loadTask = async () => {
    if(this._isMounted)
      this.setState({ isFetching: true});
    const api = new TaskAPI();
    const task = await api.getDetail(this.props.currentSchool.id, this.classId, this.taskId);
    const totalSubmission = await SubmissionAPI.getTotalSubmission(this.props.currentSchool.id, this.classId, this.taskId);
    const totalDiscussion = await DiscussionAPI.getTotalDiscussion(this.props.currentSchool.id, this.classId, this.taskId);
    if(this._isMounted)
      this.setState({ isFetching: false, task, totalSubmission, totalDiscussion });
  }

  handleNamePress = e => {
    const payload = {
      schoolId: this.props.currentSchool.id,
      classId: this.classId,
      taskId: this.taskId,
      databaseFieldName: "title", 
      fieldValue: this.state.task.title,
      fieldTitle: this.props.t("editTaskName"),
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
      schoolId: this.props.currentSchool.id,
      classId: this.classId,
      taskId: this.taskId,
      databaseFieldName: "dueDate", 
      fieldValue: this.state.task.dueDate.toDate(),
      fieldTitle: this.props.t("editSubmissionDate"),
      onRefresh: this.loadTask  
    }
    this.props.navigation.navigate(`EditTaskSingleField`, payload);
  } 

  handleDueTimePress = e => {
    const payload = {
      isDatetimePicker: true,
      pickerType: "time",
      schoolId: this.props.currentSchool.id,
      classId: this.classId,
      taskId: this.taskId,
      databaseFieldName: "dueDate", 
      fieldValue: this.state.task.dueDate.toDate(),
      fieldTitle: this.props.t("editSubmissionTime"),
      onRefresh: this.loadTask  
    }
    this.props.navigation.navigate(`EditTaskSingleField`, payload);
  } 

  handleDetailPress = e => {
    const payload = {
      isMultiline: true,
      schoolId: this.props.currentSchool.id,
      classId: this.classId,
      taskId: this.taskId,
      databaseFieldName: "details", 
      fieldValue: this.state.task.details,
      fieldTitle: this.props.t("editTaskInformation"),
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
      schoolId: this.props.currentSchool.id,
      classId: this.classId,
      taskId: this.taskId,
      subject: this.subject,
      subjectDesc: this.subjectDesc
    }
    this.props.navigation.navigate(`Discussions`, payload);
  }

  handleDelete = async () => {
    this.setState({isDeleting: true})
    this.deleteDialog.toggleShow()
    const total = await SubmissionAPI.getTotalSubmission(this.props.currentSchool.id, this.classId, this.taskId);
    
    if(total===0){
      await TaskAPI.deleteTask(this.props.currentSchool.id, this.classId, this.taskId);
      const { navigation } = this.props;
      navigation.state.params.onDeleteSuccess();
      navigation.goBack();   
    }else{
      this.setState({showSnackbarFailDeleting: true});
    }
    this.setState({isDeleting: false})
  }

  constructor(props) {
    super(props);
    this.state = INITIAL_STATE;
    this._isMounted = null
    this.deleteDialog = null;
    this.classId = this.props.navigation.getParam("classId", "");
    this.taskId = this.props.navigation.getParam("taskId", "");
    this.subject = this.props.navigation.getParam("subject", "");
    this.subjectDesc = this.props.navigation.getParam("subjectDesc", "");
    this.handleNamePress = this.handleNamePress.bind(this);
    this.handleDetailPress = this.handleDetailPress.bind(this);
    this.handleTaskSubmissionPress = this.handleTaskSubmissionPress.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
    this.loadTask = this.loadTask.bind(this);
  }


  componentDidMount(){
    this._isMounted = true
    this.loadTask();
  }
  
  componentWillUnmount() {
    this._isMounted = false;
  }

  render() {
    if(this.state.isFetching){
      return (
        <Dialog visible={true}>
          <Dialog.Content style={{ flexDirection: "row", justifyContent: "space-evenly" }}>
            <ActivityIndicator/>
            <View>
              <Text>{this.props.t("loadData")}</Text>
              <Caption>{this.props.t("pleaseWait")}</Caption>
            </View>
          </Dialog.Content>
        </Dialog>
      )
    }

    return (
      <View style={{flex: 1}}>
        <AppHeader
          navigation={this.props.navigation}
          title={this.props.t("taskDetails")}
          style={{ backgroundColor: "white" }}
        />
        <ScrollView >
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
                  <Text style={styles.label}>{this.props.t("taskName")}</Text>
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
                  <Text style={styles.label}>{this.props.t("dueDate")}</Text>   
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
                  <Text style={styles.label}>{this.props.t("dueTime")}</Text>
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
                  <Text style={styles.label}>{this.props.t("taskDetails")}</Text>
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
                  <View style={{flexDirection:"row"}}>
                    <FontAwesome name="file-o" size={24} style={{marginRight:16, width: 30}}/>
                    <Text>{this.props.t("seeSubmissions")}</Text>
                  </View>
                  <View style={{flexDirection:"row",textAlign: "right"}}>
                    <Text>{this.state.totalSubmission}</Text>
                    <EvilIcons name="chevron-right" size={24} style={{ color: "#5E8864" }}/>
                  </View>
                </View>
              </View>
            </TouchableOpacity>
            <View style={{marginTop: 8}}/>

            <TouchableOpacity  onPress={this.handleDiscussionPress}>
              <View style={styles.listItemContainer}>
                <View style={styles.listDescriptionContainer}>
                  <View style={{flexDirection:"row"}}>
                    <FontAwesome name="comments-o" size={24} style={{marginRight:16, width: 30}}/>
                    <Text>{this.props.t("discussion")}</Text>
                  </View>
                  <View style={{flexDirection:"row",textAlign: "right"}}>
                    <Text>{this.state.totalDiscussion}</Text>
                    <EvilIcons name="chevron-right" size={24} style={{ color: "#5E8864" }}/>
                  </View>
                </View>
              </View>
            </TouchableOpacity>
            <Button
                text={this.props.t("deleteTask")}
                isLoading={this.state.isDeleting}
                disabled={this.state.isDeleting}
                style={{backgroundColor:"#EF6F6C", padding: 12, margin:16, borderRadius:8 }}
                onPress={() => {this.deleteDialog.toggleShow()}}
            />
            
            
          </View>
        </ScrollView>
        <DeleteDialog 
        ref ={i => this.deleteDialog = i}
        title= {this.props.t("askDeleteTask")}
        onDeletePress={this.handleDelete}/>
        <Snackbar
          visible= {this.state.showSnackbarFailDeleting}
          onDismiss={() => this.setState({ showSnackbarFailDeleting: false })}
          style={{backgroundColor:"#EF6F6C"}}
          duration={Snackbar.DURATION_SHORT}>
          {this.props.t("failDeleteTask")}
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
export default withTranslation()(withCurrentTeacher(TaskDetailsScreen))
