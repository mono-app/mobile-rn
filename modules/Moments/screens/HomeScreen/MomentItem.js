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

const INITIAL_STATE = { poster: null, isLiked: false, totalFans: 0, totalComments: 0 }

export default class MomentItem extends React.Component{
  handleCommentPress = () => this.props.navigation.navigate("Comments",  { momentId: this.state.id });
  handleLikePress = () => {
    new PeopleAPI().getCurrentUserEmail().then(currentUserEmail => {
      return MomentsAPI.toggleLike(this.state.id, currentUserEmail);
    }).then(() => console.log(`Succes to like ${this.state.id} moment`))
  }

  refreshPosterDetail = () => {
    const { posterEmail } = this.state;
    new PeopleAPI().getDetail(posterEmail).then(poster => this.setState({ poster }));
    this.listener = MomentsAPI.getDetailWithRealTimeUpdate(this.state.id, momentItem => {
      const { content } = momentItem;
      const storage = firebase.storage();
      if(content.images !== undefined){
        const promises = [];
        momentItem.content.images.map(stringRef => {
          promises.push(storage.ref(stringRef).getDownloadURL());  
        });
        Promise.all(promises).then(results => {
          content.images = results.map(result => {
            return { image: {uri: result} }
          });
          this.setState({ content })
        });
      }

      this.setState({ ...momentItem });
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
    let timeFromNow = moment(this.state.postTime.seconds * 1000).fromNow();
    timeFromNow = TranslateAPI.translate(timeFromNow, "ID");
    console.log(this.state.content);

    return(
      <Surface style={{ elevation: 1, marginTop: 8, marginBottom: 8 }}>
        <View style={{ padding: 16, flexDirection: "row", alignItems: "flex-start" }}>
          <Avatar.Image size={50} source={{ uri: "https://picsum.photos/200/200/?random" }}/>
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
        {this.state.content.images !== undefined? this.state.content.images[0].image !== undefined?(
          <PhotoGrid images={this.state.content.images}/>
        ):<View/>:<View/>}
        {/* <View style={{ backgroundColor: "gray", flex: 1 }}>
          <Image source={{ uri: "https://picsum.photos/1080/720/?random" }} style={{ height: 200, alignItems: "stretch", resizeMode: "cover" }}/>
          <View style={{ flex: 1, flexDirection: "row", justifyContent: "space-evenly" }}>
            <Image source={{ uri: "https://picsum.photos/1080/720/?random" }} style={{ height: (window.width/4), alignSelf: "stretch", flex: 1, resizeMode: "cover" }}/>
            <Image source={{ uri: "https://picsum.photos/1080/720/?random" }} style={{ height: (window.width/4), alignSelf: "stretch", flex: 1, resizeMode: "cover" }}/>
            <Image source={{ uri: "https://picsum.photos/1080/720/?random" }} style={{ height: (window.width/4), alignSelf: "stretch", flex: 1, resizeMode: "cover" }}/>
            <View style={{ alignSelf: "stretch", flex: 1, height: (window.width/4) }}>
              <Image source={{ uri: "https://picsum.photos/1080/720/?random" }} style={{ alignSelf: "stretch", flex: 1, resizeMode: "cover" }}/>
              <View style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, backgroundColor: "rgba(0, 0, 0, .7)", alignItems: "center", justifyContent: "center" }}>
                <Text style={{ color: "white" }}>+7</Text>
              </View>
            </View>
          </View>
        </View> */}
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