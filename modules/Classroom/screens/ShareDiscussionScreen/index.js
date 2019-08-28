import React from "react";
import { View, FlatList, StyleSheet } from "react-native";
import { Searchbar } from "react-native-paper";
import ShareDiscussionListItem from "modules/Classroom/components/ShareDiscussionListItem";
import AppHeader from "src/components/AppHeader";
import StudentAPI from "modules/Classroom/api/student";
import Button from "src/components/Button";

const INITIAL_STATE = { isLoading: true, isShareLoading: false ,searchText: "", peopleList:[], filteredPeopleList:[] };

export default class ShareDiscussionScreen extends React.PureComponent {
  static navigationOptions = ({ navigation }) => {
    return {
      header: (
        <AppHeader
          navigation={navigation}
          title="Bagikan ke"
          style={{ backgroundColor: "transparent" }}
        />
      )
    };
  };

  loadStudents = async () => {
    this.setState({ peopleList: [] });

    const peopleList = await StudentAPI.getClassStudent(this.schoolId, this.classId);
    this.setState({ peopleList, filteredPeopleList: peopleList });
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

  handleStudentPress = people => {
    const clonedFilteredPeopleList = JSON.parse(JSON.stringify(this.state.filteredPeopleList)) 
    const clonedPeopleList = JSON.parse(JSON.stringify(this.state.peopleList)) 
    this.setState({filteredPeopleList: [], peopleList: []})

    const filteredPeopleList = clonedFilteredPeopleList.map((data) => {
      if(data.id==people.id){
        if(people.checked){
          return {...data, checked: false}
        }else{
          return {...data, checked: true}
        }
      }
      return {...data}
    })
    const peopleList = clonedPeopleList.map((data) => {
      if(data.id==people.id){
        if(people.checked){
          return {...data, checked: false}
        }else{
          return {...data, checked: true}
        }
      }
      return {...data}
    })
    this.setState({filteredPeopleList, peopleList})
  }

  constructor(props) {
    super(props);
    this.state = INITIAL_STATE;
    this.loadStudents = this.loadStudents.bind(this);
    this.handleStudentPress = this.handleStudentPress.bind(this);
    this.handleSearchPress = this.handleSearchPress.bind(this);
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
              <ShareDiscussionListItem 
                onPress={() => this.handleStudentPress(item)}
                schoolId={this.schoolId} student={item}/>
            )
          }}
        />
        <View style={{ backgroundColor: "#fff" }}>
          <Button
            text="Bagikan"
            isLoading={this.state.isShareLoading}
            style={{marginHorizontal: 16}}
          />      
        </View>
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
