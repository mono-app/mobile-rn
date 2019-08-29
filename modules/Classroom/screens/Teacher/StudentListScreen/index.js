import React from "react";
import { View, FlatList } from "react-native";
import { Searchbar } from "react-native-paper";
import StudentListItem from "modules/Classroom/components/StudentListItem";
import AppHeader from "src/components/AppHeader";
import StudentAPI from "modules/Classroom/api/student";
import { withCurrentTeacher } from "modules/Classroom/api/teacher/CurrentTeacher";

const INITIAL_STATE = { isLoading: true, peopleList: [], filteredPeopleList: [], searchText: "" };
class StudentListScreen extends React.PureComponent {
  static navigationOptions = ({ navigation }) => {
    return {
      header: (
        <AppHeader
          navigation={navigation}
          title="Daftar Murid"
          style={{ backgroundColor: "transparent" }}
        />
      )
    };
  };

  loadStudents = async () => {
    this.setState({peopleList: []})
    const peopleList = await StudentAPI.getClassStudent(this.props.currentSchool.id, this.classId);
    this.setState({ peopleList, filteredPeopleList: peopleList });
  }

  handleStudentPress = people => {
    const payload = {
      studentEmail: people.id
    }
    this.props.navigation.navigate("StudentProfile", payload);
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
              <StudentListItem 
                onPress={() => this.handleStudentPress(item)}
                schoolId={this.props.currentSchool.id} student={item}/>
            )
          }}
        />
      </View>
    );
  }
}

export default withCurrentTeacher(StudentListScreen)
