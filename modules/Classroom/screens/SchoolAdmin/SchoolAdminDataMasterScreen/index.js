import React from "react";
import { View, StyleSheet, TouchableOpacity } from "react-native";
import { Text } from "react-native-paper";
import { default as EvilIcons } from "react-native-vector-icons/EvilIcons";
import AppHeader from "src/components/AppHeader";
import { withCurrentSchoolAdmin } from "modules/Classroom/api/schooladmin/CurrentSchoolAdmin";

class SchoolAdminDataMasterScreen extends React.PureComponent {
  static navigationOptions = () => {
    return {
      header: null
    };
  };
  handleClassPress = e => {
    this.props.navigation.navigate("ClassList");
  };
  handleTeacherPress = e => {
    this.props.navigation.navigate("TeacherList");
  };
  handleStudentPress = e => {
    this.props.navigation.navigate("StudentList");
  };

  constructor(props) {
    super(props);
    this.handleClassPress = this.handleClassPress.bind(this);
    this.handleTeacherPress = this.handleTeacherPress.bind(this);
    this.handleStudentPress = this.handleStudentPress.bind(this);
  }

  render() {
    return (
      <View style={styles.groupContainer}>
        <AppHeader
            navigation={this.props.navigation}
            style={{ backgroundColor: "white" }}
            title="Data Master"
          />
        <TouchableOpacity onPress={this.handleClassPress}>
          <View style={styles.menu}>
            <Text style={{ fontWeight: "400" }}>Master Kelas</Text>
            <View
              style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center"
              }}
            >
              <EvilIcons
                name="chevron-right"
                size={24}
                style={{ color: "#5E8864" }}
              />
            </View>
          </View>
        </TouchableOpacity>
        <TouchableOpacity onPress={this.handleTeacherPress}>
          <View style={styles.menu}>
            <Text style={{ fontWeight: "400" }}>Master Guru</Text>
            <View
              style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center"
              }}
            >
              <EvilIcons
                name="chevron-right"
                size={24}
                style={{ color: "#5E8864" }}
              />
            </View>
          </View>
        </TouchableOpacity>
        <TouchableOpacity onPress={this.handleStudentPress}>
          <View style={styles.menu}>
            <Text style={{ fontWeight: "400" }}>Master Murid</Text>
            <View
              style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center"
              }}
            >
              <EvilIcons
                name="chevron-right"
                size={24}
                style={{ color: "#5E8864" }}
              />
            </View>
          </View>
        </TouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#E8EEE8", color: "black" },
  groupContainer: { marginBottom: 16 },
  menu: {
    padding: 16,
    backgroundColor: "white",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#E8EEE8"
  }
});
export default withCurrentSchoolAdmin(SchoolAdminDataMasterScreen)
