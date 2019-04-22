import React from 'react';
import { StyleSheet, View, FlatList } from 'react-native';

import { default as FriendRequestNotification } from "./Notifications/FriendRequest";
import RightMenuButton from "./RightMenuButton";
import Room from "./Room";

export default class HomeScreen extends React.Component {
  static navigationOptions = ({ navigation }) => {
    return{
      title: 'All Chats',
      headerRight: <RightMenuButton navigation={navigation}/>
    }
  };
  
  render() {
    return (
      <View style={styles.container}>
        <FriendRequestNotification {...this.props}/>
        <FlatList
          data={[
            {type: "room", name: "Frans Huang", lastMessage: "Lorem ipsum dolor sit amet, consectetur adipiscing elit."},
            {type: "room", name: "Frans Huang", lastMessage: "Lorem ipsum dolor sit amet, consectetur adipiscing elit."},
            {type: "room", name: "Frans Huang", lastMessage: "Lorem ipsum dolor sit amet, consectetur adipiscing elit."},
            {type: "room", name: "Frans Huang", lastMessage: "Lorem ipsum dolor sit amet, consectetur adipiscing elit."},
            {type: "room", name: "Frans Huang", lastMessage: "Lorem ipsum dolor sit amet, consectetur adipiscing elit."},
            {type: "room", name: "Frans Huang", lastMessage: "Lorem ipsum dolor sit amet, consectetur adipiscing elit."},
            {type: "room", name: "Frans Huang", lastMessage: "Lorem ipsum dolor sit amet, consectetur adipiscing elit."},
            {type: "room", name: "Frans Huang", lastMessage: "Lorem ipsum dolor sit amet, consectetur adipiscing elit."},
            {type: "room", name: "Frans Huang", lastMessage: "Lorem ipsum dolor sit amet, consectetur adipiscing elit."},
            {type: "room", name: "Frans Huang", lastMessage: "Lorem ipsum dolor sit amet, consectetur adipiscing elit."},
            {type: "room", name: "Frans Huang", lastMessage: "Lorem ipsum dolor sit amet, consectetur adipiscing elit."},
            {type: "room", name: "Frans Huang", lastMessage: "Lorem ipsum dolor sit amet, consectetur adipiscing elit."},
            {type: "room", name: "Frans Huang", lastMessage: "Lorem ipsum dolor sit amet, consectetur adipiscing elit."},
            {type: "room", name: "Frans Huang", lastMessage: "Lorem ipsum dolor sit amet, consectetur adipiscing elit."},
            {type: "room", name: "Frans Huang", lastMessage: "Lorem ipsum dolor sit amet, consectetur adipiscing elit."},
            {type: "room", name: "Frans Huang", lastMessage: "Lorem ipsum dolor sit amet, consectetur adipiscing elit."},
          ]}
          renderItem={({item}) => {
            if(item.type === "room"){
              return <Room {...item}/>
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
