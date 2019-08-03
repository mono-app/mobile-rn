import React from "react";
import moment from "moment";
import { Dimensions, View, StyleSheet, TouchableOpacity } from "react-native";
import { Text, Card, Caption, Paragraph } from "react-native-paper";
import { default as MaterialCommunityIcons } from "react-native-vector-icons/MaterialCommunityIcons";

import MomentsAPI from "modules/Moments/api/moment";
import DiscussionAPI from "modules/Classroom/api/discussion";
import CurrentUserAPI from "src/api/people/CurrentUser";
import PeopleAPI from "src/api/people";
import TranslateAPI from "src/api/translate";
import FastImage from "react-native-fast-image";

import SquareAvatar from "src/components/Avatar/Square";
import PhotoGrid from "modules/Moments/components/PhotoGrid";

const INITIAL_STATE = { posterEmail: null, discussion: {}, isLoading: true, poster: null, isLiked: false, totalFans: 0, totalComments: 0 }

export default class TimelineListItem extends React.Component{

  refreshDetail = async () => {
    const { schoolId, classId, taskId, discussionId } = this.props;

     this.setState({ isLoading: true });
     const promises = [ new DiscussionAPI().getDetail(schoolId, classId, taskId, discussionId)];

     Promise.all(promises).then(results => {
       const discussion = results[0];
       this.setState({ isLoading: false, discussion });
     })
  }

  handleCommentPress = () => {

  }
  handleLikePress = async () => {
    
  }
  handleSharePress = () => {

  }

  constructor(props){
    super(props);

    this.state = { ...INITIAL_STATE, ...this.props };
    this.listener = null;
    this.refreshDetail = this.refreshDetail.bind(this);
    this.handleLikePress = this.handleLikePress.bind(this);
    this.handleCommentPress = this.handleCommentPress.bind(this);
    this.handleSharePress = this.handleSharePress.bind(this);
  }

  componentWillUnmount(){ if(this.listener) this.listener(); }
  componentDidMount(){ this.refreshDetail(); }

  render(){
    const window = Dimensions.get("window");

    if(this.state.isLoading) return <View/>
    const { poster, discussion } = this.state;

    const hasImage = discussion.images.length > 0;
    const remainingImageCount = 0;
    if(discussion.images.length>4){
      remainingImageCount = discussion.images.length-4;
    }
    
    let timeFromNow = moment(discussion.creationTime.seconds*1000).format("DD MMMM YYYY HH:mm");
    
    let newPoster = JSON.parse(JSON.stringify(poster));
    if(newPoster === null){
      newPoster = {};
      newPoster.applicationInformation = {};
      newPoster.applicationInformation.nickName = "";
      newPoster.applicationInformation.profilePicture = "https://picsum.photos/200/200/?random";
    }

    return(
      <Card style={{ elevation: 1, marginHorizontal: 8, marginTop: 8}}>
        <TouchableOpacity>
          <View style={{ padding: 16, flexDirection: "row", alignItems: "flex-start" }}>
            <SquareAvatar size={40} uri={newPoster.applicationInformation.profilePicture}/>
            <View style={{ marginLeft: 16 }}>
              <Text style={{ fontWeight: "700" }}>{discussion.posterEmail}</Text>
              <Caption style={{ marginTop: 0 }}>{timeFromNow}</Caption>
            </View>
          </View>
          <View style={{ paddingHorizontal: 16, paddingBottom: 16 }}>
            <Paragraph>{discussion.contents} 
            </Paragraph>
          </View>

          { hasImage?(
            <View style={{ flex: 1, flexDirection: "row", marginHorizontal: 8 }}>
                {discussion.images.map((item, index) => {
                  if((index >= 0 && index < 3)) {
                    return (
                      <FastImage 
                        key={index} 
                        resizeMode="cover"
                        source={{ uri: item.downloadUrl  }} 
                        style={{ height: (window.width/4), flex:1, margin:8 }}/>
                    )
                  }else if(index === 3) return (
                    <View key={index} style={{ alignSelf: "stretch", flex: 1, height: (window.width/4), margin:8 }}>
                      <FastImage source={{ uri: item.downloadUrl }} style={{ alignSelf: "stretch", flex: 1 }} resizeMode="cover"/>
                      {(remainingImageCount>0)? 
                        <View style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, backgroundColor: "rgba(0, 0, 0, .7)", alignItems: "center", justifyContent: "center" }}>
                          <Text style={{ color: "white" }}>+ {remainingImageCount}</Text>
                        </View>
                        :<View/>}
                    </View>
                  );
                })}
            </View>

          ):<View/>}
        

          
        </TouchableOpacity>
       
        <View style={styles.buttonContainer}>
          <TouchableOpacity onPress={this.handleLikePress} style={{ flexDirection: "row", alignItems: "center" }}>
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
          <TouchableOpacity onPress={this.handleCommentPress} style={{ flexDirection: "row", alignItems: "center" }}>
            <MaterialCommunityIcons name="share" size={16} style={{ marginRight: 4 }}/>
            <Caption>Share</Caption>
          </TouchableOpacity>
        </View>
      </Card>
    )
  }
}

const styles = StyleSheet.create({
  buttonContainer: { 
    borderTopColor: "#E8EEE8", 
    borderTopWidth: 1, 
    flexDirection: "row", 
    justifyContent: "space-between", 
    paddingHorizontal: 40,
    paddingVertical: 8
  }
})