import React from "react";
import { View, FlatList, StyleSheet } from "react-native";
import { Searchbar } from "react-native-paper";
import ClassAPI from "../../../api/class";
import ClassListItem from "../../../components/ClassListItem";
import AppHeader from "src/components/AppHeader";
import TeacherAPI from "modules/Classroom/api/teacher";

const INITIAL_STATE = { isLoading: true };

export default class ClassListScreen extends React.PureComponent {
  static navigationOptions = ({ navigation }) => {
    return {
      header: (
        <AppHeader
          navigation={navigation}
          title="Data Master Kelas"
          style={{ backgroundColor: "transparent" }}
        />
      )
    };
  };

  loadClasses = async () => {
    this.classListListener = new ClassAPI().getClassesWithRealTimeUpdate("1hZ2DiIYSFa5K26oTe75", classes => {
      const people = classes.map(class_ => {
        return { id: class_.id, ...class_.data() }
      });
      this.setState({ peopleList: people });
    })
  }

  handleClassPress = class_ => {
    const classId = class_.id;
    if(!this.isPicker){
      this.props.navigation.navigate("ClassProfile", { classId });
    } else {
      
      TeacherAPI.addTeacherClass(this.teacherEmail,"1hZ2DiIYSFa5K26oTe75",classId).then(() => {
        this.setState({ isLoading: false });
        const { navigation } = this.props;
        navigation.state.params.onRefresh();
        navigation.goBack();
      }).catch(err => console.log(err));
    }
  }

  constructor(props) {
    super(props);
    this.state = INITIAL_STATE;
    this.loadClasses = this.loadClasses.bind(this);
    this.handleClassPress = this.handleClassPress.bind(this);
    this.isPicker = this.props.navigation.getParam("isPicker", false);
    this.teacherEmail = this.props.navigation.getParam("teacherEmail", "");
  }


  componentDidMount(){
    this.loadClasses();
  }

  render() {
    return (
      <View style={{ flex: 1, backgroundColor: "#E8EEE8" }}>
        <View style={{ padding: 16 }}>
          <Searchbar placeholder="Cari Kelas" />
        </View>
        <FlatList
          style={{ backgroundColor: "white" }}
          data={this.state.peopleList}
          renderItem={({ item, index }) => {
            return (
              <ClassListItem 
                onPress={() => this.handleClassPress(item)}
                key={index} autoFetch={true} classId={item.id}/>
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