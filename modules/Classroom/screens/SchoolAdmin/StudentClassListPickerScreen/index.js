import React from "react";
import { View, FlatList } from "react-native";
import MySearchbar from "src/components/MySearchbar"
import ClassAPI from "modules/Classroom/api/class";
import ClassListItem from "modules/Classroom/components/ClassListItem";
import AppHeader from "src/components/AppHeader";
import StudentAPI from "modules/Classroom/api/student";
import { withCurrentSchoolAdmin } from "modules/Classroom/api/schooladmin/CurrentSchoolAdmin";

const INITIAL_STATE = { isLoading: true, classList:[], filteredClassList:[] };

class StudentClassListPickerScreen extends React.PureComponent {
  static navigationOptions = () => {
    return {
      header: null
    };
  };

  loadClasses = async () => {
    if(this._isMounted){
      this.setState({classList: []})
    }
    this.setState({classList: []})
    const classList = await ClassAPI.getActiveClasses(this.props.currentSchool.id);
    if(this._isMounted){
      this.setState({ classList, filteredClassList: classList })
    }
  }

  handleClassPress = class_ => {
    const classId = class_.id;
    StudentAPI.addStudentClass(this.studentEmail, this.props.currentSchool.id, classId).then(() => {
      this.setState({ isLoading: false });
      const { navigation } = this.props;
      navigation.state.params.onRefresh();
      navigation.goBack();
    }).catch(err => console.log(err));
  
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
    this.studentEmail = this.props.navigation.getParam("studentEmail", "");
    this.loadClasses = this.loadClasses.bind(this);
    this.handleClassPress = this.handleClassPress.bind(this);
    this.handleSearchPress = this.handleSearchPress.bind(this);
  }


  componentDidMount(){
    this._isMounted = true;
    this.loadClasses();
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  render() {
    return (
      <View style={{ flex: 1, backgroundColor: "#E8EEE8" }}>
        <AppHeader
            navigation={this.props.navigation}
            title="Tambahkan Kelas"
            style={{ backgroundColor: "white" }}
          />
        <View style={{ padding: 16 }}>
        <MySearchbar 
            onSubmitEditing={this.handleSearchPress}
            placeholder="Cari Kelas" />
        </View>
        <FlatList
          style={{ backgroundColor: "white" }}
          data={this.state.filteredClassList}
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

export default withCurrentSchoolAdmin(StudentClassListPickerScreen)
