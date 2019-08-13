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
import CurrentUserAPI from "src/api/people/CurrentUser";


const INITIAL_STATE = {
  isLoading: false,
  schoolList: [],
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
    const currentUserEmail = await CurrentUserAPI.getCurrentUserEmail()
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

  constructor(props){
    super(props)
    this.state = INITIAL_STATE
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
            <Searchbar style={{backgroundColor: "#E8EEE8"}} placeholder="Cari Sekolah" />
            <View style={{marginTop:36}}/>
            <FlatList
              data={this.state.schoolList}
              renderItem={({ item, index }) => {
                return (
                  <SchoolListItem 
                    onPress={() => this.handleSchoolPress(item)}
                    key={index} school={item}/>
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

