import React from "react";
import { View, FlatList, StyleSheet, TouchableOpacity } from "react-native";
import { Searchbar, Text } from "react-native-paper";
import ClassAPI from "../../../api/class";
import ClassListItem from "../../../components/ClassListItem";
import AppHeader from "src/components/AppHeader";

const INITIAL_STATE = { isLoading: true };

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
    this.classListListener = new ClassAPI().getTeacherClassesWithRealTimeUpdate(this.teacherEmail , classes => {
      const people = classes.map(class_ => {
        return { id: class_.id, ...class_.data() }
      });
      this.setState({ peopleList: people });
    })
  }

  handleClassPress = class_ => {
    const classId = class_.id;
    this.props.navigation.navigate("ClassProfile", { classId });
  }
  handleAddClassPress = () => {
    const payload = {
      isPicker: true,
      teacherEmail: this.teacherEmail,
      onRefresh: this.loadClasses
    }
    this.props.navigation.navigate("ClassList",  payload);
  }

  constructor(props) {
    super(props);
    this.teacherEmail = this.props.navigation.getParam("teacherEmail", "");

    this.state = INITIAL_STATE;
    this.loadClasses = this.loadClasses.bind(this);
    this.handleClassPress = this.handleClassPress.bind(this);
    this.handleAddClassPress = this.handleAddClassPress.bind(this);
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
        <View style={{ padding: 16, backgroundColor: "#fff"}}>
          <TouchableOpacity onPress={this.handleAddClassPress}>
            <Text style={{color: "blue"}}>+ Tambahkan kelas</Text>
          </TouchableOpacity>
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
