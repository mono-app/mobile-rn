import React from "react";
import Button from "src/components/Button";
import { View, StyleSheet } from "react-native";
import { Text, Title, Card } from "react-native-paper";
import TextInput from "src/components/TextInput";
import AppHeader from "src/components/AppHeader";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import TeacherAPI from "../../api/teacher";

const INITIAL_STATE = {
  isLoading: false,
  teacherEmail: "",
  teacherName: "",
};
export default class AddTeacherScreen extends React.PureComponent {
  static navigationOptions = ({ navigation }) => {
    return {
      header: (
        <AppHeader
          navigation={navigation}
          style={{ backgroundColor: "transparent" }}
          title="Tambah Guru"
        />
      )
    };
  };
  handleTeacherEmailChange = teacherEmail => this.setState({ teacherEmail });
  handleTeacherNameChange = teacherName => this.setState({ teacherName });

  handleSavePress = () => {
    this.setState({ isLoading: true });
    TeacherAPI.addTeacher("1hZ2DiIYSFa5K26oTe75", this.state.teacherEmail,{name: this.state.teacherName}).then(() => {
      this.setState({ isLoading: false, teacherEmail: "", teacherName:"" });
    }).catch(err => console.log(err));
  };

  constructor(props) {
    super(props);
    this.state = INITIAL_STATE;
    this.handleSavePress = this.handleSavePress.bind(this);
    this.handleTeacherEmailChange = this.handleTeacherEmailChange.bind(this);
    this.handleTeacherNameChange = this.handleTeacherNameChange.bind(this);
  }

  render() {
    return (
      <KeyboardAwareScrollView style={styles.container}>
        <View>
          <Card>
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
                onPress={this.handleSavePress}
              />
            </Card.Content>
          </Card>
        </View>
      </KeyboardAwareScrollView>
    );
  }
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: "#E8EEE8" },
  smallDescription: { fontSize: 12, textAlign: "left", color: "#5E8864" },
  label: { fontSize: 14, textAlign: "left", color: "#000000" }
});
