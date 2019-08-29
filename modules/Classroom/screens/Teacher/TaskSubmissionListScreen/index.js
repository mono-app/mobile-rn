import React from "react";
import { View, FlatList, StyleSheet } from "react-native";
import { Text } from "react-native-paper";
import StudentListItem from "modules/Classroom/components/StudentListItem";
import AppHeader from "src/components/AppHeader";
import SubmissionAPI from "modules/Classroom/api/submission";
import { withCurrentTeacher } from "modules/Classroom/api/teacher/CurrentTeacher";

const INITIAL_STATE = { isLoading: true };

class TaskSubmissionListScreen extends React.PureComponent {
  static navigationOptions = ({ navigation }) => {
    return {
      header: (
        <AppHeader
          navigation={navigation}
          title="Lihat Pengumpulan"
          style={{ backgroundColor: "transparent" }}
        />
      )
    };
  };

  loadSubmissions = async () => {
    const submissionList = await SubmissionAPI.getSubmissions(this.props.currentSchool.id, this.classId, this.taskId);
    this.setState({ submissionList });
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
    this.classId = this.props.navigation.getParam("classId", "");
    this.taskId = this.props.navigation.getParam("taskId", "");
    this.title = this.props.navigation.getParam("title", "");
    this.subject = this.props.navigation.getParam("subject", "");
    this.subjectDesc = this.props.navigation.getParam("subjectDesc", "");
    this.loadSubmissions = this.loadSubmissions.bind(this);
    this.handleSubmissionPress = this.handleSubmissionPress.bind(this);
  }

  componentDidMount(){
    this.loadSubmissions();
  }

  render() {
    return (
      <View style={{ flex: 1, backgroundColor: "#E8EEE8" }}>
        <View style={styles.subjectContainer}>
          <Text style={{fontWeight: "bold", fontSize: 18}}>
            {this.title}
          </Text>
        </View>
        
        <FlatList
          style={{ backgroundColor: "white" }}
          data={this.state.submissionList}
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
export default withCurrentTeacher(TaskSubmissionListScreen)
