import React from "react";
import { View, FlatList, StyleSheet } from "react-native";
import { Searchbar, Button as ButtonDialog, Dialog, Portal, Subheading, Headline  } from "react-native-paper";
import MassScoringListItem from "../../../components/MassScoringListItem";
import AppHeader from "src/components/AppHeader";
import StudentAPI from "../../../api/student";
import TextInput from "src/components/TextInput";

const INITIAL_STATE = { isLoading: true, dialogVisible: false, dialogScore: "", selectedStudent: {}, selectedStudentInfo: "" };

export default class MassScoringScreen extends React.PureComponent {
  static navigationOptions = ({ navigation }) => {
    return {
      header: (
        <AppHeader
          navigation={navigation}
          title="Penilaian Massal"
          style={{ backgroundColor: "transparent" }}
        />
      )
    };
  };

  loadStudents = async () => {
    this.setState({ peopleList: [] });

    const peopleList = await StudentAPI.getClassStudent(this.schoolId, this.classId);
    this.setState({ peopleList });
  }

  handleStudentPress = async student => {
    if(!student.finalScore){
      const newStudent = await StudentAPI.getDetail(this.schoolId, student.id)
      const info = (newStudent.noInduk)?newStudent.noInduk:"-" +" / "+ newStudent.name
      this.setState({selectedStudent: student,  selectedStudentInfo: info})
      this.showDialog();
    }
  }

  handleScoreChange = dialogScore => {
    this.setState({dialogScore})
  }

  showDialog = async () => {
    this.setState({dialogScore: "", dialogVisible: true})
  }

  saveDialog = async () => {
    await StudentAPI.saveFinalScoreStudent(this.schoolId, this.classId, this.state.selectedStudent.id, {finalScore: this.state.dialogScore})
    this.setState({dialogVisible: false})
    this.loadStudents()
  }

  _hideDialog = () => {
    this.setState({ dialogVisible: false })
  }

  constructor(props) {
    super(props);
    this.state = INITIAL_STATE;
    this.loadStudents = this.loadStudents.bind(this);
    this.handleStudentPress = this.handleStudentPress.bind(this);
    this.schoolId = this.props.navigation.getParam("schoolId", "");
    this.classId = this.props.navigation.getParam("classId", "");
  }

  componentDidMount(){
    this.loadStudents();
  }

  render() {
    return (
      <View style={{ flex: 1, backgroundColor: "#E8EEE8" }}>
        <View style={{ padding: 16 }}>
          <Searchbar placeholder="Cari Murid" />
        </View>
        <FlatList
          style={{ backgroundColor: "white" }}
          data={this.state.peopleList}
          renderItem={({ item, index }) => {
            return (
              <MassScoringListItem 
                onPress={() => this.handleStudentPress(item)}
                key={index} schoolId={this.schoolId} student={item}/>
            )
          }}
        />
        <Portal>
          <Dialog
            onDismiss={this._hideDialog}
            visible={this.state.dialogVisible}>
            <Dialog.Content>
            <Headline>Masukan Nilai Untuk</Headline>
            <Subheading>{this.state.selectedStudentInfo}</Subheading>
              <TextInput
                placeholder=""
                style={{ backgroundColor: "#E8EEE8", marginTop: 8 }}
                value={this.state.dialogScore}
                onChangeText={this.handleScoreChange}/>
          
            </Dialog.Content>
            <Dialog.Actions>
              <ButtonDialog onPress={this.saveDialog}>OK</ButtonDialog>
            </Dialog.Actions>
          </Dialog>
        </Portal>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  listItemContainer: {
    padding: 16,
    flexDirection: "row",
    justifyContent: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#E8EEE8"
  }
});
