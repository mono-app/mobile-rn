import React from "react";
import { View,StyleSheet } from "react-native";
import { ScrollView, TouchableOpacity } from "react-native-gesture-handler";
import {
  Text,
} from "react-native-paper";
import TextInput from "src/components/TextInput";
import AppHeader from "src/components/AppHeader";
import ClassAPI from "modules/Classroom/api/class";
import PeopleProfileHeader from "src/components/PeopleProfile/Header";
import PeopleInformationContainer from "src/components/PeopleProfile/InformationContainer";
import { default as EvilIcons } from "react-native-vector-icons/EvilIcons";

const INITIAL_STATE = { schoolId: "1hZ2DiIYSFa5K26oTe75", taskTitle: "", dueDate: "", taskDetail:"" };

/**
 * Parameter list
 *
 * @param {string} classId
 */
export default class AddTaskScreen extends React.PureComponent {
  static navigationOptions = ({ navigation }) => {
    return {
      header: (
        <AppHeader
          navigation={navigation}
          title="Tambah Tugas"
          style={{ backgroundColor: "transparent" }}
        />
      )
    };
  };

  handleTaskDetailChange = (taskDetail) =>{
    this.setState({taskDetail})
  }

  handleTaskTitleChange = (taskTitle) =>{
    this.setState({taskTitle})
  }

  constructor(props) {
    super(props);
    this.classId = this.props.navigation.getParam("classId", null);
    this.state = INITIAL_STATE;
    this.handleTaskTitleChange = this.handleTaskTitleChange.bind(this);
    this.handleTaskDetailChange = this.handleTaskDetailChange.bind(this);
  }

  render() {
    return (
      <View style={{ backgroundColor: "#E8EEE8" }}>
        <ScrollView>
          <View style={{ }}>  
            <TouchableOpacity>
              <View style={{marginTop: 16,
                            backgroundColor: "#fff",
                            flexDirection: "row",
                            padding: 16,
                            alignItems: "center"}}>
                <View style={styles.listDescriptionContainer}>
                  <Text style={styles.label}>Pilih Kelas Saya</Text>
                  <View style={{flexDirection:"row",textAlign: "right"}}>
                    <EvilIcons name="chevron-right" size={24} style={{ color: "#5E8864" }}/>
                  </View>
                </View>
              </View>
            </TouchableOpacity>
          </View>
          
          <View style={{  marginTop:16, padding: 16, backgroundColor: "#fff" }}>
            <View style={{ marginTop: 16 }}>
              <Text style={styles.label}>Judul Tugas</Text>
              <TextInput
                style={{ marginTop: 16, backgroundColor:"#E8EEE8" }}
                value={this.state.taskTitle}
                onChangeText={this.handleTaskTitleChange}
              />
            </View>
            <View style={{ marginTop: 16 }}>
                <Text style={styles.label}>Batas Pengumpulan</Text>
                <TouchableOpacity>
                  <View style={styles.listItemContainer}>
                    <View style={styles.listDescriptionContainer}>
                      <Text style={styles.label}>{this.state.dueDate}</Text>
                      <View style={{flexDirection:"row",textAlign: "right"}}>
                        <EvilIcons name="calendar" size={24} style={{ color: "#5E8864" }}/>
                      </View>
                    </View>
                  </View>
                </TouchableOpacity>
            </View>
            <View style={{ marginTop: 16 }}>
              <Text style={styles.label}>Detail Tugas</Text>
              <TextInput
                style={{ marginTop: 16, backgroundColor: "#E8EEE8" }}
                value={this.state.taskDetail}
                multiline={true}
                onChangeText={this.handleTaskDetailChange}
              />
            </View>
            
          </View>
        </ScrollView>
      </View>
    )
  }
}
const styles = StyleSheet.create({
  profileContainer: {
    backgroundColor: "white",
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 8,
    paddingBottom: 32,
    borderBottomWidth: 1,
    borderBottomColor: "#E8EEE8"
  },
  listItemContainer: {
    marginTop: 16,
    backgroundColor: "#E8EEE8",
    flexDirection: "row",
    borderRadius:8,
    padding: 16,
    paddingVertical: 12,
    alignItems: "center"
  },
  listDescriptionContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between"
  },
  label: {
    fontWeight: "bold"
  }
})