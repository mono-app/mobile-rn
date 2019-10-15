import React from "react";
import { View, StyleSheet, FlatList  } from "react-native";
import { Text, Avatar, Caption, Surface } from "react-native-paper";
import { default as MaterialCommunityIcons } from "react-native-vector-icons/MaterialCommunityIcons";
import moment from "moment";
import TranslateAPI from "src/api/translate";
import PeopleDetailListener from "src/components/PeopleDetailListener";
import {  TouchableOpacity } from "react-native-gesture-handler";
import SquareAvatar from "src/components/Avatar/Square";
import ImageListItem from "src/components/ImageListItem"
import LikeButton from "modules/Moments/components/MomentItem/LikeButton";

const INITIAL_STATE = { nickName: "", profilePicture: "https://picsum.photos/200/200/?random" }

export default class CommentItem extends React.PureComponent{
  handlePeopleDetailListenerChange = (peopleData) => {
    const { applicationInformation } = peopleData;
    this.setState({ nickName: applicationInformation.nickName, profilePicture: applicationInformation.profilePicture });
  }

  handlePicturePress = (index) => {
    this.props.onPicturePress(index)
  }

  constructor(props){
    super(props);

    this.state = INITIAL_STATE;
    this.handlePeopleDetailListenerChange = this.handlePeopleDetailListenerChange.bind(this);
    this.handlePicturePress = this.handlePicturePress.bind(this);
  }

  render(){
 
    let shortTimeFromNow =  <MaterialCommunityIcons name="progress-clock" size={16}/>
    if(this.props.timestamp){
      const timeFromNow = moment(this.props.timestamp.seconds * 1000).fromNow();
      shortTimeFromNow = TranslateAPI.shortTime(timeFromNow);
    }
    let createdDate = "-"
    if(this.props.moment.postTime){
      const creationDate = moment(this.props.moment.postTime.seconds * 1000).format("DD MMMM YYYY")
      const creationTime = moment(this.props.moment.postTime.seconds * 1000).format("HH:mm")
      createdDate = creationDate+" | Jam "+ creationTime+" WIB"
    }

    return(
      <View>
        {(this.props.index===0)?<Surface style={[ styles.surface ]}>
            <View style={styles.profile}>
              <SquareAvatar size={50} uri={this.props.people.profilePicture}/>
              <View style={{ marginLeft: 8 }}>
                <Text style={{ margin: 0, fontWeight: "bold" }}>{this.props.people.applicationInformation.nickName}</Text>
                <Caption style={{ margin: 0 }}>{createdDate}</Caption>
              </View>
            </View>
            <View style={styles.textContainer}>
              <Text style={{ textAlign: "justify" }}>{this.props.moment.content.message}</Text>
              <FlatList 
                style={styles.imagesContainer} 
                data={this.props.moment.content.images} 
                keyExtractor={(item) => (item.uri)?item.uri :item.downloadUrl}
                horizontal={true}
                renderItem={({ item, index }) => {
                  return <ImageListItem 
                            onPress={() => this.handlePicturePress(index)}
                            image={item}/>
                }}/> 
            </View>
            <View style={styles.actionContainer}>
              <LikeButton style={styles.actionItem} moment={this.props.moment}/>
            
              <TouchableOpacity style={styles.actionItem} onPress={this.props.onSharePress}>
                <MaterialCommunityIcons name="share-variant" size={16} style={{ marginRight: 4 }}/>
                <Text>Bagikan</Text>
              </TouchableOpacity>
            </View>
          </Surface> : <View/>}

        {(this.props.peopleEmail)? 
          <View style={{ flex: 1, flexDirection: "row", padding: 16, paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: "#E8EEE8", backgroundColor:"#fff" }}>
          <PeopleDetailListener peopleEmail={this.props.peopleEmail} onChange={this.handlePeopleDetailListenerChange}/>

          <Avatar.Image size={50} source={{ uri: this.state.profilePicture, cache: "force-cache" }}/>
          <View style={{ paddingHorizontal: 8, flex: 1, marginTop:4 }}>
            <Text style={{ fontWeight: "700" }}>{this.state.nickName}</Text>
            <Text>{this.props.comment}</Text>
          </View>
          <Caption>{shortTimeFromNow}</Caption>
        </View>
          :<View/>}        
        
      </View>
    )
  }
}

const styles = StyleSheet.create({
  surface: { elevation: 4, padding: 16, display: "flex", flexDirection: "column", borderRadius: 4, marginBottom: 4 },
  profile: { display: "flex", flexDirection: "row", alignItems: "center", marginBottom: 8 },
  textContainer: { borderBottomColor: "#E8EEE8", borderBottomWidth: 1, paddingBottom: 8 }, 
  actionContainer: { display: "flex", flexDirection: "row", justifyContent: "space-around", alignItems: "center", paddingTop: 8 },
  actionItem: { display: "flex", flexDirection: "row", alignItems: "center", padding: 4 },
  imagesContainer: { display: "flex", flexDirection: "row", marginTop: 4, marginBottom: 4, flexGrow: 1 },
})
