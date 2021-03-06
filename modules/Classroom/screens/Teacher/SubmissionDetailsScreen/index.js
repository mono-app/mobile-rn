import React from "react";
import { View, StyleSheet } from "react-native";
import { ActivityIndicator, Dialog, Text, Caption, Snackbar } from "react-native-paper";
import SubmissionAPI from "modules/Classroom/api/submission";
import StudentAPI from "modules/Classroom/api/student";
import ClassAPI from "modules/Classroom/api/class";
import TaskAPI from "modules/Classroom/api/task";
import AppHeader from "src/components/AppHeader";
import moment from "moment"
import { TouchableOpacity, ScrollView } from "react-native-gesture-handler";
import { default as EvilIcons } from "react-native-vector-icons/EvilIcons";
import { default as FontAwesome } from "react-native-vector-icons/FontAwesome";
import { withCurrentTeacher } from "modules/Classroom/api/teacher/CurrentTeacher";
import { withTranslation } from 'react-i18next';

const INITIAL_STATE = { isLoading: true, showSnackbarScoringSuccess: false, submission:{}, class_:{}, task: {}, score: null };

class SubmissionDetailsScreen extends React.PureComponent {
  static navigationOptions = () => {
    return {
      header: null
    };
  };

  loadSubmission = async () => {
    if(this._isMounted)
     this.setState({ isLoading: true });

    const promises = [ SubmissionAPI.getDetail(this.props.currentSchool.id, this.classId, this.taskId, this.submissionId),
      StudentAPI.getDetail(this.props.currentSchool.id,this.submissionId),
      ClassAPI.getDetail(this.props.currentSchool.id,this.classId),
      new TaskAPI().getDetail(this.props.currentSchool.id,this.classId,this.taskId),
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

      if(this._isMounted)
        this.setState({ studentInfo, submission, class_, task, score: submission.score, isLoading: false });
    })
  }

  handleScoringPress = ()=>{
    payload = {
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
    this._isMounted = null
    this.classId = this.props.navigation.getParam("classId", "");
    this.taskId = this.props.navigation.getParam("taskId", "");
    this.submissionId = this.props.navigation.getParam("submissionId", "");
    this.title = this.props.navigation.getParam("title", "");
    this.subject = this.props.navigation.getParam("subject", "");
    this.subjectDesc = this.props.navigation.getParam("subjectDesc", "");
    this.loadSubmission = this.loadSubmission.bind(this);
    this.handleScoringPress = this.handleScoringPress.bind(this);
    this.handleTaskDownload = this.handleTaskDownload.bind(this);
  }

  componentDidMount(){
    this._isMounted = true
    this.loadSubmission();
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  render() {
    if(this.state.isLoading){
      return(
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
      <View>
        <AppHeader
            navigation={this.props.navigation}
            title={this.props.t("taskScore")}
            style={{ backgroundColor: "white" }}
          />
        <ScrollView style={{marginBottom:64, backgroundColor: "#E8EEE8"}}>
       
          <View style={{ flex: 1 }}>
         
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
                  <Text style={styles.label}>{this.props.t("subject")}</Text>
                  <View style={{flexDirection:"row",textAlign: "right"}}>
                    <Text>{this.state.class_.subject}</Text>
                  </View>
                </View>
              </View>
              <View style={styles.listItemContainer}>
                <View style={styles.listDescriptionContainer}>
                  <Text style={styles.label}>{this.props.t("class")}</Text>
                  <View style={{flexDirection:"row",textAlign: "right"}}>
                    <Text>{this.state.class_.room}</Text>
                  </View>
                </View>
              </View>
              <View style={styles.listItemContainer}>
                <View style={styles.listDescriptionContainer}>
                  <Text style={styles.label}>{this.props.t("academicYear")}</Text>
                  <View style={{flexDirection:"row",textAlign: "right"}}>
                    <Text>{this.state.class_.academicYear}</Text>
                  </View>
                </View>
              </View>
              <View style={styles.listItemContainer}>
                <View style={styles.listDescriptionContainer}>
                  <Text style={styles.label}>{this.props.t("semester")}</Text>
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
                  <Text style={styles.label}>{this.props.t("dueDate")}</Text>
                  <View style={{flexDirection:"row",textAlign: "right"}}>
                    <Text>{(this.state.task.dueDate)?moment(this.state.task.dueDate.seconds * 1000).format("DD MMMM YYYY"):""}</Text>
                  </View>
                </View>
              </View>
              <View style={styles.listItemContainer}>
                <View style={styles.listDescriptionContainer}>
                  <FontAwesome name="clock-o" size={24} style={{marginRight:4, width: 30}}/>
                  <Text style={styles.label}>{this.props.t("dueTime")}</Text>
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
                      <Text style={styles.label}>{this.props.t("seeScore")}</Text>
                    </View>
                    :
                    <View style={{flex:1, flexDirection:"row"}}>
                      <FontAwesome name="pencil" size={24} style={{marginRight:4, width: 30}}/>
                      <Text style={styles.label}>{this.props.t("scoreIt")}</Text>
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

                    <Text style={styles.label}>{this.props.t("downloadTask")}</Text>
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
            {this.props.t("scoringSuccess")}
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
export default withTranslation()(withCurrentTeacher(SubmissionDetailsScreen))
