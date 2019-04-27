import React from 'react';
import { StyleSheet, View, FlatList } from 'react-native';
import { NavigationEvents } from "react-navigation";

import { default as FriendRequestNotification } from "./Notifications/FriendRequest";
import RightMenuButton from "./RightMenuButton";
import Room from "./Room";
import PeopleAPI from '../../api/people';

INITIAL_STATE = { rooms: [] }

export default class HomeScreen extends React.Component {
  static navigationOptions = ({ navigation }) => {
    return{
      title: 'All Chats',
      headerRight: <RightMenuButton navigation={navigation}/>
    }
  };

  handleOpenPrivateRoom = room => {
    const peopleName = room.audience.applicationInformation.nickName;
    const roomId = room.id;
    this.props.navigation.navigate({ routeName: "Chat", params: { peopleName, roomId }});
  }

  handleScreenDidFocus = () => {
    const api = new PeopleAPI();
    api.getRoomsWithRealtimeUpdate(rooms => {
      this.setState({ rooms });
    })
  }

  constructor(props){
    super(props);

    this.state = INITIAL_STATE;
    this.handleScreenDidFocus = this.handleScreenDidFocus.bind(this);
    this.handleOpenPrivateRoom = this.handleOpenPrivateRoom.bind(this);
  }
  
  render() {
    return (
      <View style={styles.container}>
        <NavigationEvents onDidFocus={this.handleScreenDidFocus}/>

        <FriendRequestNotification {...this.props}/>
        <FlatList
          data={this.state.rooms}
          renderItem={({item}) => {
            if(item.type === "private"){
              return <Room {...item} onPress={() => this.handleOpenPrivateRoom(item)}/>
            }
          }}/>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E8EEE8',
    alignItems: 'stretch',
    justifyContent: 'flex-start',
  }
});
