import React from "react";
import { View, FlatList, StyleSheet } from "react-native";
import { Searchbar } from "react-native-paper";
import AnnouncementListItem from "modules/Classroom/components/AnnouncementListItem";
import AppHeader from "src/components/AppHeader";
import AnnouncementAPI from "modules/Classroom/api/announcement";

const INITIAL_STATE = { isLoading: true, searchText: "", searchText: "", announcementList:[], filteredAnnouncementList:[]  };

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
   
    const announcementList = await AnnouncementAPI.getStudentAnnouncements(this.schoolId,this.studentEmail)
    this.setState({ announcementList, filteredAnnouncementList: announcementList });
 
  }

  handleAnnouncementPress = people => {
    
  }

  handleSearchPress = () => {
    this.setState({filteredAnnouncementList: []})

    const clonedAnnouncementList = JSON.parse(JSON.stringify(this.state.announcementList))
    const newSearchText = JSON.parse(JSON.stringify(this.state.searchText)) 
    if(this.state.searchText){

      const filteredAnnouncementList = clonedAnnouncementList.filter((announcement) => {
        return announcement.task.title.toLowerCase().indexOf(newSearchText.toLowerCase()) >= 0
      })
      this.setState({filteredAnnouncementList})
    } else {
      this.setState({filteredAnnouncementList: clonedAnnouncementList})
    }
  }

  constructor(props) {
    super(props);
    this.state = INITIAL_STATE;
    this.schoolId = this.props.navigation.getParam("schoolId", "");
    this.studentEmail = this.props.navigation.getParam("studentEmail", "");
    this.loadAnnouncements = this.loadAnnouncements.bind(this);
    this.handleAnnouncementPress = this.handleAnnouncementPress.bind(this);
    this.handleSearchPress = this.handleSearchPress.bind(this);
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
            onSubmitEditing={this.handleSearchPress}
            value={this.state.searchText}
            placeholder="Cari Pengumuman" />
        </View>
        <FlatList
          style={{ backgroundColor: "white" }}
          data={this.state.filteredAnnouncementList}
          keyExtractor={(item) => item.id}
          renderItem={({ item, index }) => {
            return (
            <AnnouncementListItem 
                onPress={() => this.handleAnnouncementPress(item)} 
                announcement={item} 
                prevDueDate={(this.state.announcementList[index-1])? this.state.announcementList[index-1].task.dueDate:{} }
                isFirstRow={(index==0)}
                />
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
