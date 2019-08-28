import React from "react";
import { View, FlatList } from "react-native";
import { Searchbar } from "react-native-paper";
import ClassAPI from "modules/Classroom/api/class";
import ClassListItem from "modules/Classroom/components/ClassListItem";
import AppHeader from "src/components/AppHeader";
import { withCurrentStudent } from "modules/Classroom/api/student/CurrentStudent";

const INITIAL_STATE = { isLoading: true, searchText: "", classList:[], filteredClassList:[] };
class MyClassScreen extends React.PureComponent {
  static navigationOptions = ({ navigation }) => {
    return {
      header: (
        <AppHeader
          navigation={navigation}
          title="Kelas Saya"
          style={{ backgroundColor: "transparent" }}
        />
      )
    };
  };

  loadClasses = async () => {
    this.setState({classList: []})
    const classList = await ClassAPI.getUserActiveClasses(this.props.currentSchool.id, this.props.currentStudent.email);
    this.setState({ classList, filteredClassList: classList });
   }

  handleClassPress = class_ => {
     const payload = {
       schoolId: this.props.currentSchool.id,
       classId: class_.id
     }
     this.props.navigation.navigate("ClassDetails", payload);
  }

  handleSearchPress = () => {
    this.setState({filteredClassList: []})

    const clonedClassList = JSON.parse(JSON.stringify(this.state.classList))
    const newSearchText = JSON.parse(JSON.stringify(this.state.searchText)) 
    if(this.state.searchText){

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
    this.loadClasses = this.loadClasses.bind(this);
    this.handleClassPress = this.handleClassPress.bind(this);
    this.handleSearchPress = this.handleSearchPress.bind(this);
  }

  componentDidMount(){
    this.loadClasses();
  }

  render() {
    return (
      <View style={{ flex: 1, backgroundColor: "#E8EEE8" }}>
        <View style={{ padding: 16 }}>
          <Searchbar 
              onChangeText={searchText => {this.setState({searchText})}}
              onSubmitEditing={this.handleSearchPress}
              value={this.state.searchText}
              placeholder="Cari Kelas" />
        </View>
        <FlatList
          style={{ flex:1, backgroundColor: "white" }}
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
export default withCurrentStudent(MyClassScreen)