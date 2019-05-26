import React from "react";
import firebase from "react-native-firebase";
import moment from "moment";

import { View, StyleSheet, TouchableOpacity } from "react-native";
import { Text, Surface, Avatar, Caption, Paragraph } from "react-native-paper";
import { default as MaterialCommunityIcons } from "react-native-vector-icons/MaterialCommunityIcons";
import PhotoGrid from "modules/Moments/components/PhotoGrid";

import MomentsAPI from "modules/Moments/api/moment";
import PeopleAPI from "src/api/people";
import TranslateAPI from "src/api/translate";

const INITIAL_STATE = { isLoading: true, poster: null, isLiked: false, totalFans: 0, totalComments: 0 }

export default class MomentItem extends React.Component{
  handleCommentPress = () => this.props.navigation.navigate("Comments",  { momentId: this.state.id });
  handleLikePress = () => {
    new PeopleAPI().getCurrentUserEmail().then(currentUserEmail => {
      return MomentsAPI.toggleLike(this.state.id, currentUserEmail);
    })
  }

  refreshPosterDetail = () => {
    this.setState({ isLoading: true });
    const { posterEmail } = this.state;
    new PeopleAPI().getDetail(posterEmail).then(poster => this.setState({ poster }));
    this.listener = MomentsAPI.getDetailWithRealTimeUpdate(this.state.id, momentItem => {
      const { images } = momentItem.content;
      const newImages = images.map(image => {
        return { image: {uri: image.downloadUrl }}
      })
      momentItem.content.images = newImages;

      this.setState({ ...momentItem, isLoading: false });
      
      new PeopleAPI().getCurrentUserEmail().then(currentUserEmail => {
        const { fanEmails } = momentItem;
        if(fanEmails !== undefined) this.setState({ isLiked: momentItem.fanEmails.includes(currentUserEmail) });
      })
    })
  }

  constructor(props){
    super(props);

    this.state = { ...INITIAL_STATE, ...this.props };
    this.listener = null;
    this.refreshPosterDetail = this.refreshPosterDetail.bind(this);
    this.handleLikePress = this.handleLikePress.bind(this);
    this.handleCommentPress = this.handleCommentPress.bind(this);
  }

  componentWillUnmount(){ if(this.listener) this.listener(); }
  componentDidMount(){ this.refreshPosterDetail(); }

  render(){
    if(this.state.isLoading) return <View/>

    const hasImage = this.state.content.images.length > 0;
    let timeFromNow = moment(this.state.postTime.seconds * 1000).fromNow();
    timeFromNow = TranslateAPI.translate(timeFromNow, "ID");

    return(
      <Surface style={{ elevation: 1, marginTop: 8, marginBottom: 8 }}>
        <View style={{ padding: 16, flexDirection: "row", alignItems: "flex-start" }}>
          {this.state.poster?(
            <Avatar.Image size={50} source={{ uri: this.state.poster.applicationInformation.profilePicture, cache: "force-cache" }}/>
          ):null}
          <View style={{ marginLeft: 16 }}>
            {this.state.poster !== null?(
              <Text style={{ fontWeight: "700" }}>{this.state.poster.applicationInformation.nickName}</Text>
            ):<Text style={{ fontWeight: "700" }}></Text>}
            <Caption style={{ marginTop: 0 }}>{timeFromNow}</Caption>
          </View>
        </View>
        <View style={{ paddingHorizontal: 16, paddingBottom: 16 }}>
          <Paragraph>{this.state.content.message}</Paragraph>
        </View>
        {hasImage?(
          <PhotoGrid images={this.state.content.images}/>
        ):<View/>}
        <View style={{ ...styles.leftAlignedContainerWithTopBorder, paddingVertical: 8}}>
          <Caption style={{ marginRight: 16 }}>{this.state.totalFans} Fans</Caption>
          <Caption>{this.state.totalComments} Komentar</Caption>
        </View>
        <View style={styles.leftAlignedContainerWithTopBorder}>
          <TouchableOpacity onPress={this.handleLikePress} style={{ flexDirection: "row", alignItems: "center", marginRight: 16 }}>
            {this.state.isLiked?(
              <MaterialCommunityIcons name="heart" color="#EF6F6C" size={16} style={{ marginRight: 4 }}/>
            ):(
              <MaterialCommunityIcons name="heart-outline" size={16} style={{ marginRight: 4 }}/>
            )}
            <Caption>Suka</Caption>
          </TouchableOpacity>
          <TouchableOpacity onPress={this.handleCommentPress} style={{ flexDirection: "row", alignItems: "center" }}>
            <MaterialCommunityIcons name="comment-outline" size={16} style={{ marginRight: 4 }}/>
            <Caption>Komentar</Caption>
          </TouchableOpacity>
        </View>
      </Surface>
    )
  }
}

const styles = StyleSheet.create({
  leftAlignedContainerWithTopBorder: { 
    borderTopColor: "#E8EEE8", borderTopWidth: 1, flexDirection: "row", justifyContent: "flex-start", 
    alignItems: "center", padding: 16 
  }
})