import React from "react";
import { View, StyleSheet } from "react-native";
import { Text, Title, Card } from "react-native-paper";
import TextInput from "src/components/TextInput";
import Button from "src/components/Button";
import AppHeader from "src/components/AppHeader";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import ClassAPI from "../../../api/class";

const INITIAL_STATE = {
  isLoading: false,
  room: "",
  semester: "",
  subject: "",
  academicYear: "",
};
export default class AddClassScreen extends React.PureComponent {
  static navigationOptions = ({ navigation }) => {
    return {
      header: (
        <AppHeader
          navigation={navigation}
          style={{ backgroundColor: "transparent" }}
          title="Tambah Kelas Baru"
        />
      )
    };
  };

  handleRoomChange = room => this.setState({ room });
  handleSemesterChange = semester => this.setState({ semester });
  handleSubjectChange = subject => this.setState({ subject });
  handleAcademicYearChange = academicYear => this.setState({ academicYear });

  handleSavePress = () => {
    this.setState({ isLoading: true });
    classInformation = {
      room: this.state.room,
      semester: this.state.semester,
      subject: this.state.subject,
      academicYear: this.state.academicYear
    };
    new ClassAPI()
      .addClass("1hZ2DiIYSFa5K26oTe75", classInformation)
      .then(() => {
        this.setState({ isLoading: false, subject: "" });
      })
      .catch(err => console.log(err));
  };

  constructor(props) {
    super(props);
    this.state = INITIAL_STATE;
  }

  render() {
    return (
      <KeyboardAwareScrollView style={styles.container}>
        <View>
          <Card>
            <Card.Content>
              <Title style={{ marginBottom: 8 }}>Kelas</Title>
              <Text style={styles.smallDescription}>
                Masukkan data kelas yang akan anda buat.
              </Text>
              <View style={{ marginTop: 16 }}>
                <Text style={styles.label}>Tahun Ajaran</Text>
                <TextInput
                  style={{ marginBottom: 0 }}
                  placeholder="Tahun Ajaran"
                  value={this.state.academicYear}
                  onChangeText={this.handleAcademicYearChange}
                />
              </View>
              <View style={{ marginTop: 16 }}>
                <Text style={styles.label}>Semester</Text>
                <TextInput
                  style={{ marginBottom: 0 }}
                  placeholder="Semester"
                  value={this.state.semester}
                  keyboardType="numeric"
                  onChangeText={this.handleSemesterChange}
                />
              </View>
              <View style={{ marginTop: 16 }}>
                <Text style={styles.label}>Ruangan</Text>
                <TextInput
                  style={{ marginBottom: 0 }}
                  placeholder="cth: IPS 1"
                  value={this.state.room}
                  onChangeText={this.handleRoomChange}
                />
              </View>
              <View style={{ marginTop: 16 }}>
                <Text style={styles.label}>Mata Pelajaran</Text>
                <TextInput
                  style={{ marginBottom: 0 }}
                  placeholder="Mata Pelajaran"
                  value={this.state.subject}
                  onChangeText={this.handleSubjectChange}
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
