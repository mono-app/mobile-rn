import React from "react";
import { View, FlatList } from "react-native";
import MySearchbar from "src/components/MySearchbar"
import StudentListItem from "modules/Classroom/components/StudentListItem";
import AppHeader from "src/components/AppHeader";
import StudentAPI from "modules/Classroom/api/student";
import { withCurrentStudent } from "modules/Classroom/api/student/CurrentStudent";
import { withTranslation } from 'react-i18next';
import { Text } from "react-native-paper"

const INITIAL_STATE = { isRefreshing: true, peopleList:[], filteredPeopleList:[] };

class StudentListScreen extends React.PureComponent {
  static navigationOptions = () => {
    return {
      header: null
    };
  };

  handleRefresh = () => this.loadStudents()

  loadStudents = async () => {
    if(this._isMounted)
      this.setState({ peopleList: [], isRefreshing:true });

    const peopleList = await StudentAPI.getClassStudent(this.props.currentSchool.id, this.classId);
    if(this._isMounted)
      this.setState({ peopleList, filteredPeopleList: peopleList, isRefreshing:false });
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

  handleStudentPress = people => {
    const payload = {
      schoolId: this.props.currentSchool.id,
      studentId: people.id
    }
    this.props.navigation.navigate("StudentProfile", payload);
  }

  constructor(props) {
    super(props);
    this.state = INITIAL_STATE;
    this._isMounted = null
    this.classId = this.props.navigation.getParam("classId", "");
    this.loadStudents = this.loadStudents.bind(this);
    this.handleStudentPress = this.handleStudentPress.bind(this);
    this.handleSearchPress = this.handleSearchPress.bind(this);
    this.handleRefresh = this.handleRefresh.bind(this);

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
          title={this.props.t("studentList")}
          style={{ backgroundColor: "white" }}
        />
        <View style={{ padding: 16 }}>
          <MySearchbar 
            onSubmitEditing={this.handleSearchPress}
            placeholder={this.props.t("searchStudent")} />
        </View>
        {(!this.state.isRefreshing && this.state.filteredPeopleList.length===0)?<Text style={{marginTop:16, textAlign:"center"}}>{this.props.t("listEmpty")}</Text>:null}
        <FlatList
          style={{ backgroundColor: "white" }}
          data={this.state.filteredPeopleList}
          refreshing={this.state.isRefreshing} 
          onRefresh={this.handleRefresh} 
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

export default withTranslation()(withCurrentStudent(StudentListScreen))
