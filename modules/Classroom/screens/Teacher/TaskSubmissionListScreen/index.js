import React from "react";
import { View, FlatList, StyleSheet } from "react-native";
import { Text } from "react-native-paper";
import StudentListItem from "modules/Classroom/components/StudentListItem";
import AppHeader from "src/components/AppHeader";
import SubmissionAPI from "modules/Classroom/api/submission";
import { withCurrentTeacher } from "modules/Classroom/api/teacher/CurrentTeacher";
import { withTranslation } from 'react-i18next';

const INITIAL_STATE = { isRefreshing: true, submissionList: [] };

class TaskSubmissionListScreen extends React.PureComponent {
  static navigationOptions = () => {
    return {
      header: null
    };
  };

  handleRefresh = () => this.loadSubmissions()

  loadSubmissions = async () => {
    if(this._isMounted) this.setState({ submissionList: [], isRefreshing: true });
    const submissionList = await SubmissionAPI.getSubmissions(this.props.currentSchool.id, this.classId, this.taskId);
    if(this._isMounted) this.setState({ submissionList, isRefreshing: false });
  }

  handleSubmissionPress = submission => {
    const submissionId = submission.id;
    const payload = {
      classId: this.classId,
      taskId: this.taskId,
      submissionId: submissionId,
      title: this.title,
      subject: this.subject,
      subjectDesc: this.subjectDesc
    }

    this.props.navigation.navigate("SubmissionDetails", payload);
  }

  constructor(props) {
    super(props);
    this.state = INITIAL_STATE;
    this._isMounted = null
    this.classId = this.props.navigation.getParam("classId", "");
    this.taskId = this.props.navigation.getParam("taskId", "");
    this.title = this.props.navigation.getParam("title", "");
    this.subject = this.props.navigation.getParam("subject", "");
    this.subjectDesc = this.props.navigation.getParam("subjectDesc", "");
    this.loadSubmissions = this.loadSubmissions.bind(this);
    this.handleSubmissionPress = this.handleSubmissionPress.bind(this);
  }

  componentDidMount(){
    this._isMounted = true
    this.loadSubmissions();
  }
  
  componentWillUnmount() {
    this._isMounted = false;
  }

  render() {
    return (
      <View style={{ flex: 1, backgroundColor: "#E8EEE8" }}>
        <AppHeader
            navigation={this.props.navigation}
            title={this.props.t("seeSubmissions")}
            style={{ backgroundColor: "white" }}
          />
        <View style={styles.subjectContainer}>
          <Text style={{fontWeight: "bold", fontSize: 18}}>
            {this.title}
          </Text>
        </View>
        <View style={{ flex:1,marginTop:8, backgroundColor: "white" }}>
          {(!this.state.isRefreshing && this.state.submissionList.length===0)?<Text style={{marginTop:16, textAlign:"center"}}>{this.props.t("listEmpty")}</Text>:null}
          <FlatList
            data={this.state.submissionList}
            refreshing={this.state.isRefreshing} 
            onRefresh={this.handleRefresh} 
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => {
              return (
                <StudentListItem 
                  onPress={() => this.handleSubmissionPress(item)}
                  schoolId={this.props.currentSchool.id} student={item}/>
              )
            }}
          />
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  subjectContainer:{
    marginTop: 8,
    backgroundColor: "#fff",
    flexDirection: "column",
    padding: 16
  },
  listItemContainer: {
    padding: 16,
    flexDirection: "row",
    justifyContent: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#E8EEE8"
  }
});
export default withTranslation()(withCurrentTeacher(TaskSubmissionListScreen))
