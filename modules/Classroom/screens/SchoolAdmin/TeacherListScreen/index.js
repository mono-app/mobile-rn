import React from "react";
import { View, FlatList, StyleSheet } from "react-native";
import { Searchbar } from "react-native-paper";
import TeacherAPI from "../../../api/teacher";
import TeacherListItem from "../../../components/TeacherListItem";
import AppHeader from "src/components/AppHeader";

const INITIAL_STATE = { isLoading: true, peopleList: [], filteredPeopleList: [], searchText: "" };

export default class TeacherListScreen extends React.PureComponent {
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
    const peopleList = await TeacherAPI.getTeachers(this.schoolId);
    this.setState({ peopleList, filteredPeopleList: peopleList });
  }

  handleTeacherPress = people => {
    const payload = {
      schoolId: this.schoolId,
      teacherEmail: people.id
    }
    this.props.navigation.navigate("TeacherProfile", payload);
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
          <Searchbar 
            onChangeText={searchText => {this.setState({searchText})}}
            onSubmitEditing={this.handleSearchPress}
            value={this.state.searchText}
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

const styles = StyleSheet.create({
  listItemContainer: {
    padding: 16,
    flexDirection: "row",
    justifyContent: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#E8EEE8"
  }
});
