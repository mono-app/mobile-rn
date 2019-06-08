import React from 'react';
import { StyleSheet, View, FlatList } from 'react-native';

import Room from "./Room";
import Header from "src/screens/HomeScreen/Header";
import { default as FriendRequestNotification } from "./Notifications/FriendRequest";

import PeopleAPI from 'src/api/people';

INITIAL_STATE = { rooms: [] }

export default class HomeScreen extends React.PureComponent {
  static navigationOptions = ({ navigation }) => {
    return { header: <Header navigation={navigation}/> }
  }

  handleOpenPrivateRoom = room => {
    const peopleName = room.audience.applicationInformation.nickName;
    const roomId = room.id;
    this.props.navigation.navigate({ routeName: "Chat", params: { peopleName, roomId }});
  }

  constructor(props){
    super(props);

    this.state = INITIAL_STATE;
    this.roomListener = null;
    this.handleOpenPrivateRoom = this.handleOpenPrivateRoom.bind(this);
  }

  componentDidMount(){
    this.roomListener = new PeopleAPI().getRoomsWithRealtimeUpdate(rooms => this.setState({ rooms }));
  }

  componentWillUnmount(){ if(this.roomListener) this.roomListener(); }
  
  render() {
    return (
      <View style={styles.container}>

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
