import React from "react";
import { NavigationEvents } from "react-navigation";
import { View, StyleSheet, TouchableOpacity, FlatList } from "react-native";
import { Text, Surface, Avatar, IconButton } from "react-native-paper";

import MomentItem from "./MomentItem";
import PeopleAPI from "src/api/people";
import MomentsAPI from "modules/Moments/api/moment";

const INITIAL_STATE = { moments: [], isLoading: false, profilePicture: "https://picsum.photos/200/200/?random" }

export default class HomeScreen extends React.Component{
  static navigationOptions = { headerTitle: "Moments" }

  handleAddMomentPress = () => this.props.navigation.navigate("AddMoment");
  handlePullToRefresh = () => this.refreshMoments();

  refreshMoments = () => {
    this.setState({ moments: [], isLoading: true });
    const peopleAPI = new PeopleAPI();
    peopleAPI.getCurrentUserEmail().then(currentUserEmail =>{
      const promises = [ MomentsAPI.getMoments(currentUserEmail), peopleAPI.getDetail() ]
      return Promise.all(promises);
    }).then(results => {
      const moments = results[0];
      const userData = results[1];
      this.setState({ isLoading: false, moments, profilePicture: userData.applicationInformation.profilePicture })
    });
  }

  constructor(props){
    super(props);

    this.state = INITIAL_STATE;
    this.refreshMoments = this.refreshMoments.bind(this);
    this.handleAddMomentPress = this.handleAddMomentPress.bind(this);
    this.handlePullToRefresh = this.handlePullToRefresh.bind(this);
  }

  componentDidMount(){ this.refreshMoments(); }

  render(){
    return(
      <View style={styles.container}>
        <Surface style={{ padding: 16, elevation: 4, flexDirection: "row", justifyContent: "space-between" }}>
          <Avatar.Image size={50} source={{ uri: this.state.profilePicture, cache: "force-cache" }}/>
          <TouchableOpacity style={styles.addToMomentContainer} onPress={this.handleAddMomentPress}>
            <Text>Tambahkan moment</Text>
          </TouchableOpacity>
          <IconButton icon="add-a-photo"  size={24}/>
        </Surface>
        <FlatList
          data={this.state.moments}
          onRefresh={this.handlePullToRefresh}
          refreshing={this.state.isLoading}
          renderItem={({ item }) => {
            return <MomentItem {...item} navigation={this.props.navigation}/>
          }}/>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E8EEE8',
    alignItems: 'stretch',
    justifyContent: 'flex-start',
  },
  addToMomentContainer: {
    paddingLeft: 16, paddingRight: 16, alignItems: "center", justifyContent: "center", 
    backgroundColor: "#E8EEE8", borderRadius: 8, marginLeft: 16, marginRight: 16,
    flex: 1
  },
  leftAlignedContainerWithTopBorder: { 
    borderTopColor: "#E8EEE8", borderTopWidth: 1, flexDirection: "row", justifyContent: "flex-start", 
    alignItems: "center", padding: 16 
  }
})