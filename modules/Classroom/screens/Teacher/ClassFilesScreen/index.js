import React from "react";
import { View, FlatList, StyleSheet } from "react-native";
import { Searchbar,Text } from "react-native-paper";
import FileListItem from "../../../components/FileListItem";
import AppHeader from "src/components/AppHeader";
import FileAPI from "../../../api/file";
import {  TouchableOpacity } from "react-native-gesture-handler";

const INITIAL_STATE = { isLoading: true };

export default class ClassFilesScreen extends React.PureComponent {
  static navigationOptions = ({ navigation }) => {
    return {
      header: (
        <AppHeader
          navigation={navigation}
          title="Berkas"
          style={{ backgroundColor: "transparent" }}
        />
      )
    };
  };

  loadFiles = async () => {
    const fileList = await FileAPI.getFiles(this.schoolId, this.classId);
    this.setState({ fileList });
    console.log(fileList)
  }

  handleStudentPress = people => {
    const studentEmail = people.id;
    //this.props.navigation.navigate("StudentProfile", { studentEmail });
  }

  constructor(props) {
    super(props);
    this.state = INITIAL_STATE;
    this.loadFiles = this.loadFiles.bind(this);
    this.handleStudentPress = this.handleStudentPress.bind(this);
    this.schoolId = this.props.navigation.getParam("schoolId", "");
    this.classId = this.props.navigation.getParam("classId", "");
    this.subject = this.props.navigation.getParam("subject", "");
    this.subjectDesc = this.props.navigation.getParam("subjectDesc", "");
  
  }

  componentDidMount(){
    this.loadFiles();
  }

  render() {
    return (
      <View style={{ flex: 1, backgroundColor: "#E8EEE8", paddingBottom:16 }}>
        <View style={styles.subjectContainer}>
              <Text style={{fontWeight: "bold", fontSize: 18}}>
                {this.subject}
              </Text>
              <Text style={{fontSize: 18}}>
                {this.subjectDesc}
              </Text>
        </View>
        <View style={{marginTop: 8 }}>
          <Searchbar placeholder="Cari Berkas" />
        </View>
        <View style={{marginTop: 8,
                      backgroundColor: "#DCDCDC",
                      padding: 16}}>
          <TouchableOpacity>
            <Text style={{fontWeight:"bold"}}>
              + Tambah Berkas
            </Text>
          </TouchableOpacity>
        </View>
        <FlatList
          style={{ backgroundColor: "white", marginTop:8 }}
          data={this.state.fileList}
          renderItem={({ item, index }) => {
            return (
              <FileListItem 
                onPress={() => this.handleStudentPress(item)}
                key={index} autoFetch={true} schoolId={this.schoolId} classId={this.classId} fileId={item.id} />
            )
          }}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  subjectContainer:{
    marginTop: 8,
    backgroundColor: "#fff",
    flexDirection: "column",
    padding: 16
  },
  listItemContainer: {
    padding: 16,
    flexDirection: "row",
    justifyContent: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#E8EEE8"
  }
});
