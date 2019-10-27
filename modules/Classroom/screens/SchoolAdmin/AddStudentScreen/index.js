import React from "react";
import Button from "src/components/Button";
import { View, StyleSheet } from "react-native";
import { Text, Title, Card, Snackbar } from "react-native-paper";
import TextInput from "src/components/TextInput";
import CustomSnackbar from "src/components/CustomSnackbar";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import StudentAPI from "modules/Classroom/api/student";
import { withCurrentSchoolAdmin } from "modules/Classroom/api/schooladmin/CurrentSchoolAdmin";
import { withTranslation } from 'react-i18next';

const INITIAL_STATE = {
  isLoading: false,
  studentEmail: "",
  studentName: "",
  isError: false,
  snackbarMessage: ""
};

class AddStudentScreen extends React.PureComponent {
  static navigationOptions = () => {
    return {
      header: null
    };
  }

  handleStudentEmailChange = studentEmail => this.setState({ studentEmail });
  handleStudentNameChange = studentName => this.setState({ studentName });
  handleSavePress = async () => {
    if(this.state.studentEmail.trim().length>0&&this.state.studentName.trim().length>0){
      this.setState({ isLoading: true });
      try{
        await StudentAPI.addStudent(this.props.currentSchool.id, this.state.studentEmail,{name: this.state.studentName})
        this.setState({ isLoading: false, studentEmail: "", studentName:"", isError: false, snackbarMessage: this.props.t("addStudentSuccess") });
      }catch(err){
        this.setState({ isError: true, snackbarMessage: err.message });
      }
    }
  };

  constructor(props) {
    super(props);
    this.state = INITIAL_STATE;
    this.handleSavePress = this.handleSavePress.bind(this);
    this.showSnackbar = this.showSnackbar.bind(this)
    this.handleDismissSnackBar = this.handleDismissSnackBar.bind(this)
  }

  render() {
    return (
      <View style={{flex:1,display:"flex",backgroundColor: "#E8EEE8"}}>
        <KeyboardAwareScrollView keyboardShouldPersistTaps={'handled'} style={{flex:1}}>
            <Card style={styles.container}>
              <Card.Content>
                <Title style={{ marginBottom: 8 }}>{this.props.t("addStudent")}</Title>
                <Text style={styles.smallDescription}>
                  {this.props.t("addStudentLabel")}
                </Text>
                <View style={{ marginTop: 16 }}>
                  <Text style={styles.label}>{this.props.t("studentEmail")}</Text>
                  <TextInput
                    style={{ marginBottom: 0 }}
                    placeholder={this.props.t("example")+": johndoe@gmail.com"}
                    value={this.state.studentEmail}
                    onChangeText={this.handleStudentEmailChange}
                  />
                </View>
                <View style={{ marginTop: 16 }}>
                  <Text style={styles.label}>{this.props.t("studentName")}</Text>
                  <TextInput
                    style={{ marginBottom: 0 }}
                    placeholder={this.props.t("example")+": John Doe"}
                    value={this.state.studentName}
                    onChangeText={this.handleStudentNameChange}
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
        <CustomSnackbar isError={this.state.isError} message={this.state.snackbarMessage} />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: { flex: 1, margin: 16},
  smallDescription: { fontSize: 12, textAlign: "left", color: "#5E8864" },
  label: { fontSize: 14, textAlign: "left", color: "#000000" }
});
export default withTranslation()(withCurrentSchoolAdmin(AddStudentScreen))
