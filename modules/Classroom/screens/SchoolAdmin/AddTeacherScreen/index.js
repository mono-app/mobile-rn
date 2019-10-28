import React from "react";
import Button from "src/components/Button";
import { View, StyleSheet } from "react-native";
import { Text, Title, Card } from "react-native-paper";
import TextInput from "src/components/TextInput";
import CustomSnackbar from "src/components/CustomSnackbar";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import TeacherAPI from "modules/Classroom/api/teacher";
import { withCurrentSchoolAdmin } from "modules/Classroom/api/schooladmin/CurrentSchoolAdmin";
import { withTranslation } from 'react-i18next';

const INITIAL_STATE = {
  isLoading: false,
  teacherEmail: "",
  teacherName: "",
  snackbarMessage: null,
  isError: false
};

class AddTeacherScreen extends React.PureComponent {
  static navigationOptions = () => {
    return {
      header: null
    };
  };

  handleDismissSnackBar = () => this.setState({snackbarMessage: ""})

  handleTeacherEmailChange = teacherEmail => this.setState({ teacherEmail });
  handleTeacherNameChange = teacherName => this.setState({ teacherName });

  handleSavePress = async () => {
    if(this.state.teacherEmail.trim().length>0 && this.state.teacherName.trim().length>0){
      this.setState({ isLoading: true });
      try{
        await TeacherAPI.addTeacher(this.props.currentSchool.id, this.state.teacherEmail, this.state.teacherName)
        this.setState({ isLoading: false, teacherEmail: "", teacherName:"", isError: false, snackbarMessage: this.props.t("addTeacherSuccess")});
      }catch(err){
        console.log(err.stack)
        this.setState({ isLoading: false, isError: true, snackbarMessage: err.message });
      }
    }
  };

  constructor(props) {
    super(props);
    this.state = INITIAL_STATE;
    this.handleSavePress = this.handleSavePress.bind(this);
    this.handleTeacherEmailChange = this.handleTeacherEmailChange.bind(this);
    this.handleTeacherNameChange = this.handleTeacherNameChange.bind(this);
    this.schoolId = this.props.navigation.getParam("schoolId", "");
  }

  render() {
    return (
      <View style={{flex:1,display:"flex",backgroundColor: "#E8EEE8"}}>
        <KeyboardAwareScrollView keyboardShouldPersistTaps={'handled'} style={{flex:1}}>
            <Card style={styles.container}>
              <Card.Content>
                <Title style={{ marginBottom: 8 }}>{this.props.t("addTeacher")}</Title>
                <Text style={styles.smallDescription}>
                  {this.props.t("addTeacherLabel")}
                </Text>
                <View style={{ marginTop: 16 }}>
                  <Text style={styles.label}>{this.props.t("teacherEmail")}</Text>
                  <TextInput
                    style={{ marginBottom: 0 }}
                    placeholder={this.props.t("example")+": johndoe@gmail.com"}
                    value={this.state.teacherEmail}
                    onChangeText={this.handleTeacherEmailChange}/>
                </View>
                <View style={{ marginTop: 16 }}>
                  <Text style={styles.label}>{this.props.t("teacherName")}</Text>
                  <TextInput
                    style={{ marginBottom: 0 }}
                    placeholder={this.props.t("example")+": John Doe"}
                    value={this.state.teacherName}
                    onChangeText={this.handleTeacherNameChange}/>
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
        <CustomSnackbar isError={this.state.isError} message={this.state.snackbarMessage} onDismiss={this.handleDismissSnackBar} />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: { flex: 1, margin: 16 },
  smallDescription: { fontSize: 12, textAlign: "left", color: "#5E8864" },
  label: { fontSize: 14, textAlign: "left", color: "#000000" }
});
export default withTranslation()(withCurrentSchoolAdmin(AddTeacherScreen))
