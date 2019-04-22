import React from "react";
import {
  StyleSheet, Text, View, 
  TouchableOpacity, Image
} from 'react-native';


export default class Room extends React.Component{
  render(){
    return(
      <View style={styles.chatContainer}>
        <View style={styles.photoContainer}>
          <Image 
            style={styles.profilePicture}
            source={{uri: "https://picsum.photos/200/200/?random"}}/>
        </View>
        <View style={styles.descriptionContainer}>
          <Text style={{fontWeight: "500"}}>{this.props.name}</Text>
          <Text style={{fontSize: 12}}>{this.props.lastMessage}</Text>
        </View>
        <Text style={styles.timestamp}>11.00 AM</Text>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  chatContainer: {
    flexDirection: "row",
    backgroundColor: "white",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#E8EEE8"
  },
  photoContainer: { marginRight: 16 },
  profilePicture: {
    width: 50,
    height: 50,
    borderRadius: 50
  },
  descriptionContainer: { 
    width:0, 
    flexGrow: 1
  },
  timestamp: {
    fontSize: 12,
    color: "#BACCBC"
  }
})