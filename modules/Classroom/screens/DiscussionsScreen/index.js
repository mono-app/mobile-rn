import React from "react";
import { View, FlatList, StyleSheet } from "react-native";
import { Searchbar,Text } from "react-native-paper";
import DiscussionListItem from "src/components/DiscussionListItem";
import AppHeader from "src/components/AppHeader";
import DiscussionAPI from "modules/Classroom/api/discussion";
import {  TouchableOpacity } from "react-native-gesture-handler";
import CurrentUserAPI from "src/api/people/CurrentUser";

const INITIAL_STATE = { isLoading: true };

export default class DiscussionsScreen extends React.PureComponent {
  static navigationOptions = ({ navigation }) => {
    return {
      header: (
        <AppHeader
          navigation={navigation}
          title={navigation.getParam("subject", "")}
          subtitle={navigation.getParam("subjectDesc", "")}
          style={{ backgroundColor: "transparent" }}
        />
      )
    };
  };

  loadDiscussions = async () => {
    this.setState({ discussionList: [] });
    const discussionList = await DiscussionAPI.getDiscussions(this.schoolId, this.classId, this.taskId);
    this.setState({ discussionList });
  }

  handleDiscussionPress = item => {
    payload = {
      schoolId: this.schoolId,
      classId: this.classId,
      taskId: this.taskId,
      discussion: item,
    }

    this.props.navigation.navigate("DiscussionComment", payload);
  }

  handleLikePress = async (item) => {
    console.log("like pressed")
    const currentUserEmail= await CurrentUserAPI.getCurrentUserEmail();
    await DiscussionAPI.like(this.schoolId, this.classId, this.taskId, item.id, currentUserEmail);
    this.loadDiscussions();
  }

  handleSharePress = item => {

  }

  handleAddDiscussion = () => {
    payload = {
      schoolId: this.schoolId,
      classId: this.classId,
      taskId: this.taskId,
      subject: this.subject,
      subjectDesc: this.subjectDesc,
      onRefresh: this.loadDiscussions
    }
    this.props.navigation.navigate("AddDiscussion", payload);
  }

  constructor(props) {
    super(props);
    this.state = INITIAL_STATE;
    this.loadDiscussions = this.loadDiscussions.bind(this);
    this.handleDiscussionPress = this.handleDiscussionPress.bind(this);
    this.handleLikePress = this.handleLikePress.bind(this);
    this.handleSharePress = this.handleSharePress.bind(this);
    this.handleAddDiscussion = this.handleAddDiscussion.bind(this);
    this.schoolId = this.props.navigation.getParam("schoolId", "");
    this.classId = this.props.navigation.getParam("classId", "");
    this.taskId = this.props.navigation.getParam("taskId", "");
    this.subject = this.props.navigation.getParam("subject", "");
    this.subjectDesc = this.props.navigation.getParam("subjectDesc", "");
  
  }

  componentDidMount(){
    this.loadDiscussions();
  }

  render() {
    return (  
      <View style={{ flex: 1, backgroundColor: "#E8EEE8", paddingBottom:16 }}>
        <View style={{margin: 16 }}>
            <Searchbar placeholder="Cari Diskusi" />
        </View>
        <View style={{backgroundColor: "#DCDCDC",
                      padding: 16}}>
          <TouchableOpacity onPress={this.handleAddDiscussion}>
            <Text style={{fontWeight:"bold"}}>
              + Buat Diskusi Baru
            </Text>
          </TouchableOpacity>
        </View>
        <FlatList
          data={this.state.discussionList}
          renderItem={({ item, index }) => {
            return (
              <DiscussionListItem 
                onPress={() => this.handleDiscussionPress(item)}
                key={index} schoolId={this.schoolId} discussion={item} />
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