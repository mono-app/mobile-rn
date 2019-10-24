import React from "react";
import { View, FlatList } from "react-native";
import { Button as ButtonDialog, Dialog, Portal, Subheading, Headline  } from "react-native-paper";
import MySearchbar from "src/components/MySearchbar"
import MassScoringListItem from "modules/Classroom/components/MassScoringListItem";
import AppHeader from "src/components/AppHeader";
import StudentAPI from "modules/Classroom/api/student";
import TextInput from "src/components/TextInput";
import { withCurrentTeacher } from "modules/Classroom/api/teacher/CurrentTeacher";
import { withTranslation } from 'react-i18next';
import { Text } from "react-native-paper"

const INITIAL_STATE = { 
  isLoading: true, 
  dialogVisible: false,
  dialogScore: "", 
  selectedStudent: {}, 
  selectedStudentInfo: "",
  peopleList: [], 
  filteredPeopleList: []
  };


class MassScoringScreen extends React.PureComponent {
  static navigationOptions = () => {
    return {
      header: null
    };
  };

  loadStudents = async () => {
    if(this._isMounted)
      this.setState({ peopleList: [], filteredPeopleList: [] });
    const peopleList = await StudentAPI.getClassStudent(this.props.currentSchool.id, this.classId);
    if(this._isMounted)
      this.setState({ peopleList, filteredPeopleList: peopleList });
  }

  handleStudentPress = async student => {
    if(!student.finalScore){
      const newStudent = await StudentAPI.getDetail(this.props.currentSchool.id, student.id)
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
    await StudentAPI.saveFinalScoreStudent(this.props.currentSchool.id, this.classId, this.state.selectedStudent.id, {finalScore: this.state.dialogScore})
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

  handleSearchPress = (searchText) => {
    this.setState({filteredPeopleList: []})

    const clonedPeopleList = JSON.parse(JSON.stringify(this.state.peopleList))
    const newSearchText = JSON.parse(JSON.stringify(searchText)) 
    if(searchText){

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
    this._isMounted = null
    this.classId = this.props.navigation.getParam("classId", "");
    this.loadStudents = this.loadStudents.bind(this);
    this.handleStudentPress = this.handleStudentPress.bind(this);
    this.handleSearchPress = this.handleSearchPress.bind(this);
  }

  componentDidMount(){
    this._isMounted = true
    this.loadStudents();
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  render() {
    return (
      <View style={{ flex: 1, backgroundColor: "#fff" }}>
       <AppHeader
          navigation={this.props.navigation}
          title={this.props.t("massScoring")}
          style={{ backgroundColor: "white" }}
        />
        <View style={{ padding: 16 }}>
          <MySearchbar 
            onSubmitEditing={this.handleSearchPress}
            placeholder={this.props.t("searchStudent")} />
        </View>
        {(this.state.filteredPeopleList.length===0)?<Text style={{marginTop:16, textAlign:"center"}}>{this.props.t("listEmpty")}</Text>:null}
        <FlatList
          style={{ backgroundColor: "white" }}
          data={this.state.filteredPeopleList}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => {
            return (
              <MassScoringListItem 
                onPress={() => this.handleStudentPress(item)}
                schoolId={this.props.currentSchool.id} student={item}/>
            )
          }}
        />
        <Portal>
          <Dialog
            onDismiss={this.hideDialog}
            visible={this.state.dialogVisible}>
            <Dialog.Content>
            <Headline>{this.props.t("inputScoreFor")}</Headline>
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
              }}>{this.props.t("cancel")}</ButtonDialog>

              <ButtonDialog onPress={this.saveDialog}>OK</ButtonDialog>
            </Dialog.Actions>
          </Dialog>
        </Portal>
      </View>
    );
  }
}

export default withTranslation()(withCurrentTeacher(MassScoringScreen))
