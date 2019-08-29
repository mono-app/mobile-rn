import React from "react";
import { View, FlatList } from "react-native";
import MySearchbar from "src/components/MySearchbar"
import TeacherAPI from "modules/Classroom/api/teacher";
import TeacherListItem from "modules/Classroom/components/TeacherListItem";
import AppHeader from "src/components/AppHeader";
import { withCurrentSchoolAdmin } from "modules/Classroom/api/schooladmin/CurrentSchoolAdmin";

const INITIAL_STATE = { isLoading: true, peopleList: [], filteredPeopleList: [] };

class TeacherListScreen extends React.PureComponent {
  static navigationOptions = ({ navigation }) => {
    return {
      header: (
        <AppHeader
          navigation={navigation}
          title="Data Master Guru"
          style={{ backgroundColor: "transparent" }}
        />
      )
    };
  };

  loadTeachers = async () => {
    this.setState({peopleList: []})
    const peopleList = await TeacherAPI.getTeachers(this.props.currentSchool.id);
    this.setState({ peopleList, filteredPeopleList: peopleList });
  }

  handleTeacherPress = people => {
    const payload = {
      teacherEmail: people.id
    }
    this.props.navigation.navigate("TeacherProfile", payload);
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
    this.loadTeachers = this.loadTeachers.bind(this);
    this.handleTeacherPress = this.handleTeacherPress.bind(this);
    this.handleSearchPress = this.handleSearchPress.bind(this);
  }

  componentDidMount(){
    this.loadTeachers();
  }

  render() {
    return (
      <View style={{ flex: 1, backgroundColor: "#E8EEE8" }}>
        <View style={{ padding: 16 }}>
          <MySearchbar 
            onSubmitEditing={this.handleSearchPress}
            placeholder="Cari Guru" />
        </View>
        <FlatList
          style={{ backgroundColor: "white" }}
          data={this.state.filteredPeopleList}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => {
            return (
              <TeacherListItem 
                onPress={() => this.handleTeacherPress(item)}
                teacher={item}/>
            )
          }}
        />
      </View>
    );
  }
}

export default withCurrentSchoolAdmin(TeacherListScreen)
