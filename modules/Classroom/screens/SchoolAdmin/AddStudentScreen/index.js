import React from "react";
import Button from "src/components/Button";
import { View, StyleSheet } from "react-native";
import { Text, Title, Card,Snackbar } from "react-native-paper";
import TextInput from "src/components/TextInput";
import AppHeader from "src/components/AppHeader";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import StudentAPI from "../../../api/student";

const INITIAL_STATE = {
  isLoading: false,
  studentEmail: "",
  studentName: "",
  showSnackbar: false

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
  
  showSnackbar() {
    this.setState({
      showSnackbar: true
    })
  }
  handleStudentEmailChange = studentEmail => this.setState({ studentEmail });
  handleStudentNameChange = studentName => this.setState({ studentName });
  handleSavePress = () => {
    this.setState({ isLoading: true });
    
    new StudentAPI().addStudent("1hZ2DiIYSFa5K26oTe75", this.state.studentEmail,{name: this.state.studentName}).then(() => {
      this.setState({ isLoading: false, studentEmail: "", studentName:"" });
      this.showSnackbar();
    }).catch(err => console.log(err));
  };

  constructor(props) {
    super(props);
    this.state = INITIAL_STATE;
    this.handleSavePress = this.handleSavePress.bind(this);
    this.showSnackbar = this.showSnackbar.bind(this)

  }

  render() {
    return (
      <View style={{flex:1,display:"flex",backgroundColor: "#E8EEE8"}}>
        <KeyboardAwareScrollView style={{flex:1}}>
            <Card style={styles.container}>
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
        </KeyboardAwareScrollView>
        <Snackbar
          visible= {this.state.showSnackbar}
          onDismiss={() => this.setState({ showSnackbar: false })}
          style={{backgroundColor:"#0ead69"}}
          duration={Snackbar.DURATION_SHORT}>
          Berhasil menambahkan murid
        </Snackbar>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: { flex: 1, margin: 16},
  smallDescription: { fontSize: 12, textAlign: "left", color: "#5E8864" },
  label: { fontSize: 14, textAlign: "left", color: "#000000" }
});
