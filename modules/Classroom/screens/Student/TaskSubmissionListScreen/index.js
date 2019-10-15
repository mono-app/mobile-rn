import React from "react";
import { View, FlatList, StyleSheet } from "react-native";
import { Text } from "react-native-paper";
import StudentListItem from "modules/Classroom/components/StudentListItem";
import AppHeader from "src/components/AppHeader";
import SubmissionAPI from "modules/Classroom/api/submission";
import { withCurrentStudent } from "modules/Classroom/api/student/CurrentStudent";

const INITIAL_STATE = { isRefreshing: true };

class TaskSubmissionListScreen extends React.PureComponent {
  static navigationOptions = () => {
    return {
      header:  null
    };
  };

  handleRefresh = () => this.loadSubmissions()

  loadSubmissions = async () => {
    if(this._isMounted)
      this.setState({ submissionList: [], isRefreshing: true });
    const submissionList = await SubmissionAPI.getSubmissions(this.props.currentSchool.id, this.classId, this.taskId);
    if(this._isMounted)
      this.setState({ submissionList, isRefreshing: false });
  }

  handleSubmissionPress = submission => {
    const payload = {
      schoolId: this.props.currentSchool.id,
      studentEmail: submission.id
    }
    this.props.navigation.navigate("StudentProfile", payload);
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
    this.handleRefresh = this.handleRefresh.bind(this);

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
            title="Lihat Pengumpulan"
            style={{ backgroundColor: "white" }}
          />
        <View style={styles.subjectContainer}>
          <Text style={{fontWeight: "bold", fontSize: 18}}>
            {this.title}
          </Text>
        </View>
        
        <FlatList
          style={{ backgroundColor: "white" }}
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
export default withCurrentStudent(TaskSubmissionListScreen)
