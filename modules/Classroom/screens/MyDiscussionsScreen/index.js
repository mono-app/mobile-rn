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

class MyDiscussionsScreen extends React.PureComponent {
  static navigationOptions = () => {
    return {
      header: null
    };
  };

  loadDiscussions = async () => {
    if(this._isMounted) this.setState({ discussionList: [], isRefreshing: true });
    const discussionList = await DiscussionAPI.getMyDiscussions(this.props.currentUser.email, this.schoolId);
    if(this._isMounted) this.setState({ discussionList, filteredDiscussionList: discussionList, isRefreshing: false });
  }

  handleRefresh = () => this.loadDiscussions()

  handleDiscussionPress = item => {
    payload = {
      schoolId: this.schoolId,
      classId: item.classId,
      taskId: item.taskId,
      discussion: item,
    }

    this.props.navigation.navigate("DiscussionComment", payload);
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


  constructor(props) {
    super(props);
    this.state = INITIAL_STATE;
    this._isMounted = null;
    this.schoolId = this.props.navigation.getParam("schoolId", "");
    this.loadDiscussions = this.loadDiscussions.bind(this);
    this.handleDiscussionPress = this.handleDiscussionPress.bind(this);
    this.handleSearchPress = this.handleSearchPress.bind(this);
    this.handleRefresh = this.handleRefresh.bind(this);
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
            title={this.props.t("myDiscussion")}
            style={{ backgroundColor: "white" }}
          />
        <View style={{margin: 16 }}>
            <MySearchbar 
              onSubmitEditing={this.handleSearchPress}
              placeholder={this.props.t("searchDiscussion")} />
        </View>
        <FlatList
          data={this.state.filteredDiscussionList}
          refreshing={this.state.isRefreshing} 
          onRefresh={this.handleRefresh} 
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

export default withTranslation()(withCurrentUser(MyDiscussionsScreen))
