import React from "react";
import { View, FlatList } from "react-native";
import MySearchbar from "src/components/MySearchbar"
import TeacherAPI from "modules/Classroom/api/teacher";
import TeacherListItem from "modules/Classroom/components/TeacherListItem";
import AppHeader from "src/components/AppHeader";
import { withCurrentSchoolAdmin } from "modules/Classroom/api/schooladmin/CurrentSchoolAdmin";
import { withTranslation } from 'react-i18next';
import { Text } from "react-native-paper";

const INITIAL_STATE = { isRefreshing: true, peopleList: [], filteredPeopleList: [] };

class TeacherListScreen extends React.PureComponent {
  static navigationOptions = () => {
    return {
      header: null
    };
  };

  handleRefresh = () => this.loadTeachers()

  loadTeachers = async () => {
    if(this._isMounted) this.setState({peopleList: [], isRefreshing: true})
    const peopleList = await TeacherAPI.getTeachers(this.props.currentSchool.id);
    if(this._isMounted) this.setState({ peopleList, filteredPeopleList: peopleList, isRefreshing: false });
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
    this._isMounted = null
    this.loadTeachers = this.loadTeachers.bind(this);
    this.handleTeacherPress = this.handleTeacherPress.bind(this);
    this.handleSearchPress = this.handleSearchPress.bind(this);
    this.handleRefresh = this.handleRefresh.bind(this);
  }

  componentDidMount(){
    this._isMounted = true
    this.loadTeachers();
  }
  
  componentWillUnmount() {
    this._isMounted = false
  }

  render() {
    return (
      <View style={{ flex: 1, backgroundColor: "#fff" }}>
        <AppHeader
            navigation={this.props.navigation}
            title={this.props.t("teacherMasterData")}
            style={{ backgroundColor: "white" }}
          />
        <View style={{ padding: 16 }}>
          <MySearchbar 
            onSubmitEditing={this.handleSearchPress}
            placeholder={this.props.t("searchTeacher")} />
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

export default withTranslation()(withCurrentSchoolAdmin(TeacherListScreen))
