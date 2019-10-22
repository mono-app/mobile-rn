import React from "react";
import moment from "moment";
import { Dimensions, View, StyleSheet, TouchableOpacity } from "react-native";
import { Text, Card, Caption, Paragraph } from "react-native-paper";
import { default as MaterialCommunityIcons } from "react-native-vector-icons/MaterialCommunityIcons";
import DiscussionAPI from "modules/Classroom/api/discussion";
import FastImage from "react-native-fast-image";
import CircleAvatar from "src/components/Avatar/Circle";

const INITIAL_STATE = { posterEmail: null, discussion: {}, isLoading: true, poster: null, isLiked: false, totalFans: 0, totalComments: 0 }

export default class TimelineListItem extends React.Component{

  refreshDetail = async () => {
    const { schoolId, classId, taskId, discussion } = this.props;
    this.setState({ isLoading: true });
    this.isLikedListener = await DiscussionAPI.isLikedRealTimeUpdate(schoolId,classId,taskId,discussion.id, (isLiked) => {
      this.setState({isLiked});
    });

    this.setState({ isLoading: false, discussion, isLiked: discussion.isLiked });
  }

  constructor(props){
    super(props);
    this.state = { ...INITIAL_STATE, ...this.props };
    this.isLikedListener = null;
    this.refreshDetail = this.refreshDetail.bind(this);
  }

  componentWillUnmount(){ if(this.isLikedListener) this.isLikedListener(); }
  componentDidMount(){ this.refreshDetail(); }

  render(){
    const window = Dimensions.get("window");

    if(this.state.isLoading) return <View/>
    const { poster, discussion } = this.state;
    const hasImage = (discussion.images && discussion.images.length > 0);
    const remainingImageCount = 0;
    if(discussion.images && discussion.images.length>4){
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
        <TouchableOpacity onPress={this.props.onPress}>
          <View style={{ padding: 16, flexDirection: "row", alignItems: "flex-start" }}>
            <CircleAvatar size={40} uri={newPoster.applicationInformation.profilePicture}/>
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
                      <View key={index} style={{ alignSelf: "stretch", flex: 1, height: (window.width/4), padding:4 }}>
                        <FastImage 
                          resizeMode="cover"
                          source={{ uri: item.downloadUrl  }} 
                          style={{ alignSelf: "stretch", flex: 1 }}/>
                      </View>
                    )
                  }else if(index === 3) return (
                    <View key={index} style={{ alignSelf: "stretch", flex: 1, height: (window.width/4), padding:4 }}>
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
          <TouchableOpacity onPress={this.props.onLikePress} style={{ flexDirection: "row", alignItems: "center" }}>
            {this.state.isLiked?(
              <MaterialCommunityIcons name="heart" color="#EF6F6C" size={16} style={{ marginRight: 4 }}/>
            ):(
              <MaterialCommunityIcons name="heart-outline" size={16} style={{ marginRight: 4 }}/>
            )}
            <Caption>Suka</Caption>
          </TouchableOpacity>
          
          <TouchableOpacity onPress={this.props.onPress} style={{ flexDirection: "row", alignItems: "center" }}>
            <MaterialCommunityIcons name="comment-outline" size={16} style={{ marginRight: 4 }}/>
            <Caption>Komentar</Caption>
          </TouchableOpacity>
          <TouchableOpacity onPress={this.props.onSharePress} style={{ flexDirection: "row", alignItems: "center" }}>
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