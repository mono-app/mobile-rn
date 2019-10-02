import React from "react";
import { View, FlatList, TouchableOpacity } from "react-native";
import { Text } from "react-native-paper";
import MySearchbar from "src/components/MySearchbar"
import ClassAPI from "modules/Classroom/api/class";
import ClassListItem from "modules/Classroom/components/ClassListItem";
import AppHeader from "src/components/AppHeader";
import Icon from 'react-native-vector-icons/FontAwesome';
import { withCurrentSchoolAdmin } from "modules/Classroom/api/schooladmin/CurrentSchoolAdmin";

const INITIAL_STATE = { isLoading: true, classList:[], filteredClassList:[]   };

class ArchiveClassListScreen extends React.PureComponent {
  static navigationOptions = () => {
    return {
      header: null
    };
  };

  loadClasses = async () => {
    if(this._isMounted){
      this.setState({classList: []})
    }
    const classList = await ClassAPI.getArchiveClasses(this.props.currentSchool.id);
    if(this._isMounted){
      this.setState({ classList, filteredClassList: classList });
    }
   }

  handleClassPress = class_ => {
    const payload = {
      classId: class_.id,
      onRefresh: this.loadClasses
    }
    this.props.navigation.navigate("ArchiveClassDetails", payload);
  }

  handleAddClassPress = () => {
    const payload = {
      teacherEmail: this.teacherEmail,
      onRefresh: this.loadClasses
    }
    this.props.navigation.navigate("ArchiveClassListPicker",  payload);
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
    this.handleAddClassPress = this.handleAddClassPress.bind(this);
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
          title="Arsip Kelas"
          style={{ backgroundColor: "white" }}
        />
        <View style={{ padding: 16 }}>
          <MySearchbar 
            onSubmitEditing={this.handleSearchPress}
            placeholder="Cari Kelas" />
        </View>
        
        <View style={{backgroundColor: "#0ead69",
                      padding: 16}}>
          <TouchableOpacity onPress={this.handleAddClassPress} style={{ display:"flex", flexDirection:"row",alignItems:"center"}}>
          <Icon name="plus" size={16} color="#fff" style={{marginTop: 2, marginRight: 4}}/> 
            <Text style={{fontWeight:"bold", color:"#fff"}}>
               TAMBAH ARSIP KELAS
            </Text>
          </TouchableOpacity>
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
export default withCurrentSchoolAdmin(ArchiveClassListScreen)

