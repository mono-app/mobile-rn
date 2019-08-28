import React from "react";
import { View, FlatList, StyleSheet } from "react-native";
import { Searchbar } from "react-native-paper";
import AnnouncementListItem from "modules/Classroom/components/AnnouncementListItem";
import AppHeader from "src/components/AppHeader";
import AnnouncementAPI from "modules/Classroom/api/announcement";
import ClassAPI from "modules/Classroom/api/class";
import { withCurrentStudent } from "modules/Classroom/api/student/CurrentStudent";

const INITIAL_STATE = { isLoading: true, searchText: "", searchText: "", announcementList:[], filteredAnnouncementList:[]  };

class AnnouncementScreen extends React.PureComponent {
  static navigationOptions = ({ navigation }) => {
    return {
      header: (
        <AppHeader
          navigation={navigation}
          title="Pengumuman"
          style={{ backgroundColor: "transparent" }}
        />
      )
    };
  };

  loadAnnouncements = async () => {
    this.setState({ announcementList: [] });
   
    const announcementList = await AnnouncementAPI.getStudentAnnouncements(this.props.currentSchool.id,this.props.currentStudent.email)
   
    let clonedAnnouncementList = JSON.parse(JSON.stringify(announcementList));
    clonedAnnouncementList = clonedAnnouncementList.map((obj)=>{
      let searchQuery = "";
      if(obj.type=="task"){
        searchQuery= "Pengumpulan Tugas "+ obj.task.title+" pada kelas "+ obj.class.subject
      }
      return {...obj, searchQuery}
    })

    this.setState({ announcementList:clonedAnnouncementList, filteredAnnouncementList: clonedAnnouncementList });
  }

  handleAnnouncementPress = async item => {
    if(item.type==="task"){
      const class_ = await ClassAPI.getDetail(this.props.currentSchool.id, item.class.id);
      const payload = {
        schoolId: this.props.currentSchool.id,
        taskId: item.task.id,
        classId: class_.id,
        subject: class_.subject,
        subjectDesc: class_.room+" | "+class_.academicYear+" | Semester "+class_.semester
      }

      // const resetAction = StackActions.reset({
      //   index:1,
      //   key: "Student",
      //   actions:[
      //     NavigationActions.navigate({ routeName: 'TaskList' }),
      //     NavigationActions.navigate({ routeName: 'TaskDetails' }),
      //   ],
      //   params: payload
      // });

      // this.props.navigation.dispatch(resetAction);
      this.props.navigation.navigate("TaskDetails", payload)
    }
  }

  handleSearchPress = () => {
    this.setState({filteredAnnouncementList: []})

    const clonedAnnouncementList = JSON.parse(JSON.stringify(this.state.announcementList))
    const newSearchText = JSON.parse(JSON.stringify(this.state.searchText)) 
    if(this.state.searchText){

      const filteredAnnouncementList = clonedAnnouncementList.filter((announcement) => {
        return announcement.searchQuery.toLowerCase().indexOf(newSearchText.toLowerCase()) >= 0
      })
      this.setState({filteredAnnouncementList})
    } else {
      this.setState({filteredAnnouncementList: clonedAnnouncementList})
    }
  }

  constructor(props) {
    super(props);
    this.state = INITIAL_STATE;
    this.loadAnnouncements = this.loadAnnouncements.bind(this);
    this.handleAnnouncementPress = this.handleAnnouncementPress.bind(this);
    this.handleSearchPress = this.handleSearchPress.bind(this);
  }

  componentDidMount(){
    this.loadAnnouncements();
  }


  render() {
    return (
      <View style={{ flex: 1, backgroundColor: "#E8EEE8" }}>
        <View style={{ padding: 16 }}>
          <Searchbar 
            onChangeText={searchText => {this.setState({searchText})}}
            onSubmitEditing={this.handleSearchPress}
            value={this.state.searchText}
            placeholder="Cari Pengumuman" />
        </View>
        <FlatList
          style={{ backgroundColor: "white" }}
          data={this.state.filteredAnnouncementList}
          keyExtractor={(item) => item.id}
          renderItem={({ item, index }) => {
            return (
            <AnnouncementListItem 
                onPress={() => this.handleAnnouncementPress(item)} 
                announcement={item} 
                prevDueDate={(this.state.announcementList[index-1])? this.state.announcementList[index-1].task.dueDate:{} }
                isFirstRow={(index==0)}
                />
            )
          }}
        />
      </View>
    );
  }
}

export default withCurrentStudent(AnnouncementScreen)