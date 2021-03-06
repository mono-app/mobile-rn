import React from "react";
import { View, FlatList, TouchableOpacity } from "react-native";
import { Text } from "react-native-paper";
import MySearchbar from "src/components/MySearchbar"
import ClassAPI from "modules/Classroom/api/class";
import ClassListItem from "modules/Classroom/components/ClassListItem";
import AppHeader from "src/components/AppHeader";
import Icon from 'react-native-vector-icons/FontAwesome';
import { withCurrentSchoolAdmin } from "modules/Classroom/api/schooladmin/CurrentSchoolAdmin";
import { withTranslation } from 'react-i18next';

const INITIAL_STATE = { isRefreshing: true, classList:[], filteredClassList:[] };


class StudentClassListScreen extends React.PureComponent {
  static navigationOptions = () => {
    return {
      header: null
    };
  };

  handleRefresh = () => this.loadClasses()

  loadClasses = async () => {
    if(this._isMounted){
      this.setState({classList: [], isRefreshing: true})
    }
    const classList = await ClassAPI.getUserActiveClasses(this.props.currentSchool.id, this.studentId);
    if(this._isMounted){
      this.setState({ classList, filteredClassList: classList, isRefreshing: false });
    }
  }

  handleClassPress = class_ => {
    const classId = class_.id;
    this.props.navigation.navigate("ClassProfile", { classId });
  }

  handleAddClassPress = () => {
    const payload = {
      studentId: this.studentId,
      onRefresh: this.loadClasses
    }
    this.props.navigation.navigate("StudentClassListPicker",  payload);
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
    this.studentId = this.props.navigation.getParam("studentId", "");
    this.loadClasses = this.loadClasses.bind(this);
    this.handleClassPress = this.handleClassPress.bind(this);
    this.handleAddClassPress = this.handleAddClassPress.bind(this);
    this.handleSearchPress = this.handleSearchPress.bind(this);
    this.handleRefresh = this.handleRefresh.bind(this);
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
      <View style={{ flex: 1, backgroundColor: "#fff" }}>
        <AppHeader
            navigation={this.props.navigation}
            title={this.props.t("studentClassList")}
            style={{ backgroundColor: "white" }}
          />
        <View style={{ padding: 16 }}>
        <MySearchbar 
            onSubmitEditing={this.handleSearchPress}
            placeholder={this.props.t("searchClass")} />
        </View>
        <View style={{backgroundColor: "#0ead69", padding: 16}}>
          <TouchableOpacity onPress={this.handleAddClassPress} style={{ display:"flex", flexDirection:"row",alignItems:"center"}}>
          <Icon name="plus" size={16} color="#fff" style={{marginTop: 2, marginRight: 4}}/> 
            <Text style={{fontWeight:"bold", color:"#fff"}}>
               {this.props.t("addClass")}
            </Text>
          </TouchableOpacity>
        </View>
        {(!this.state.isRefreshing && this.state.filteredClassList.length===0)?<Text style={{marginTop:16, textAlign:"center"}}>{this.props.t("listEmpty")}</Text>:null}
        <FlatList
          data={this.state.filteredClassList} refreshing={this.state.isRefreshing} 
          onRefresh={this.handleRefresh} keyExtractor={(item) => item.id}
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

export default withTranslation()(withCurrentSchoolAdmin(StudentClassListScreen))
