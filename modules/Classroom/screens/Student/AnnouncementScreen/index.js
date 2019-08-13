import React from "react";
import { View, FlatList, StyleSheet } from "react-native";
import { Searchbar } from "react-native-paper";
import StudentListItem from "../../../components/StudentListItem";
import AppHeader from "src/components/AppHeader";
import StudentAPI from "../../../api/student";

const INITIAL_STATE = { isLoading: true, searchText: "", announcementList: [] };

export default class AnnouncementScreen extends React.PureComponent {
  static navigationOptions = ({ navigation }) => {
    return {
      header: (
        <AppHeader
          navigation={navigation}
          title="Pengumuman"
          style={{ backgroundColor: "transparent" }}
        />
      )
    };
  };

  loadAnnouncements = async () => {
    this.setState({ announcementList: [] });

    // const announcementList = [];
    // this.setState({ announcementList });
  }

  handleAnnouncementPress = people => {
    
  }

  constructor(props) {
    super(props);
    this.state = INITIAL_STATE;
    this.loadAnnouncements = this.loadAnnouncements.bind(this);
    this.handleAnnouncementPress = this.handleAnnouncementPress.bind(this);
    this.schoolId = this.props.navigation.getParam("schoolId", "");
    this.classId = this.props.navigation.getParam("classId", "");
  }

  componentDidMount(){
    this.loadAnnouncements();
  }


  render() {
    return (
      <View style={{ flex: 1, backgroundColor: "#E8EEE8" }}>
        <View style={{ padding: 16 }}>
          <Searchbar 
          onChangeText={searchText => {this.setState({searchText})}}
          onSubmitEditing={this.loadAnnouncements}
          value={this.state.searchText}
          placeholder="Cari Pengumuman" />
        </View>
        <FlatList
          style={{ backgroundColor: "white" }}
          data={this.state.announcementList}
          renderItem={({ item, index }) => {
            
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
