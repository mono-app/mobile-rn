import React from "react";
import { View, FlatList, StyleSheet } from "react-native";
import { Searchbar } from "react-native-paper";
import ClassAPI from "../../../api/class";
import ClassListItem from "../../../components/ClassListItem";
import AppHeader from "src/components/AppHeader";
import TeacherAPI from "modules/Classroom/api/teacher";

const INITIAL_STATE = { isLoading: true };

export default class TaskListScreen extends React.PureComponent {
  static navigationOptions = ({ navigation }) => {
    return {
      header: (
        <AppHeader
          navigation={navigation}
          title="Arsip Tugas"
          style={{ backgroundColor: "transparent" }}
        />
      )
    };
  };

  loadClasses = async () => {
    this.classListListener = new ClassAPI().getUserClassesWithRealTimeUpdate(this.teacherEmail, classes => {
      const people = classes.map(class_ => {
        return { id: class_.id, ...class_.data() }
      });
      this.setState({ peopleList: people });
    })
  }

  handleClassPress = class_ => {
    const classId = class_.id;
  }

  constructor(props) {
    super(props);
    this.state = INITIAL_STATE;
    this.loadClasses = this.loadClasses.bind(this);
    this.handleClassPress = this.handleClassPress.bind(this);
    this.teacherEmail = this.props.navigation.getParam("teacherEmail", "");
  }

  componentDidMount(){
    this.loadClasses();
  }

  render() {
    return (
      <View style={{ flex: 1, backgroundColor: "#E8EEE8" }}>
        <View style={{ padding: 16 }}>
          <Searchbar placeholder="Cari" />
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
