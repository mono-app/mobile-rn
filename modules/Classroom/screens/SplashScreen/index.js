import React from "react";
import { StackActions } from "react-navigation";
import { View,FlatList, StyleSheet } from "react-native";
import Navigator from "src/api/navigator";
import { Appbar, Text, ActivityIndicator, Dialog, Caption, Subheading, Headline } from "react-native-paper";
import SchoolListItem from "modules/Classroom/components/SchoolListItem"
import TeacherAPI from "modules/Classroom/api/teacher"
import StudentAPI from "modules/Classroom/api/student"
import SchoolAdminAPI from "modules/Classroom/api/schooladmin"
import SchoolAPI from "modules/Classroom/api/school"
import { withCurrentUser } from "src/api/people/CurrentUser"
import MySearchbar from "src/components/MySearchbar"

const INITIAL_STATE = {
  isLoading: false,
  schoolList: [],
  filteredSchoolList: [],
  schoolCount: 1
};

class SplashScreen extends React.PureComponent {
  
  handleBackPress = () => {
    const navigator = new Navigator(this.props.navigation);
    navigator.resetTo("Home", StackActions, {key: "AppTab"});
  }

  loadSchools = async () => {
    this.setState({schoolList: []});

    const schoolList = await SchoolAPI.getUserSchools(this.props.currentUser.email);
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

    if(await SchoolAdminAPI.isSchoolAdmin(school.id, this.props.currentUser.email)){
      this.props.navigation.navigate("SchoolAdmin");
    }else if(await TeacherAPI.isTeacher(school.id, this.props.currentUser.email)){
      this.props.navigation.navigate("Teacher");
    }else if (await StudentAPI.isStudent(school.id, this.props.currentUser.email)) {
      this.props.navigation.navigate("Student");
    }
  }

  handleSearchPress = (searchText) => {
    this.setState({filteredSchoolList: []})

    const clonedSchoolList = JSON.parse(JSON.stringify(this.state.schoolList))
    const newSearchText = JSON.parse(JSON.stringify(searchText)) 
    if(searchText){

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
            <MySearchbar 
              style={{backgroundColor: "#E8EEE8"}} 
              onSubmitEditing={this.handleSearchPress}
              placeholder="Cari Sekolah" />
            <View style={{marginTop:36}}/>
            <FlatList
              data={this.state.filteredSchoolList}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => {
                return (
                  <SchoolListItem 
                    onPress={() => this.handleSchoolPress(item)}
                    currentUserEmail={this.props.currentUser.email} school={item}/>
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

export default withCurrentUser(SplashScreen)