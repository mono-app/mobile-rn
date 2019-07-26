import React from "react";
import { View, FlatList, StyleSheet } from "react-native";
import { Searchbar } from "react-native-paper";
import TeacherAPI from "../../../api/teacher";
import TeacherListItem from "../../../components/TeacherListItem";
import AppHeader from "src/components/AppHeader";

const INITIAL_STATE = { isLoading: true, peopleList: [] };

export default class TeacherListScreen extends React.PureComponent {
  static navigationOptions = ({ navigation }) => {
    return {
      header: (
        <AppHeader
          navigation={navigation}
          title="Data Master Guru"
          style={{ backgroundColor: "transparent" }}
        />
      )
    };
  };

  loadTeachers = async () => {
    this.teacherListListener = new TeacherAPI().getTeachersWithRealTimeUpdate("1hZ2DiIYSFa5K26oTe75", teachers => {
      const people = teachers.map(teacher => {
        return { id: teacher.id, ...teacher.data() }
      });
      this.setState({ peopleList: people });
    })
  }

  handleTeacherPress = people => {
    const teacherEmail = people.id;
    this.props.navigation.navigate("TeacherProfile", { teacherEmail });
  }

  constructor(props) {
    super(props);
    this.state = INITIAL_STATE;
    this.loadTeachers = this.loadTeachers.bind(this);
    this.handleTeacherPress = this.handleTeacherPress.bind(this);
  }

  componentDidMount(){
    this.loadTeachers();
  }

  render() {
    return (
      <View style={{ flex: 1, backgroundColor: "#E8EEE8" }}>
        <View style={{ padding: 16 }}>
          <Searchbar placeholder="Cari Guru" />
        </View>
        <FlatList
          style={{ backgroundColor: "white" }}
          data={this.state.peopleList}
          renderItem={({ item, index }) => {
            return (
              <TeacherListItem 
                onPress={() => this.handleTeacherPress(item)}
                key={index} autoFetch={true} email={item.id}/>
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
