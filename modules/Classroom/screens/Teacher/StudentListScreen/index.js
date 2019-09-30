import React from "react";
import { View, FlatList } from "react-native";
import StudentListItem from "modules/Classroom/components/StudentListItem";
import MySearchbar from "src/components/MySearchbar"
import AppHeader from "src/components/AppHeader";
import StudentAPI from "modules/Classroom/api/student";
import { withCurrentTeacher } from "modules/Classroom/api/teacher/CurrentTeacher";

const INITIAL_STATE = { isLoading: true, peopleList: [], filteredPeopleList: [] };
class StudentListScreen extends React.PureComponent {
  static navigationOptions = () => {
    return {
      header: null
    };
  };

  loadStudents = async () => {
    if(this._isMounted)
     this.setState({peopleList: []})
    const peopleList = await StudentAPI.getClassStudent(this.props.currentSchool.id, this.classId);
    if(this._isMounted)
      this.setState({ peopleList, filteredPeopleList: peopleList });
  }

  handleStudentPress = people => {
    const payload = {
      studentEmail: people.id
    }
    this.props.navigation.navigate("StudentProfile", payload);
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
      <View style={{ flex: 1, backgroundColor: "#E8EEE8" }}>
       <AppHeader
          navigation={this.props.navigation}
          title="Daftar Murid"
          style={{ backgroundColor: "white" }}
        />
        <View style={{ padding: 16 }}>
          <MySearchbar 
            onSubmitEditing={this.handleSearchPress}
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
