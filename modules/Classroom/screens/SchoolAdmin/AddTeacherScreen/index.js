import React from "react";
import Button from "src/components/Button";
import { View, StyleSheet } from "react-native";
import { Text, Title, Card, Snackbar, Portal} from "react-native-paper";
import TextInput from "src/components/TextInput";
import AppHeader from "src/components/AppHeader";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import TeacherAPI from "modules/Classroom/api/teacher";
import { withCurrentSchoolAdmin } from "modules/Classroom/api/schooladmin/CurrentSchoolAdmin";

const INITIAL_STATE = {
  isLoading: false,
  teacherEmail: "",
  teacherName: "",
  showSnackbar: false
};

class AddTeacherScreen extends React.PureComponent {
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
  handleTeacherEmailChange = teacherEmail => this.setState({ teacherEmail });
  handleTeacherNameChange = teacherName => this.setState({ teacherName });

  handleSavePress = () => {
    this.setState({ isLoading: true });

    TeacherAPI.addTeacher(this.props.currentSchool.id, this.state.teacherEmail,{name: this.state.teacherName}).then(() => {
      this.setState({ isLoading: false, teacherEmail: "", teacherName:"" });
      this.showSnackbar()
    }).catch(err => console.log(err));
  };

  constructor(props) {
    super(props);
    this.state = INITIAL_STATE;
    this.handleSavePress = this.handleSavePress.bind(this);
    this.handleTeacherEmailChange = this.handleTeacherEmailChange.bind(this);
    this.handleTeacherNameChange = this.handleTeacherNameChange.bind(this);
    this.showSnackbar = this.showSnackbar.bind(this)
    this.schoolId = this.props.navigation.getParam("schoolId", "");
  }

  render() {

    return (
      <View style={{flex:1,display:"flex",backgroundColor: "#E8EEE8"}}>
       
        <KeyboardAwareScrollView style={{flex:1}}>
            <Card style={styles.container}>
              <Card.Content>
                <Title style={{ marginBottom: 8 }}>Tambah Guru</Title>
                <Text style={styles.smallDescription}>
                  Harap isi ID guru yang akan ditambah.
                </Text>
                <View style={{ marginTop: 16 }}>
                  <Text style={styles.label}>Email Guru</Text>
                  <TextInput
                    style={{ marginBottom: 0 }}
                    placeholder="cth: johndoe@gmail.com"
                    value={this.state.teacherEmail}
                    onChangeText={this.handleTeacherEmailChange}/>
                </View>
                <View style={{ marginTop: 16 }}>
                  <Text style={styles.label}>Nama Guru</Text>
                  <TextInput
                    style={{ marginBottom: 0 }}
                    placeholder="cth: John Doe"
                    value={this.state.teacherName}
                    onChangeText={this.handleTeacherNameChange}/>
                </View>
                <View style={{ paddingVertical: 8 }} />
                <Button
                  text="Simpan"
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
          Berhasil menambahkan guru
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
export default withCurrentSchoolAdmin(AddTeacherScreen)
