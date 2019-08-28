import React from "react";
import { StackActions } from "react-navigation";
import { View,FlatList, StyleSheet } from "react-native";
import Navigator from "src/api/navigator";
import { Appbar, Text, ActivityIndicator, Dialog, Searchbar,Caption, Subheading, Headline } from "react-native-paper";
import SchoolListItem from "modules/Classroom/components/SchoolListItem"
import TeacherAPI from "modules/Classroom/api/teacher"
import StudentAPI from "modules/Classroom/api/student"
import SchoolAdminAPI from "modules/Classroom/api/schooladmin"
import SchoolAPI from "modules/Classroom/api/school"


const INITIAL_STATE = {
  isLoading: false,
  schoolList: [],
  filteredSchoolList: [],
  searchText: "",
  schoolCount: 1,
  currentUserEmail: ""
};
export default class SplashClass extends React.PureComponent {
  
  handleBackPress = () => {
    const navigator = new Navigator(this.props.navigation);
    navigator.resetTo("Home", StackActions, {key: "AppTab"});
  }

  loadSchools = async () => {

    this.setState({schoolList: []});
    const currentUserEmail = this.props.currentUser.email

    this.setState({currentUserEmail})

    const schoolList = await SchoolAPI.getUserSchools(this.state.currentUserEmail);
    this.setState({schoolCount: schoolList.length, schoolList})
    if(schoolList.length==1){
      this.redirectScreen(schoolList[0])
    }
  }

  handleSchoolPress =  async (school) => {
    this.redirectScreen(school)
  }

  redirectScreen = async (school) => {

    const clonedSchoolId = JSON.parse(JSON.stringify(school.id))
    SchoolAPI.currentSchoolId = clonedSchoolId

    if(await SchoolAdminAPI.isSchoolAdmin(school.id, this.state.currentUserEmail)){
      this.props.navigation.navigate("Student");
    }else if(await TeacherAPI.isTeacher(school.id, this.state.currentUserEmail)){
      this.props.navigation.navigate("Teacher");
    }else if (await StudentAPI.isStudent(school.id, this.state.currentUserEmail)) {
      this.props.navigation.navigate("Student");
    }
  }

  handleSearchPress = () => {
    this.setState({filteredSchoolList: []})

    const clonedSchoolList = JSON.parse(JSON.stringify(this.state.schoolList))
    const newSearchText = JSON.parse(JSON.stringify(this.state.searchText)) 
    if(this.state.searchText){

      const filteredSchoolList = clonedSchoolList.filter((school) => {
        return school.name.toLowerCase().indexOf(newSearchText.toLowerCase()) >= 0
      })
      this.setState({filteredSchoolList})
    } else {
      this.setState({filteredSchoolList: clonedSchoolList})
    }
  }

  constructor(props){
    super(props)
    this.state = INITIAL_STATE
    this.loadSchools = this.loadSchools.bind(this)
    this.handleSchoolPress = this.handleSchoolPress.bind(this)
    this.handleBackPress = this.handleBackPress.bind(this)
    this.handleSearchPress = this.handleSearchPress.bind(this)
    this.redirectScreen = this.redirectScreen.bind(this)
  }

  componentDidMount(){
    this.loadSchools();
  }

  render() {
    if(this.state.schoolCount==1){
      return (
        <Dialog visible={true}>
          <Dialog.Content style={{ flexDirection: "row", justifyContent: "space-evenly" }}>
            <ActivityIndicator/>
            <View>
              <Text>Sedang memuat data</Text>
              <Caption>Harap tunggu...</Caption>
            </View>
          </Dialog.Content>
        </Dialog>
      )
    }

    return (
      <View style={styles.container}>
        <Appbar.Header style={{ backgroundColor: "white" }}>
            <Appbar.BackAction onPress={this.handleBackPress}/>
          <Appbar.Content title={"Classroom"}/>
        </Appbar.Header>
        <View style={{flex: 1, backgroundColor: "white", marginTop: 16}}>
          <View style={{marginTop:36}}/>
          <Headline style={{alignSelf: "center"}}>Selamat Datang di Classroom</Headline>
          <Subheading style={{alignSelf: "center"}}>Silahkan pilih asal sekolah</Subheading>

          <View style={{ padding: 16 }}>
            <Searchbar 
              style={{backgroundColor: "#E8EEE8"}} 
              onChangeText={searchText => {this.setState({searchText})}}
              onSubmitEditing={this.handleSearchPress}
              value={this.state.searchText}
              placeholder="Cari Sekolah" />
            <View style={{marginTop:36}}/>
            <FlatList
              data={this.state.filteredSchoolList}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => {
                return (
                  <SchoolListItem 
                    onPress={() => this.handleSchoolPress(item)}
                    currentUserEmail={this.state.currentUserEmail} school={item}/>
                )
              }}
            />
          </View>
        </View>
      </View>);
  }
}


const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#E8EEE8"},
  
});

