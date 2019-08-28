import React from "react";
import { View, FlatList, StyleSheet, TouchableOpacity } from "react-native";
import { Searchbar, Text } from "react-native-paper";
import ClassAPI from "modules/Classroom/api/class";
import ClassListItem from "modules/Classroom/components/ClassListItem";
import AppHeader from "src/components/AppHeader";
import Icon from 'react-native-vector-icons/FontAwesome';

const INITIAL_STATE = { isLoading: true, searchText: "", classList:[], filteredClassList:[]   };

export default class TeacherClassListScreen extends React.PureComponent {
  static navigationOptions = ({ navigation }) => {
    return {
      header: (
        <AppHeader
          navigation={navigation}
          title="Daftar Kelas Guru"
          style={{ backgroundColor: "transparent" }}
        />
      )
    };
  };

  loadClasses = async () => {
    this.setState({classList: []})
    const classList = await ClassAPI.getUserActiveClasses(this.schoolId, this.teacherEmail);
    this.setState({ classList, filteredClassList: classList });
   }

  handleClassPress = class_ => {
    const payload = {
      schoolId: this.schoolId,
      classId: class_.id
    }
    this.props.navigation.navigate("ClassProfile", payload);
  }

  handleAddClassPress = () => {
    const payload = {
      schoolId: this.schoolId,
      teacherEmail: this.teacherEmail,
      onRefresh: this.loadClasses
    }
    this.props.navigation.navigate("TeacherClassListPicker",  payload);
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
    this.schoolId = this.props.navigation.getParam("schoolId", "");
    this.teacherEmail = this.props.navigation.getParam("teacherEmail", "");
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
               TAMBAHKAN KELAS
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
                schoolId={this.schoolId} class_={item}/>
            )
          }}
        />
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
