import React from "react";
import { View, FlatList } from "react-native";
import MySearchbar from "src/components/MySearchbar"
import StudentListItem from "modules/Classroom/components/StudentListItem";
import AppHeader from "src/components/AppHeader";
import StudentAPI from "modules/Classroom/api/student";
import { withCurrentSchoolAdmin } from "modules/Classroom/api/schooladmin/CurrentSchoolAdmin";

const INITIAL_STATE = { isLoading: true, peopleList: [], filteredPeopleList: [] };


class StudentListScreen extends React.PureComponent {
  static navigationOptions = ({ navigation }) => {
    return {
      header: (
        <AppHeader
          navigation={navigation}
          title="Data Master Murid"
          style={{ backgroundColor: "transparent" }}
        />
      )
    };
  };

  loadStudents = async () => {
    this.setState({peopleList: []})
    const peopleList = await StudentAPI.getStudents(this.props.currentSchool.id);
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
                student={item}/>
            )
          }}
        />
      </View>
    );
  }
}

export default withCurrentSchoolAdmin(StudentListScreen)
