import React from "react";
import { View, FlatList } from "react-native";
import MySearchbar from "src/components/MySearchbar"
import AnnouncementListItem from "modules/Classroom/components/AnnouncementListItem";
import AppHeader from "src/components/AppHeader";
import AnnouncementAPI from "modules/Classroom/api/announcement";
import ClassAPI from "modules/Classroom/api/class";
import { withCurrentStudent } from "modules/Classroom/api/student/CurrentStudent";

const INITIAL_STATE = { isRefreshing: true, announcementList:[], filteredAnnouncementList:[]  };

class AnnouncementScreen extends React.PureComponent {
  static navigationOptions = () => {
    return {
      header: null
    };
  };

  handleRefresh = () => this.loadAnnouncements()

  loadAnnouncements = async () => {
    if(this._isMounted) this.setState({ announcementList: [], isRefreshing:true })
    const announcementList = await AnnouncementAPI.getStudentAnnouncements(this.props.currentSchool.id,this.props.currentStudent.email)
   
    let clonedAnnouncementList = JSON.parse(JSON.stringify(announcementList));
    clonedAnnouncementList = clonedAnnouncementList.map((obj)=>{
      let searchQuery = "";
      if(obj.type=="task"){
        searchQuery= "Pengumpulan Tugas "+ obj.task.title+" pada kelas "+ obj.class.subject
      }
      return {...obj, searchQuery}
    })
    if(this._isMounted) this.setState({ announcementList:clonedAnnouncementList, filteredAnnouncementList: clonedAnnouncementList, isRefreshing:false });
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

      this.props.navigation.navigate("TaskDetails", payload)
    }
  }

  handleSearchPress = (searchText) => {
    this.setState({filteredAnnouncementList: []})

    const clonedAnnouncementList = JSON.parse(JSON.stringify(this.state.announcementList))
    const newSearchText = JSON.parse(JSON.stringify(searchText)) 
    if(searchText){
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
    this._isMounted = null
    this.loadAnnouncements = this.loadAnnouncements.bind(this);
    this.handleAnnouncementPress = this.handleAnnouncementPress.bind(this);
    this.handleSearchPress = this.handleSearchPress.bind(this);
    this.handleRefresh = this.handleRefresh.bind(this);
  }

  componentDidMount(){
    this._isMounted = true;
    this.loadAnnouncements();
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  render() {
    return (
      <View style={{ flex: 1, backgroundColor: "#fff" }}>
       <AppHeader
          navigation={this.props.navigation}
          title="Pengumuman"
          style={{ backgroundColor: "white" }}
        />
        <View style={{ padding: 16 }}>
          <MySearchbar 
            onSubmitEditing={this.handleSearchPress}
            placeholder="Cari Pengumuman" />
        </View>
        <FlatList
          style={{ backgroundColor: "white" }}
          data={this.state.filteredAnnouncementList}
          refreshing={this.state.isRefreshing} 
          onRefresh={this.handleRefresh} 
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