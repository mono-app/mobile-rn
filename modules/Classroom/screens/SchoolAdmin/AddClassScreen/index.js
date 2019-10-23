import React from "react";
import { View, StyleSheet } from "react-native";
import { Text, Title, Card,Snackbar } from "react-native-paper";
import TextInput from "src/components/TextInput";
import Button from "src/components/Button";
import { withTranslation } from 'react-i18next';
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import ClassAPI from "modules/Classroom/api/class";
import { withCurrentSchoolAdmin } from "modules/Classroom/api/schooladmin/CurrentSchoolAdmin";

const INITIAL_STATE = {
  isLoading: false,
  room: "",
  semester: "",
  subject: "",
  academicYear: "",
  showSnackbar: false

};
class AddClassScreen extends React.PureComponent {
  static navigationOptions = () => {
    return {
      header: null
    };
  };

  showSnackbar() {
    this.setState({
      showSnackbar: true
    })
  }
  handleRoomChange = room => this.setState({ room });
  handleSemesterChange = semester => this.setState({ semester });
  handleSubjectChange = subject => this.setState({ subject });
  handleAcademicYearChange = academicYear => this.setState({ academicYear });

  handleSavePress = () => {

    classInformation = {
      room: this.state.room,
      semester: this.state.semester,
      subject: this.state.subject,
      academicYear: this.state.academicYear,
      isArchive: false
    };
    if(classInformation.academicYear.trim().length>0&&
    classInformation.subject.trim().length>0&&
    classInformation.semester.trim().length>0&&
    classInformation.room.trim().length>0){
    this.setState({ isLoading: true });

    new ClassAPI()
      .addClass(this.props.currentSchool.id, classInformation)
      .then(() => {
        this.setState({ isLoading: false, subject: "" });
        this.showSnackbar();

      })
      .catch(err => console.log(err));
    }
  };

  constructor(props) {
    super(props);
    this.state = INITIAL_STATE;
    this.handleRoomChange = this.handleRoomChange.bind(this)
    this.handleSemesterChange = this.handleSemesterChange.bind(this)
    this.handleSubjectChange = this.handleSubjectChange.bind(this)
    this.handleAcademicYearChange = this.handleAcademicYearChange.bind(this)
    this.handleSavePress = this.handleSavePress.bind(this)
    this.showSnackbar = this.showSnackbar.bind(this)
    
  }

  render() {
    return (
        <View style={{flex:1,display:"flex",backgroundColor: "#E8EEE8"}}>
        
          <KeyboardAwareScrollView keyboardShouldPersistTaps={'handled'} style={{flex:1}}>         
          <Card style={styles.container}>
              <Card.Content>
                <Title style={{ marginBottom: 8 }}>{this.props.t("class")}</Title>
                <Text style={styles.smallDescription}>
                  {this.props.t("addClassLabel")}
                </Text>
                <View style={{ marginTop: 16 }}>
                  <Text style={styles.label}>{this.props.t("academicYear")}</Text>
                  <TextInput
                    style={{ marginBottom: 0 }}
                    placeholder={this.props.t("academicYear")}
                    value={this.state.academicYear}
                    onChangeText={this.handleAcademicYearChange}
                  />
                </View>
                <View style={{ marginTop: 16 }}>
                  <Text style={styles.label}>{this.props.t("semester")}</Text>
                  <TextInput
                    style={{ marginBottom: 0 }}
                    placeholder={this.props.t("semester")}
                    value={this.state.semester}
                    keyboardType="numeric"
                    onChangeText={this.handleSemesterChange}
                  />
                </View>
                <View style={{ marginTop: 16 }}>
                  <Text style={styles.label}>{this.props.t("room")}</Text>
                  <TextInput
                    style={{ marginBottom: 0 }}
                    placeholder={this.props.t("example") +": IPS 1"}
                    value={this.state.room}
                    onChangeText={this.handleRoomChange}
                  />
                </View>
                <View style={{ marginTop: 16 }}>
                  <Text style={styles.label}>{this.props.t("subject")}</Text>
                  <TextInput
                    style={{ marginBottom: 0 }}
                    placeholder={this.props.t("subject")}
                    value={this.state.subject}
                    onChangeText={this.handleSubjectChange}
                  />
                </View>
                
                <View style={{ paddingVertical: 8 }} />
                <Button
                  text={this.props.t("save")}
                  isLoading={this.state.isLoading}
                  disabled={this.state.isLoading}
                  onPress={this.handleSavePress}
                />
              </Card.Content>
            </Card>
        </KeyboardAwareScrollView>
        <Snackbar
          visible= {this.state.showSnackbar}
          onDismiss={() => this.setState({ showSnackbar: false })}
          style={{backgroundColor:"#0ead69"}}
          duration={Snackbar.DURATION_SHORT}>
          {this.props.t("addClassSuccess")}
        </Snackbar>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: { flex: 1, margin: 16 },
  smallDescription: { fontSize: 12, textAlign: "left", color: "#5E8864" },
  label: { fontSize: 14, textAlign: "left", color: "#000000" }
});
export default withTranslation()(withCurrentSchoolAdmin(AddClassScreen))
