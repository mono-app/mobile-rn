import React from "react";
import { View, StyleSheet } from "react-native";
import { Text, Snackbar } from "react-native-paper";
import SubmissionAPI from "modules/Classroom/api/submission";
import StudentAPI from "modules/Classroom/api/student";
import ClassAPI from "modules/Classroom/api/class";
import TaskAPI from "modules/Classroom/api/task";
import AppHeader from "src/components/AppHeader";
import { TouchableOpacity, ScrollView } from "react-native-gesture-handler";
import { default as EvilIcons } from "react-native-vector-icons/EvilIcons";

const INITIAL_STATE = { isLoading: true,schoolId: "1hZ2DiIYSFa5K26oTe75", showSnackbarScoringSuccess: false, submission:{}, class_:{}, task: {}, score: null };

export default class ScoreDetailsScreen extends React.PureComponent {
  static navigationOptions = ({ navigation }) => {
    return {
      header: (
        <AppHeader
          navigation={navigation}
          title="Lihat Nilai"
          style={{ backgroundColor: "transparent" }}
        />
      )
    };
  };

  loadSubmission = async () => {

    const promises = [ SubmissionAPI.getDetail(this.state.schoolId, this.classId, this.taskId, this.submissionId),
      StudentAPI.getDetail(this.state.schoolId,this.submissionId),
      ClassAPI.getDetail(this.state.schoolId,this.classId),
      new TaskAPI().getDetail(this.state.schoolId,this.classId,this.taskId),
    ];

    Promise.all(promises).then(results => {
      const submission = results[0];
      const people = results[1];
      const class_ = results[2];
      const task = results[3];
      const { name, noInduk } = people  
      let studentInfo = name

      if(noInduk){
        studentInfo = noInduk+" / "+name
      }else{
        studentInfo = "- / "+name
      }

      this.setState({ studentInfo, submission, class_, task, score: submission.score });
    })
  }

  handleOtherScoring = () => {
    const payload = {
      schoolId: this.state.schoolId,
      classId: this.classId,
      taskId: this.taskId,
      title: this.title
    }

    this.props.navigation.navigate(`TaskSubmissionList`, payload);
  }

  constructor(props) {
    super(props);
    this.state = INITIAL_STATE;
    this.loadSubmission = this.loadSubmission.bind(this);
    this.handleOtherScoring = this.handleOtherScoring.bind(this);
    this.classId = this.props.navigation.getParam("classId", "");
    this.taskId = this.props.navigation.getParam("taskId", "");
    this.submissionId = this.props.navigation.getParam("submissionId", "");
    this.title = this.props.navigation.getParam("title", "");
 
  }

  componentDidMount(){
    this.loadSubmission();
  }

  render() {
    return (
        <ScrollView>
          <View style={{ flex: 1, backgroundColor: "#E8EEE8" }}>
            <TouchableOpacity  onPress={this.handleOtherScoring} style={{marginTop: 16}}>
              <View style={styles.listItemContainer}>
                <View style={styles.listDescriptionContainer}>
                  <Text style={[styles.label, {fontWeight: "bold", fontSize: 18}]}>Beri Penilaian Lainnya</Text>

                  <View style={{flexDirection:"row",textAlign: "right"}}>
                    <EvilIcons name="chevron-right" size={24} style={{ color: "#5E8864" }}/>
                  </View>
                </View>
              </View>
            </TouchableOpacity>
           
            <View style={styles.subjectContainer}>
                <Text style={{fontWeight: "bold", fontSize: 18}}>
                  {this.state.studentInfo}
                </Text>
                <Text style={{fontSize: 16}}>
                  {this.title}
                </Text>
            </View>
            <View style={{marginTop: 16}}>
              <View style={styles.listItemContainer}>
                <View style={styles.listDescriptionContainer}>
                  <Text style={styles.label}>Mata Pelajaran</Text>
                  <View style={{flexDirection:"row",textAlign: "right"}}>
                    <Text>{this.state.class_.subject}</Text>
                  </View>
                </View>
              </View>
              <View style={styles.listItemContainer}>
                <View style={styles.listDescriptionContainer}>
                  <Text style={styles.label}>Kelas</Text>
                  <View style={{flexDirection:"row",textAlign: "right"}}>
                    <Text>{this.state.class_.room}</Text>
                  </View>
                </View>
              </View>
              <View style={styles.listItemContainer}>
                <View style={styles.listDescriptionContainer}>
                  <Text style={styles.label}>Tahun Pelajaran</Text>
                  <View style={{flexDirection:"row",textAlign: "right"}}>
                    <Text>{this.state.class_.academicYear}</Text>
                  </View>
                </View>
              </View>
              <View style={styles.listItemContainer}>
                <View style={styles.listDescriptionContainer}>
                  <Text style={styles.label}>Semester</Text>
                  <View style={{flexDirection:"row",textAlign: "right"}}>
                    <Text>{this.state.class_.semester}</Text>
                  </View>
                </View>
              </View>
              <View style={styles.listItemContainer}>
                <View style={styles.listDescriptionContainer}>
                  <Text style={[styles.label, {color: "#0ead69"}]}>Total nilai</Text>
                  <View style={{flexDirection:"row",textAlign: "right"}}>
                    <Text style={{color: "#0ead69"}}>{this.state.submission.score}</Text>
                  </View>
                </View>
              </View>
              <View style={styles.listItemContainer}>
                <View style={styles.listDescriptionContainer}>
                  <Text style={styles.label}>Note</Text>
                  <View style={styles.value}>
                    <Text>{this.state.submission.note}</Text>
                  </View>
                </View>
              </View>
           
            </View>
          </View>
        </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  subjectContainer:{
    marginTop: 16,
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
