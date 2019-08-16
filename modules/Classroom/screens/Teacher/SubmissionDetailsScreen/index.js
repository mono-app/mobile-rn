import React from "react";
import { View, StyleSheet } from "react-native";
import { Text, Snackbar } from "react-native-paper";
import SubmissionAPI from "modules/Classroom/api/submission";
import StudentAPI from "modules/Classroom/api/student";
import ClassAPI from "modules/Classroom/api/class";
import TaskAPI from "modules/Classroom/api/task";
import AppHeader from "src/components/AppHeader";
import moment from "moment"
import { TouchableOpacity, ScrollView } from "react-native-gesture-handler";
import { default as EvilIcons } from "react-native-vector-icons/EvilIcons";
import { default as FontAwesome } from "react-native-vector-icons/FontAwesome";

const INITIAL_STATE = { isLoading: true,schoolId: "1hZ2DiIYSFa5K26oTe75", showSnackbarScoringSuccess: false, submission:{}, class_:{}, task: {}, score: null };

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

  handleScoringPress = ()=>{
    payload = {
      schoolId: this.state.schoolId,
      classId: this.classId,
      taskId: this.taskId,
      submissionId: this.submissionId,
      title: this.title,
      onRefresh: (score) => {this.setState({showSnackbarScoringSuccess: true,score})}
    }
    if(this.state.score){
      this.props.navigation.navigate("ScoreDetails", payload)
    }else{
      this.props.navigation.navigate("SubmissionScoring", payload)
    }
  }

  handleTaskDownload = () => {
    payload = {
      schoolId: this.state.schoolId,
      classId: this.classId,
      taskId: this.taskId,
      submissionId: this.submissionId,
      title: this.title,
      subject: this.subject,
      subjectDesc: this.subjectDesc
    }
    this.props.navigation.navigate("TaskFiles", payload)

  }

  constructor(props) {
    super(props);
    this.state = INITIAL_STATE;
    this.loadSubmission = this.loadSubmission.bind(this);
    this.handleScoringPress = this.handleScoringPress.bind(this);
    this.handleTaskDownload = this.handleTaskDownload.bind(this);
    
    this.classId = this.props.navigation.getParam("classId", "");
    this.taskId = this.props.navigation.getParam("taskId", "");
    this.submissionId = this.props.navigation.getParam("submissionId", "");
    this.title = this.props.navigation.getParam("title", "");
    this.subject = this.props.navigation.getParam("subject", "");
    this.subjectDesc = this.props.navigation.getParam("subjectDesc", "");
 
  }

  componentDidMount(){
    this.loadSubmission();
  }

  render() {
    return (
      <View style={{paddingBottom:64}}>
        <ScrollView>
          <View style={{ flex: 1, backgroundColor: "#E8EEE8" }}>
            <View style={{flexDirection:"row", backgroundColor: "#fff", marginTop: 16, alignItems:"center", justifyContent:"space-between"}}>
              <View style={styles.subjectContainer}>
                  <Text style={{fontWeight: "bold", fontSize: 18}}>
                    {this.state.studentInfo}
                  </Text>
                  <Text style={{fontSize: 16}}>
                    {this.title}
                  </Text>
              </View>
                <FontAwesome name="user-o" size={24} style={{marginRight:4, width: 30}}/>
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
                  <FontAwesome name="calendar" size={24} style={{marginRight:4, width: 30}}/>
                  <Text style={styles.label}>Tanggal Pengumpulan</Text>
                  <View style={{flexDirection:"row",textAlign: "right"}}>
                    <Text>{(this.state.task.dueDate)?moment(this.state.task.dueDate.seconds * 1000).format("DD MMMM YYYY"):""}</Text>
                  </View>
                </View>
              </View>
              <View style={styles.listItemContainer}>
                <View style={styles.listDescriptionContainer}>
                  <FontAwesome name="clock-o" size={24} style={{marginRight:4, width: 30}}/>
                  <Text style={styles.label}>Jam Pengumpulan</Text>
                  <View style={{flexDirection:"row",textAlign: "right"}}>
                    <Text>{(this.state.task.dueDate)?moment(this.state.task.dueDate.seconds * 1000).format("HH:mm"):""}</Text>
                  </View>
                </View>
              </View>
              <TouchableOpacity onPress={this.handleScoringPress}>
                <View style={styles.listItemContainer}>
                  <View style={styles.listDescriptionContainer}>

                    {(this.state.score)? 
                    <View style={{flex:1, flexDirection:"row"}}>
                      <FontAwesome name="eye" size={24} style={{marginRight:4, width: 30}}/>
                      <Text style={styles.label}>Lihat Nilai</Text>
                    </View>
                    :
                    <View style={{flex:1, flexDirection:"row"}}>
                      <FontAwesome name="pencil" size={24} style={{marginRight:4, width: 30}}/>
                      <Text style={styles.label}>Beri Penilaian</Text>
                    </View>
                    }
                    <View style={{flexDirection:"row", textAlign: "right"}}>
                      <Text>{(this.state.score)?this.state.score:""}</Text>
                      <EvilIcons name="chevron-right" size={24} style={{ color: "#5E8864" }}/>
                    </View>
                  </View>
                </View>
              </TouchableOpacity>
              <TouchableOpacity onPress={this.handleTaskDownload}>
                <View style={styles.listItemContainer}>
                  <View style={styles.listDescriptionContainer}>
                   <FontAwesome name="download" size={24} style={{marginRight:4, width: 30}}/>

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
          <Snackbar
            visible= {this.state.showSnackbarScoringSuccess}
            onDismiss={() => this.setState({ showSnackbarScoringSuccess: false })}
            style={{backgroundColor:"#0ead69"}}
            duration={Snackbar.DURATION_SHORT}>
            Berhasil memberikan nilai
          </Snackbar>
    </View>
    );
  }
}

const styles = StyleSheet.create({
  subjectContainer:{
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
    justifyContent: "space-between",
  },
  label:{
    fontWeight: "bold",
    flex:2
  },
  value:{
    flex: 3
  }
});