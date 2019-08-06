import React from "react";
import { View, StyleSheet } from "react-native";
import { Text } from "react-native-paper";
import SubmissionAPI from "../../../api/submission";
import StudentAPI from "../../../api/student";
import ClassAPI from "../../../api/class";
import TaskAPI from "../../../api/task";
import AppHeader from "src/components/AppHeader";
import moment from "moment"
import { TouchableOpacity, ScrollView } from "react-native-gesture-handler";
import { default as EvilIcons } from "react-native-vector-icons/EvilIcons";

const INITIAL_STATE = { isLoading: true,schoolId: "1hZ2DiIYSFa5K26oTe75", submission:{}, class_:{}, task: {}, score: null };

export default class SubmissionDetailsScreen extends React.PureComponent {
  static navigationOptions = ({ navigation }) => {
    return {
      header: (
        <AppHeader
          navigation={navigation}
          title="Nilai Tugas"
          style={{ backgroundColor: "transparent" }}
        />
      )
    };
  };

  loadSubmission = async () => {
    const submission = await SubmissionAPI.getDetail(this.state.schoolId, this.classId, this.taskId, this.submissionId);

    const promises = [ SubmissionAPI.getDetail(this.state.schoolId, this.classId, this.taskId, this.submissionId),
      StudentAPI.getDetail(this.state.schoolId,this.submissionId),
      new ClassAPI().getDetail(this.state.schoolId,this.classId),
      new TaskAPI().getDetail(this.state.schoolId,this.classId,this.taskId),
    ];

    Promise.all(promises).then(results => {
      const submission = results[0];
      const people = results[1];
      const class_ = results[2];
      const task = results[3];
      console.log(class_)
      console.log(task)
      const { name, noInduk } = people  
      let studentInfo = name

      if(noInduk){
        studentInfo = noInduk+" / "+name
      }else{
        studentInfo = "- / "+name
      }

      this.setState({ studentInfo, submission, class_, task });
    })
  }

  handleScoringPress = ()=>{
    payload = {
      schoolId: this.state.schoolId,
      classId: this.classId,
      taskId: this.taskId,
      submissionId: this.submissionId,
      onRefresh: (score) => {this.setState({score})}
    }
    this.props.navigation.navigate("SubmissionScoring", payload)
  }

  constructor(props) {
    super(props);
    this.state = INITIAL_STATE;
    this.loadSubmission = this.loadSubmission.bind(this);
    this.handleScoringPress = this.handleScoringPress.bind(this);
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
        <View style={{ flex: 1, backgroundColor: "#E8EEE8", paddingBottom:16 }}>
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
          </View>

          <View style={{marginTop: 16, paddingTop:8 ,backgroundColor:"#fff"}}>
            <Text style={{marginHorizontal:16, paddingBottom:4,fontWeight:"bold",color:"grey", borderBottomWidth: 1, borderBottomColor: "#E8EEE8"}}>Info Pengumpulan Tugas</Text>

            <View style={styles.listItemContainer}>
              <View style={styles.listDescriptionContainer}>
                <Text style={styles.label}>Tanggal Pengumpulan</Text>
                <View style={{flexDirection:"row",textAlign: "right"}}>
                  <Text>{(this.state.task.dueDate)?moment(this.state.task.dueDate.seconds * 1000).format("DD MMMM YYYY"):""}</Text>
                </View>
              </View>
            </View>
            <View style={styles.listItemContainer}>
              <View style={styles.listDescriptionContainer}>
                <Text style={styles.label}>Jam Pengumpulan</Text>
                <View style={{flexDirection:"row",textAlign: "right"}}>
                  <Text>{(this.state.task.dueDate)?moment(this.state.task.dueDate.seconds * 1000).format("HH:mm"):""}</Text>
                </View>
              </View>
            </View>
            <TouchableOpacity onPress={this.handleScoringPress}>
              <View style={styles.listItemContainer}>
                <View style={styles.listDescriptionContainer}>
                  <Text style={styles.label}>Beri Penilaian</Text>
                  <View style={{flexDirection:"row",textAlign: "right"}}>
                    <Text>{(this.state.score)?this.state.score:""}</Text>
                    <EvilIcons name="chevron-right" size={24} style={{ color: "#5E8864" }}/>
                  </View>
                </View>
              </View>
            </TouchableOpacity>
            <TouchableOpacity>
              <View style={styles.listItemContainer}>
                <View style={styles.listDescriptionContainer}>
                  <Text style={styles.label}>Unduh Tugas</Text>
                  <View style={{flexDirection:"row",textAlign: "right"}}>
                    <EvilIcons name="chevron-right" size={24} style={{ color: "#5E8864" }}/>
                  </View>
                </View>
              </View>
            </TouchableOpacity>
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
