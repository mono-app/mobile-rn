import React from "react";
import { View, FlatList, StyleSheet } from "react-native";
import { Searchbar, Button as ButtonDialog, Dialog, Portal, Subheading, Headline  } from "react-native-paper";
import MassScoringListItem from "../../../components/MassScoringListItem";
import AppHeader from "src/components/AppHeader";
import StudentAPI from "../../../api/student";
import TextInput from "src/components/TextInput";

const INITIAL_STATE = { 
  isLoading: true, 
  dialogVisible: false,
  dialogScore: "", 
  selectedStudent: {}, 
  selectedStudentInfo: "",
  peopleList: [], 
  filteredPeopleList: [], 
  searchText: ""
  };

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
    this.setState({ peopleList: [], filteredPeopleList: [] });
    const peopleList = await StudentAPI.getClassStudent(this.schoolId, this.classId);
    this.setState({ peopleList, filteredPeopleList: peopleList });
    console.log(peopleList)
  }

  handleStudentPress = async student => {
    if(!student.finalScore){
      const newStudent = await StudentAPI.getDetail(this.schoolId, student.id)
      const info = (newStudent.noInduk)?newStudent.noInduk+" / "+ newStudent.name:"-" +" / "+ newStudent.name
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
    let clonedFilteredPeopleList = JSON.parse(JSON.stringify(this.state.filteredPeopleList))
    this.setState({filteredPeopleList:[]})

    clonedFilteredPeopleList = await clonedFilteredPeopleList.map((people) => {
      if(people.id === this.state.selectedStudent.id){
        return {...people, finalScore: this.state.dialogScore}
      }
      return people
    })
    this.setState({filteredPeopleList:clonedFilteredPeopleList, dialogVisible: false})
  }

  hideDialog = () => {
    this.setState({ dialogVisible: false })
  }

  handleSearchPress = () => {
    this.setState({filteredPeopleList: []})

    const clonedPeopleList = JSON.parse(JSON.stringify(this.state.peopleList))
    const newSearchText = JSON.parse(JSON.stringify(this.state.searchText)) 
    if(this.state.searchText){

      const filteredPeopleList = clonedPeopleList.filter((people) => {
        return people.name.toLowerCase().indexOf(newSearchText.toLowerCase()) >= 0
      })
      this.setState({filteredPeopleList})
    } else {
      this.setState({filteredPeopleList: clonedPeopleList})
    }
  }

  constructor(props) {
    super(props);
    this.state = INITIAL_STATE;
    this.schoolId = this.props.navigation.getParam("schoolId", "");
    this.classId = this.props.navigation.getParam("classId", "");
    this.loadStudents = this.loadStudents.bind(this);
    this.handleStudentPress = this.handleStudentPress.bind(this);
    this.handleSearchPress = this.handleSearchPress.bind(this);
  }

  componentDidMount(){
    this.loadStudents();
  }

  render() {
    return (
      <View style={{ flex: 1, backgroundColor: "#E8EEE8" }}>
        <View style={{ padding: 16 }}>
          <Searchbar 
            onChangeText={searchText => {this.setState({searchText})}}
            onSubmitEditing={this.handleSearchPress}
            value={this.state.searchText}
            placeholder="Cari Murid" />
        </View>
        <FlatList
          style={{ backgroundColor: "white" }}
          data={this.state.filteredPeopleList}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => {
            return (
              <MassScoringListItem 
                onPress={() => this.handleStudentPress(item)}
                schoolId={this.schoolId} student={item}/>
            )
          }}
        />
        <Portal>
          <Dialog
            onDismiss={this.hideDialog}
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
              <ButtonDialog onPress={() => {
                this.setState({dialogVisible: false})
              }}>Batal</ButtonDialog>

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
