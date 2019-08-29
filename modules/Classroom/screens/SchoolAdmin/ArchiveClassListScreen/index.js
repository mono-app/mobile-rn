import React from "react";
import { View, FlatList, StyleSheet, TouchableOpacity } from "react-native";
import { Searchbar, Text } from "react-native-paper";
import ClassAPI from "../../../api/class";
import ClassListItem from "../../../components/ClassListItem";
import AppHeader from "src/components/AppHeader";
import Icon from 'react-native-vector-icons/FontAwesome';
import { withCurrentSchoolAdmin } from "modules/Classroom/api/schooladmin/CurrentSchoolAdmin";

const INITIAL_STATE = { isLoading: true, searchText: "", classList:[], filteredClassList:[]   };

class ArchiveClassListScreen extends React.PureComponent {
  static navigationOptions = ({ navigation }) => {
    return {
      header: (
        <AppHeader
          navigation={navigation}
          title="Arsip Kelas"
          style={{ backgroundColor: "transparent" }}
        />
      )
    };
  };

  loadClasses = async () => {
    this.setState({classList: []})
    const classList = await ClassAPI.getArchiveClasses(this.props.currentSchool.id);
    this.setState({ classList, filteredClassList: classList });
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
    this.handleAddClassPress = this.handleAddClassPress.bind(this);
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

