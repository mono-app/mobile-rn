import React from "react";
import { View, FlatList, StyleSheet } from "react-native";
import { Searchbar, Text } from "react-native-paper";
import StudentListItem from "../../../components/StudentListItem";
import AppHeader from "src/components/AppHeader";
import SubmissionAPI from "../../../api/submission";

const INITIAL_STATE = { isLoading: true };

export default class TaskSubmissionListScreen extends React.PureComponent {
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
    const submissionList = await SubmissionAPI.getSubmissions(this.schoolId, this.classId, this.taskId);
    this.setState({ submissionList });
  }

  handleSubmissionPress = submission => {
    const payload = {
      schoolId: this.schoolId,
      studentEmail: submission.id
    }
    this.props.navigation.navigate("StudentProfile", payload);
  }

  constructor(props) {
    super(props);
    this.state = INITIAL_STATE;
    this.loadSubmissions = this.loadSubmissions.bind(this);
    this.handleSubmissionPress = this.handleSubmissionPress.bind(this);
    this.schoolId = this.props.navigation.getParam("schoolId", "");
    this.classId = this.props.navigation.getParam("classId", "");
    this.taskId = this.props.navigation.getParam("taskId", "");
    this.title = this.props.navigation.getParam("title", "");
    this.subject = this.props.navigation.getParam("subject", "");
    this.subjectDesc = this.props.navigation.getParam("subjectDesc", "");
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
          renderItem={({ item, index }) => {
            return (
              <StudentListItem 
                onPress={() => this.handleSubmissionPress(item)}
                key={index} schoolId={this.schoolId} student={item}/>
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
