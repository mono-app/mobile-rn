import React from "react";
import { View, FlatList, StyleSheet } from "react-native";
import { Searchbar } from "react-native-paper";
import ClassAPI from "modules/Classroom/api/class";
import ClassListItem from "modules/Classroom/components/ClassListItem";
import AppHeader from "src/components/AppHeader";

const INITIAL_STATE = { classList: [], isLoading: true };

export default class ArchiveSelectClassScreen extends React.PureComponent {
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
    const classList = await ClassAPI.getUserClasses(this.schoolId, this.teacherEmail);
    this.setState({ classList });
  }

  handleClassPress = async theClass => {
    const class_ = await ClassAPI.getDetail(this.schoolId, theClass.id);
    const payload = {
      schoolId: this.schoolId,
      classId: class_.id,
      subject: class_.subject,
      subjectDesc: class_.room+" | "+class_.academicYear+" | Semester "+class_.semester
    }
    this.props.navigation.navigate("ArchiveList", payload);
  }

  constructor(props) {
    super(props);
    this.state = INITIAL_STATE;
    this.loadClasses = this.loadClasses.bind(this);
    this.handleClassPress = this.handleClassPress.bind(this);
    this.schoolId = this.props.navigation.getParam("schoolId", "");
    this.teacherEmail = this.props.navigation.getParam("teacherEmail", "");
  }

  componentDidMount(){
    this.loadClasses();
  }

  render() {
    return (
      <View style={{ flex: 1, backgroundColor: "#E8EEE8" }}>
        <View style={{ margin: 16 }}>
          <Searchbar placeholder="Cari Kelas" />
        </View>
        <FlatList
          style={{ backgroundColor: "white" }}
          data={this.state.classList}
          renderItem={({ item, index }) => {
            return (
              <ClassListItem 
                onPress={() => this.handleClassPress(item)}
                key={index} schoolId={this.schoolId} class_={item}/>
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
