import React from "react";
import { View, FlatList, StyleSheet } from "react-native";
import { Searchbar,Text } from "react-native-paper";
import TimelineListItem from "src/components/TimelineListItem";
import AppHeader from "src/components/AppHeader";
import DiscussionAPI from "modules/Classroom/api/discussion";
import {  TouchableOpacity } from "react-native-gesture-handler";

const INITIAL_STATE = { isLoading: true };

export default class DiscussionsScreen extends React.PureComponent {
  static navigationOptions = ({ navigation }) => {
    return {
      header: (
        <AppHeader
          navigation={navigation}
          title="Diskusi Umum"
          style={{ backgroundColor: "transparent" }}
        />
      )
    };
  };

  loadDiscussions = async () => {
    const discussionList = await DiscussionAPI.getDiscussions(this.schoolId, this.classId, this.taskId);
    this.setState({ discussionList });
  }

  handleTimelinePress = people => {
    const studentEmail = people.id;
    //this.props.navigation.navigate("StudentProfile", { studentEmail });
  }

  constructor(props) {
    super(props);
    this.state = INITIAL_STATE;
    this.loadDiscussions = this.loadDiscussions.bind(this);
    this.handleTimelinePress = this.handleTimelinePress.bind(this);
    this.schoolId = this.props.navigation.getParam("schoolId", "");
    this.classId = this.props.navigation.getParam("classId", "");
    this.taskId = this.props.navigation.getParam("taskId", "");
  
  }

  componentDidMount(){
    this.loadDiscussions();
  }

  render() {
    return (  
      <View style={{ flex: 1, backgroundColor: "#E8EEE8", paddingBottom:16 }}>
        <FlatList
          data={this.state.discussionList}
          renderItem={({ item, index }) => {
            return (
              <TimelineListItem 
                onPress={() => this.handleTimelinePress(item)}
                key={index} autoFetch={true} schoolId={this.schoolId} classId={this.classId} taskId={this.taskId} discussionId={item.id} />
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
