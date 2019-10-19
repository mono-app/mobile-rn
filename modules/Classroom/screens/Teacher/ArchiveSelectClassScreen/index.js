import React from "react";
import { View, FlatList } from "react-native";
import MySearchbar from "src/components/MySearchbar"
import ClassAPI from "modules/Classroom/api/class";
import ClassListItem from "modules/Classroom/components/ClassListItem";
import AppHeader from "src/components/AppHeader";
import { withCurrentTeacher } from "modules/Classroom/api/teacher/CurrentTeacher";

const INITIAL_STATE = { isRefreshing: true, classList:[], filteredClassList:[] };

class ArchiveSelectClassScreen extends React.PureComponent {
  static navigationOptions = () => {
    return {
      header: null
    };
  };

  handleRefresh = () => this.loadClasses()

  loadClasses = async () => {
    if(this._isMounted) this.setState({classList: [], isRefreshing: true})
    const classList = await ClassAPI.getUserActiveClasses(this.props.currentSchool.id, this.props.currentTeacher.email);
    if(this._isMounted) this.setState({ classList, filteredClassList: classList, isRefreshing: false });
  }

  handleClassPress = async theClass => {
    const class_ = await ClassAPI.getDetail(this.props.currentSchool.id, theClass.id);
    const payload = {
      classId: class_.id,
      subject: class_.subject,
      subjectDesc: class_.room+" | "+class_.academicYear+" | Semester "+class_.semester
    }
    this.props.navigation.navigate("TaskArchiveList", payload);
  }

  handleSearchPress = (searchText) => {
    this.setState({filteredClassList: []})

    const clonedClassList = JSON.parse(JSON.stringify(this.state.classList))
    const newSearchText = JSON.parse(JSON.stringify(searchText)) 
    if(searchText){

      const filteredClassList = clonedClassList.filter((class_) => {
        return class_.subject.toLowerCase().indexOf(newSearchText.toLowerCase()) >= 0
      })
      this.setState({filteredClassList})
    } else {
      this.setState({filteredClassList: clonedClassList})
    }
  }

  constructor(props) {
    super(props);
    this.state = INITIAL_STATE;
    this._isMounted = null
    this.loadClasses = this.loadClasses.bind(this);
    this.handleClassPress = this.handleClassPress.bind(this);
    this.handleSearchPress = this.handleSearchPress.bind(this);
    this.handleRefresh = this.handleRefresh.bind(this);
  }

  componentDidMount(){
    this._isMounted=true
    this.loadClasses();
  }
  
  componentWillUnmount() {
    this._isMounted = false;
  }

  render() {
    return (
      <View style={{ flex: 1, backgroundColor: "#fff" }}>
         <AppHeader
          navigation={this.props.navigation}
          title="Arsip Tugas"
          style={{ backgroundColor: "white" }}
        />
        <View style={{ margin: 16 }}>
          <MySearchbar 
            onSubmitEditing={this.handleSearchPress}
            placeholder="Cari Kelas" />
        </View>
        <FlatList
          style={{ backgroundColor: "white" }}
          data={this.state.filteredClassList}
          refreshing={this.state.isRefreshing} 
          onRefresh={this.handleRefresh} 
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => {
            return (
              <ClassListItem 
                onPress={() => this.handleClassPress(item)}
                schoolId={this.props.currentSchool.id} class_={item}/>
            )
          }}
        />
      </View>
    );
  }
}

export default withCurrentTeacher(ArchiveSelectClassScreen)
