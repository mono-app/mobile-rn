import React from 'react';
import { StyleSheet, View, FlatList } from 'react-native';

import CurrentUserAPI from "src/api/people/CurrentUser";
import PeopleAPI from 'src/api/people';

import PrivateRoom from "src/screens/HomeScreen/PrivateRoom";
import Header from "src/screens/HomeScreen/Header";
import { default as FriendRequestNotification } from "./Notifications/FriendRequest";

INITIAL_STATE = { rooms: [] }

export default class HomeScreen extends React.PureComponent {
  static navigationOptions = ({ navigation }) => {
    return { header: <Header navigation={navigation}/> }
  }

  handleOpenPrivateRoom = async room => {
    const { audiences } = room;
    const currentUserEmail = await CurrentUserAPI.getCurrentUserEmail();
    const filteredAudience = Object.keys(audiences).filter(audience => audience !== currentUserEmail)[0];
    const roomId = room.id;
    this.props.navigation.navigate({ routeName: "Chat", params: { peopleEmail: filteredAudience, roomId }});
  }

  constructor(props){
    super(props);

    this.state = INITIAL_STATE;
    this.roomListener = null;
    this.handleOpenPrivateRoom = this.handleOpenPrivateRoom.bind(this);
  }

  componentDidMount(){
    this.roomListener = PeopleAPI.getRoomsWithRealtimeUpdate(rooms => this.setState({ rooms }));
  }

  componentWillUnmount(){ if(this.roomListener) this.roomListener(); }
  
  render() {
    return (
      <View style={styles.container}>
        <FriendRequestNotification navigation={this.props.navigation}/>
        <FlatList
          data={this.state.rooms}
          renderItem={({item}) => {
            if(item.type === "private"){
              return <PrivateRoom {...item} onPress={() => this.handleOpenPrivateRoom(item)}/>
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
