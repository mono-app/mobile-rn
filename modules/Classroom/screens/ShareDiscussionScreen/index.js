import React from "react";
import { View, FlatList, StyleSheet } from "react-native";
import MySearchbar from "src/components/MySearchbar"
import ShareDiscussionListItem from "modules/Classroom/components/ShareDiscussionListItem";
import AppHeader from "src/components/AppHeader";
import StudentAPI from "modules/Classroom/api/student";
import Button from "src/components/Button";
import { withCurrentUser } from "src/api/people/CurrentUser"
import { PersonalRoomsAPI } from "src/api/rooms";
import MessagesAPI from "src/api/messages";

const INITIAL_STATE = { isLoading: true, isShareLoading: false , peopleList:[], filteredPeopleList:[] };

class ShareDiscussionScreen extends React.PureComponent {
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
    const peopleListWithoutMe = await peopleList.filter((people) => {
        return people.id !== this.props.currentUser.email
      })
    this.setState({ peopleList: peopleListWithoutMe, filteredPeopleList: peopleListWithoutMe });
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

  handleSharePress = async () => {
    this.setState({isShareLoading: true})
    const clonedPeopleList = JSON.parse(JSON.stringify(this.state.peopleList))
    for(let i=0;i<clonedPeopleList.length;i++){
      if(clonedPeopleList[i].checked){
        const peopleEmail = clonedPeopleList[i].id
        const message = "Share Discussion, \nTitle: "+this.discussion.title
        const room = await PersonalRoomsAPI.createRoomIfNotExists(this.props.currentUser.email, peopleEmail);
        const schoolId = this.schoolId
        const classId = this.classId
        const taskId = this.taskId
        MessagesAPI.sendMessage(room.id, this.props.currentUser.email, message, "discussion-share", {discussion: {...this.discussion, schoolId, classId, taskId}});
      }
    }

    this.setState({isShareLoading:false})
    const {navigation} = this.props
    navigation.state.params.onComplete()
    navigation.goBack()
  }

  constructor(props) {
    super(props);
    this.state = INITIAL_STATE;
    this.schoolId = this.props.navigation.getParam("schoolId", "");
    this.classId = this.props.navigation.getParam("classId", "");
    this.taskId = this.props.navigation.getParam("taskId", "");
    this.discussion = this.props.navigation.getParam("discussion", {});
    this.loadStudents = this.loadStudents.bind(this);
    this.handleStudentPress = this.handleStudentPress.bind(this);
    this.handleSearchPress = this.handleSearchPress.bind(this);
    this.handleSharePress = this.handleSharePress.bind(this);
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
              <ShareDiscussionListItem 
                onPress={() => this.handleStudentPress(item)}
                student={item}/>
            )
          }}
        />
        <View style={{ backgroundColor: "#fff" }}>
          <Button
            text="Bagikan"
            isLoading={this.state.isShareLoading}
            style={{marginHorizontal: 16}}
            onPress={this.handleSharePress}
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
export default withCurrentUser(ShareDiscussionScreen)
