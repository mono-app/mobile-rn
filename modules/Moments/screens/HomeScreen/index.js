import React from "react";
import { View, StyleSheet, TouchableOpacity, FlatList } from "react-native";
import { Text, Surface, IconButton } from "react-native-paper";

import CurrentUserAPI from "src/api/people/CurrentUser";
import MomentsAPI from "modules/Moments/api/moment";

import MomentItem from "./MomentItem";
import AppHeader from "src/components/AppHeader";
import CircleAvatar from "src/components/Avatar/Circle";

const INITIAL_STATE = { moments: [], isLoading: false, profilePicture: "https://picsum.photos/200/200/?random" }

export default class HomeScreen extends React.Component{
  static navigationOptions = { header: <AppHeader title="Moments" style={{ backgroundColor: "white" }}/> }

  handleAddMomentPress = () => this.props.navigation.navigate("AddMoment");
  handlePullToRefresh = () => this.refreshMoments();

  refreshProfileDetail = async () => {
    const { applicationInformation } = await CurrentUserAPI.getDetail();
    this.setState({ profilePicture: applicationInformation.profilePicture });
  }

  refreshMoments = async () => {
    this.setState({ moments: [], isLoading: true });
    const currentUserEmail = await CurrentUserAPI.getCurrentUserEmail();
    const moments = await MomentsAPI.getMoments(currentUserEmail);
    this.setState({ moments, isLoading: false });
  }

  constructor(props){
    super(props);

    this.state = INITIAL_STATE;
    this.refreshMoments = this.refreshMoments.bind(this);
    this.handleAddMomentPress = this.handleAddMomentPress.bind(this);    
    this.handlePullToRefresh = this.handlePullToRefresh.bind(this);
  }

  componentDidMount(){ 
    this.refreshMoments(); 
    this.refreshProfileDetail();
  }

  render(){
    
    return(
      <View style={styles.container}>
        <Surface style={{ padding: 16, elevation: 4, flexDirection: "row", justifyContent: "space-between" }}>
          <CircleAvatar size={50} uri={this.state.profilePicture}/>
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