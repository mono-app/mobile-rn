import React from "react";
import { View, FlatList } from "react-native";
import { Text } from "react-native-paper";
import MySearchbar from "src/components/MySearchbar"
import DiscussionListItem from "src/components/DiscussionListItem";
import AppHeader from "src/components/AppHeader";
import DiscussionAPI from "modules/Classroom/api/discussion";
import {  TouchableOpacity } from "react-native-gesture-handler";
import Icon from 'react-native-vector-icons/FontAwesome';
import { withCurrentUser } from "src/api/people/CurrentUser"
import { withTranslation } from 'react-i18next';

const INITIAL_STATE = { isRefreshing: true, discussionList:[], filteredDiscussionList: [] };

class DiscussionsScreen extends React.PureComponent {
  static navigationOptions = () => {
    return {
      header: null
    };
  };

  loadDiscussions = async () => {
    if(this._isMounted) this.setState({ discussionList: [], isRefreshing: true });
    const discussionList = await DiscussionAPI.getDiscussions(this.schoolId, this.classId, this.taskId);
    if(this._isMounted) this.setState({ discussionList, filteredDiscussionList: discussionList, isRefreshing: false });
  }
  handleRefresh = () => this.loadDiscussions()

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
    const currentUserId= this.props.currentUser.id
    await DiscussionAPI.like(this.schoolId, this.classId, this.taskId, item.id, currentUserId);
    this.loadDiscussions();
  }

  
  handleSearchPress = (searchText) => {
    if(this._isMounted)
      this.setState({filteredDiscussionList: []})

    const clonedDiscussionList = JSON.parse(JSON.stringify(this.state.discussionList))
    const newSearchText = JSON.parse(JSON.stringify(searchText)) 
    if(searchText){

      const filteredDiscussionList = clonedDiscussionList.filter((discussion) => {
        if(discussion.title.toLowerCase().indexOf(newSearchText.toLowerCase()) >= 0 || 
          discussion.description.toLowerCase().indexOf(newSearchText.toLowerCase()) >= 0){
            return true
        }else{
          return false
        }
      })
      if(this._isMounted)
        this.setState({filteredDiscussionList})
    } else {
      if(this._isMounted)
        this.setState({filteredDiscussionList: clonedDiscussionList})
    }
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
    this._isMounted = null;
    this.loadDiscussions = this.loadDiscussions.bind(this);
    this.handleDiscussionPress = this.handleDiscussionPress.bind(this);
    this.handleLikePress = this.handleLikePress.bind(this);
    this.handleSearchPress = this.handleSearchPress.bind(this);
    this.handleRefresh = this.handleRefresh.bind(this);
    this.handleAddDiscussion = this.handleAddDiscussion.bind(this);
    this.schoolId = this.props.navigation.getParam("schoolId", "");
    this.classId = this.props.navigation.getParam("classId", "");
    this.taskId = this.props.navigation.getParam("taskId", "");
    this.subject = this.props.navigation.getParam("subject", "");
    this.subjectDesc = this.props.navigation.getParam("subjectDesc", "");
  
  }

  componentDidMount(){
    this._isMounted = true;
    this.loadDiscussions();
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  render() {
    return (  
      <View style={{ flex: 1, backgroundColor: "#fff"}}>
        <AppHeader
            navigation={this.props.navigation}
            title={this.props.navigation.getParam("subject", "")}
            subtitle={this.props.navigation.getParam("subjectDesc", "")}
            style={{ backgroundColor: "white" }}
          />
        <View style={{margin: 16 }}>
            <MySearchbar 
              onSubmitEditing={this.handleSearchPress}
              placeholder={this.props.t("searchDiscussion")} />
        </View>
        
        <View style={{backgroundColor: "#0ead69", padding: 16}}>
          <TouchableOpacity onPress={this.handleAddDiscussion} style={{ display:"flex", flexDirection:"row",alignItems:"center"}}>
          <Icon name="plus" size={16} color="#fff" style={{marginTop: 2, marginRight: 4}}/> 
            <Text style={{fontWeight:"bold", color:"#fff"}}>
               {this.props.t("createNewDiscussion")}
            </Text>
          </TouchableOpacity>
        </View>
        {(this.state.filteredDiscussionList.length===0)?<Text style={{marginTop:16, textAlign:"center"}}>{this.props.t("noDiscussions")}</Text>:null}
        <FlatList
          style={{marginVertical: 4}} data={this.state.filteredDiscussionList}
          refreshing={this.state.isRefreshing} onRefresh={this.handleRefresh} 
          keyExtractor={(item) => item.id} 
          renderItem={({ item }) => {
            return (
              <DiscussionListItem 
                onPress={() => this.handleDiscussionPress(item)}
                schoolId={this.schoolId} discussion={item} />
            )
          }}
        />
      </View>
    );
  }
}

export default withTranslation()(withCurrentUser(DiscussionsScreen))
