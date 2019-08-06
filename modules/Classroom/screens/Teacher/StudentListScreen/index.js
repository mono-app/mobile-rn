import React from "react";
import { View, FlatList, StyleSheet } from "react-native";
import { Searchbar } from "react-native-paper";
import StudentListItem from "../../../components/StudentListItem";
import AppHeader from "src/components/AppHeader";
import StudentAPI from "../../../api/student";

const INITIAL_STATE = { isLoading: true, schoolId: "1hZ2DiIYSFa5K26oTe75" };

export default class StudentListScreen extends React.PureComponent {
  static navigationOptions = ({ navigation }) => {
    return {
      header: (
        <AppHeader
          navigation={navigation}
          title="Daftar Murid"
          style={{ backgroundColor: "transparent" }}
        />
      )
    };
  };

  loadStudents = async () => {
    const peopleList = await StudentAPI.getClassStudent(this.state.schoolId, this.classId);
    this.setState({ peopleList });

  }

  handleStudentPress = people => {
    const studentEmail = people.id;
    this.props.navigation.navigate("StudentProfile", { studentEmail });
  }

  constructor(props) {
    super(props);
    this.state = INITIAL_STATE;
    this.loadStudents = this.loadStudents.bind(this);
    this.handleStudentPress = this.handleStudentPress.bind(this);
    this.classId = this.props.navigation.getParam("classId", "");
  }

  componentDidMount(){
    this.loadStudents();
  }


  render() {
    return (
      <View style={{ flex: 1, backgroundColor: "#E8EEE8" }}>
        <View style={{ padding: 16 }}>
          <Searchbar placeholder="Cari Murid" />
        </View>
        <FlatList
          style={{ backgroundColor: "white" }}
          data={this.state.peopleList}
          renderItem={({ item, index }) => {
            return (
              <StudentListItem 
                onPress={() => this.handleStudentPress(item)}
                key={index} student={item}/>
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
