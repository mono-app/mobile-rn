import React from "react";
import moment from "moment";
import { View, StyleSheet, TouchableOpacity } from "react-native";
import { Text, Surface, Caption, Paragraph } from "react-native-paper";
import { default as MaterialCommunityIcons } from "react-native-vector-icons/MaterialCommunityIcons";

import MomentsAPI from "modules/Moments/api/moment";
import CurrentUserAPI from "src/api/people/CurrentUser";
import PeopleAPI from "src/api/people";
import TranslateAPI from "src/api/translate";

import PeopleDetailListener from "src/components/PeopleDetailListener";
import CircleAvatar from "src/components/Avatar/Circle";
import PhotoGrid from "modules/Moments/components/PhotoGrid";

const INITIAL_STATE = { posterEmail: null, isLoading: true, poster: null, isLiked: false, totalFans: 0, totalComments: 0 }

export default class MomentItem extends React.Component{
  refreshPosterDetail = async () => {
    this.setState({ isLoading: true });

    const currentUserEmail = await CurrentUserAPI.getCurrentUserEmail();
    this.listener = MomentsAPI.getDetailWithRealTimeUpdate(this.state.id, (momentItem) => {
      const newMomentItem = JSON.parse(JSON.stringify(momentItem));
      const { images } = newMomentItem.content;
      const newImages = images.map((image) => {
        return { image: {uri: image.downloadUrl }}
      })
      newMomentItem.content.images = newImages;

      const { fanEmails } = newMomentItem;
      let isLiked = false;
      if(fanEmails !== undefined) isLiked = fanEmails.includes(currentUserEmail);
      this.setState({ ...newMomentItem, isLoading: false, isLiked });
    })
  }

  handlePeopleDetailListenerChange = (peopleData) => this.setState({ poster: peopleData });
  handleCommentPress = () => this.props.navigation.navigate("Comments",  { momentId: this.state.id });
  handleLikePress = async () => {
    const currentUserEmail = await CurrentUserAPI.getCurrentUserEmail();
    await MomentsAPI.toggleLike(this.state.id, currentUserEmail);
  }

  constructor(props){
    super(props);

    this.state = { ...INITIAL_STATE, ...this.props };
    this.listener = null;
    this.refreshPosterDetail = this.refreshPosterDetail.bind(this);
    this.handleLikePress = this.handleLikePress.bind(this);
    this.handleCommentPress = this.handleCommentPress.bind(this);
    this.handlePeopleDetailListenerChange = this.handlePeopleDetailListenerChange.bind(this);
  }

  componentWillUnmount(){ if(this.listener) this.listener(); }
  componentDidMount(){ this.refreshPosterDetail(); }

  render(){
    if(this.state.isLoading) return <View/>

    const hasImage = this.state.content.images.length > 0;
    let timeFromNow = moment(this.state.postTime.seconds * 1000).fromNow();
    timeFromNow = TranslateAPI.translate(timeFromNow, "ID");

    const { poster } = this.state;
    let newPoster = JSON.parse(JSON.stringify(poster));
    if(newPoster === null){
      newPoster = {};
      newPoster.applicationInformation = {};
      newPoster.applicationInformation.nickName = "";
      newPoster.applicationInformation.profilePicture = "https://picsum.photos/200/200/?random";
    }

    return(
      <Surface style={{ elevation: 1, marginTop: 8, marginBottom: 8 }}>

        <PeopleDetailListener peopleEmail={this.state.posterEmail} onChange={this.handlePeopleDetailListenerChange}/>

        <View style={{ padding: 16, flexDirection: "row", alignItems: "flex-start" }}>
          <CircleAvatar size={50} uri={newPoster.applicationInformation.profilePicture}/>
          <View style={{ marginLeft: 16 }}>
            <Text style={{ fontWeight: "700" }}>{newPoster.applicationInformation.nickName}</Text>
            <Caption style={{ marginTop: 0 }}>{timeFromNow}</Caption>
          </View>
        </View>
        <View style={{ paddingHorizontal: 16, paddingBottom: 16 }}>
          <Paragraph>{this.state.content.message}</Paragraph>
        </View>
        {hasImage?(
          <PhotoGrid navigation={this.props.navigation} images={this.state.content.images}/>
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