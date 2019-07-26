import React from "react";
import Button from "src/components/Button";
import { View, StyleSheet } from "react-native";
import { Text, Title, Card } from "react-native-paper";
import TextInput from "src/components/TextInput";
import AppHeader from "src/components/AppHeader";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import StudentAPI from "../../../api/student";

const INITIAL_STATE = {
  isLoading: false,
  studentEmail: "",
  studentName: "",
};
export default class AddStudentScreen extends React.PureComponent {
  static navigationOptions = ({ navigation }) => {
    return {
      header: (
        <AppHeader
          navigation={navigation}
          style={{ backgroundColor: "transparent" }}
          title="Tambah Murid"
        />
      )
    };
  };
  handleStudentEmailChange = studentEmail => this.setState({ studentEmail });
  handleStudentNameChange = studentName => this.setState({ studentName });
  handleSavePress = () => {
    this.setState({ isLoading: true });
    new StudentAPI().addStudent("1hZ2DiIYSFa5K26oTe75", this.state.studentEmail,{name: this.state.studentName}).then(() => {
      this.setState({ isLoading: false, studentEmail: "", studentName:"" });
    }).catch(err => console.log(err));
  };

  constructor(props) {
    super(props);
    this.state = INITIAL_STATE;
    this.handleSavePress = this.handleSavePress.bind(this);
  }

  render() {
    return (
      <KeyboardAwareScrollView style={styles.container}>
        <View>
          <Card>
            <Card.Content>
              <Title style={{ marginBottom: 8 }}>Tambah Murid</Title>
              <Text style={styles.smallDescription}>
                Harap isi ID murid yang akan ditambah.
              </Text>
              <View style={{ marginTop: 16 }}>
                <Text style={styles.label}>Email Murid</Text>
                <TextInput
                  style={{ marginBottom: 0 }}
                  placeholder="cth: johndoe@gmail.com"
                  value={this.state.studentEmail}
                  onChangeText={this.handleStudentEmailChange}
                />
              </View>
              <View style={{ marginTop: 16 }}>
                <Text style={styles.label}>Nama Murid</Text>
                <TextInput
                  style={{ marginBottom: 0 }}
                  placeholder="cth: John Doe"
                  value={this.state.studentName}
                  onChangeText={this.handleStudentNameChange}
                />
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
