import React from "react";
import { View, StyleSheet, TouchableOpacity, ScrollView } from "react-native";
import { ActivityIndicator, Caption, Dialog, Text, Title, withTheme, Subheading } from "react-native-paper";
import { default as FontAwesome } from "react-native-vector-icons/FontAwesome";
import CircleAvatar from "src/components/Avatar/Circle";
import Header from "modules/Classroom/components/Header";
import SchoolAPI from "modules/Classroom/api/school"
import { withCurrentTeacher } from "modules/Classroom/api/teacher/CurrentTeacher";
import { withCurrentUser } from "src/api/people/CurrentUser"
import Key from "src/helper/key"
import Tooltip from 'react-native-walkthrough-tooltip';
import { withTutorialClassroom } from "modules/Classroom/api/TutorialClassroom";
import { withTranslation } from 'react-i18next';

const INITIAL_STATE = {
  isLoading: false,
  teacherId: "",
  schoolId: "",
  userName: ""
};

class TeacherHomeScreen extends React.PureComponent {
  static navigationOptions = () => {
    return { header: null };
  }

  handleAddPress = e => {
    
    this.props.navigation.navigate("AddTask");
  }

  handleDataMasterPress = e => {
    this.props.navigation.navigate("SchoolAdminDataMaster");
  }

  handleTeacherProfilePress = e => {
    
    this.props.navigation.navigate("MyProfile");
  }

  handleClassListPress = e => {
   
    this.props.navigation.navigate("MyClass");
  }

  handleMyDiscussionsPress = () => {
    payload = {
      schoolId : this.props.currentSchool.id,
    }
    this.props.navigation.navigate("MyDiscussions", payload);
  }

  constructor(props) {    
    super(props);
    INITIAL_STATE.schoolId = SchoolAPI.currentSchoolId
    this.state = INITIAL_STATE;
    this._isMounted = null
    this.handleAddPress = this.handleAddPress.bind(this);
    this.handleDataMasterPress = this.handleDataMasterPress.bind(this);
    this.handleTeacherProfilePress = this.handleTeacherProfilePress.bind(this);
    this.handleClassListPress = this.handleClassListPress.bind(this);
    this.handleMyDiscussionsPress = this.handleMyDiscussionsPress.bind(this);
  }

  async componentDidMount(){
    this._isMounted = true
    if(this._isMounted) this.setState({isLoading: true})
    await this.props.setCurrentTeacherId(this.state.schoolId, this.props.currentUser.id)
    if(this._isMounted) this.setState({isLoading: false})
    this.props.classroomTutorial.show(Key.KEY_TUTORIAL_CLASSROOM_PROFILE)
  }
  
  componentWillUnmount() {
    this._isMounted = false;
  }

  render() {
    if(this.state.isLoading){
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
      <View style={styles.groupContainer}>
        <Header navigation={this.props.navigation} title={this.props.currentSchool.name} />
        <ScrollView>
          <View style={{flex: 1}}>
            <View style={styles.logo}>
              <CircleAvatar size={100} uri={(this.props.currentTeacher.profilePicture)? this.props.currentTeacher.profilePicture.downloadUrl : "https://picsum.photos/200/200/?random" }/>
              <Tooltip
              isVisible={this.props.showTutorialProfile}
              placement="bottom"
              showChildInTooltip={true}
              content={<Text>{this.props.t("tutorialSeeProfile")}</Text>}
              onClose={() => this.props.classroomTutorial.close()}>
                <TouchableOpacity onPress={this.handleTeacherProfilePress} style={{marginTop:16}}>
                  <Text style={{ color: this.props.theme.colors.primary }}>Lihat Profile</Text>
                </TouchableOpacity>
              </Tooltip>
              <Title style={{marginTop: 22}}>
                {this.props.t("welcomeComa")}
              </Title>
              <Subheading>{this.props.currentTeacher.name}</Subheading>
            </View>

            <View style={{marginBottom: 64}}/>
            <View style={{display:"flex"}}>
              <View style={styles.buttonContainer}>
                <TouchableOpacity onPress={this.handleClassListPress}>
                    <View style={styles.button} >
                      <View style={{flex:1, justifyContent:"center",alignItems:"center"}}>
                        <FontAwesome name="list" style={{color: "#fff"}} size={24} />
                      </View>
                    </View>
                    <Text>{this.props.t("myClass")}</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={this.handleAddPress} >
                    <View style={styles.button} >
                      <View style={{flex:1, justifyContent:"center",alignItems:"center"}}>
                        <FontAwesome name="plus" style={{color: "#fff"}} size={24} />
                      </View>
                    </View>
                    <Text>{this.props.t("addTask")}</Text>
                </TouchableOpacity>
              </View>
              <View style={styles.buttonContainer}>
                  <TouchableOpacity onPress={this.handleMyDiscussionsPress} style={{ alignItems: "center"}}>
                      <View style={styles.button} >
                        <View style={{flex:1, justifyContent:"center",alignItems:"center"}}>
                          <FontAwesome name="list" style={{color: "#fff"}} size={24} />
                        </View>
                      </View>
                      <Text>{this.props.t("myDiscussion")}</Text>
                  </TouchableOpacity>
              </View>
            </View>
          </View>
        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#E8EEE8", color: "black" },
  logo: {
    marginTop: 36,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center"
  },
  groupContainer: {  flex: 1, backgroundColor: "#E8EEE8"},
  buttonContainer: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-evenly"
  },
  menu: {
    padding: 16,
    backgroundColor: "white",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#E8EEE8"
  },
  button: {
    alignItems: "center",
    alignSelf: "center",
    backgroundColor: "#0EAD69",
    height: 60,
    width: 60,
    borderColor: "#fff",
    borderRadius: 12
  }
});

export default withTranslation()(withCurrentUser(withTutorialClassroom(withCurrentTeacher(withTheme(TeacherHomeScreen)))))
