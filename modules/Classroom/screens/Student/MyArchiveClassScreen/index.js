import React from "react";
import { View, FlatList } from "react-native";
import MySearchbar from "src/components/MySearchbar"
import ClassAPI from "modules/Classroom/api/class";
import ClassListItem from "modules/Classroom/components/ClassListItem";
import AppHeader from "src/components/AppHeader";
import { withCurrentStudent } from "modules/Classroom/api/student/CurrentStudent";
import { withTranslation } from 'react-i18next';
import { Text } from "react-native-paper"

const INITIAL_STATE = { isRefreshing: true, classList:[], filteredClassList:[] };

class MyArchiveClassScreen extends React.PureComponent {
  static navigationOptions = () => {
    return {
      header: null
    };
  };

  handleRefresh = () => this.loadClasses()

  loadClasses = async () => {
    if(this._isMounted)
      this.setState({classList: [], isRefreshing: true})
    const classList = await ClassAPI.getUserArchiveClasses(this.props.currentSchool.id, this.props.currentStudent.email);
    if(this._isMounted)
      this.setState({ classList, filteredClassList: classList, isRefreshing:false });
   }

  handleClassPress = class_ => {
     const payload = {
       schoolId: this.props.currentSchool.id,
       classId: class_.id
     }
     this.props.navigation.navigate("ClassDetails", payload);
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
    this._isMounted = true
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
            title={this.props.t("myClassHistory")}
            style={{ backgroundColor: "white" }}
          />
        <View style={{ padding: 16 }}>
          <MySearchbar 
              onSubmitEditing={this.handleSearchPress}
              placeholder={this.props.t("searchClass")} />
        </View>
        {(this.state.filteredClassList.length===0)?<Text style={{marginTop:16, textAlign:"center"}}>{this.props.t("listEmpty")}</Text>:null}
        <FlatList
          style={{ flex:1, backgroundColor: "white" }}
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
export default withTranslation()(withCurrentStudent(MyArchiveClassScreen))
