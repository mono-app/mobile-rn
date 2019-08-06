import React from "react";
import { Dimensions, View, FlatList, StyleSheet } from "react-native";
import { Text, Card, Caption, Paragraph } from "react-native-paper";
import AppHeader from "src/components/AppHeader";
import DiscussionAPI from "modules/Classroom/api/discussion";
import {  TouchableOpacity } from "react-native-gesture-handler";
import SquareAvatar from "src/components/Avatar/Square";
import FastImage from "react-native-fast-image";
import moment from "moment";
import TextInput from "src/components/TextInput";
import { default as EvilIcons } from "react-native-vector-icons/EvilIcons";
import Button from "src/components/Button";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { default as MaterialCommunityIcons } from "react-native-vector-icons/MaterialCommunityIcons";
import StudentAPI from "modules/Classroom/api/student";
import CommentListItem from "src/components/CommentListItem";
import CurrentUserAPI from "src/api/people/CurrentUser";

const INITIAL_STATE = { isLoading: true, discussion: {}, comment:"" };

export default class DiscussionCommentScreen extends React.PureComponent {
  static navigationOptions = ({ navigation }) => {
    return {
      header: (
        <AppHeader
          navigation={navigation}
          title={"Diskusi Umum"}
          style={{ backgroundColor: "transparent" }}
        />
      )
    };
  };

  loadDiscussion = async () => {

    this.setState({ isLoading: true});
    const student = await StudentAPI.getDetail(this.schoolId, this.discussion.posterEmail)
    this.setState({ isLoading: false, discussion: this.discussion , posterName: student.name });
  }

  loadComments = async () => {
    const commentList = await DiscussionAPI.getComments(this.schoolId, this.classId, this.taskId, this.discussion.id);
    this.setState({commentList})
    console.log(commentList)
  }

  handleCommentChange = comment => {
    this.setState({comment})
  }


  handleSendCommentPress = async () => {
    console.log("bagikan")
    const currentUserEmail= await CurrentUserAPI.getCurrentUserEmail();

    data = {
      comment: this.state.comment,
      posterEmail: currentUserEmail
    }
    await DiscussionAPI.sendComment(this.schoolId, this.classId, this.taskId, this.discussion.id, data)
    this.setState({comment:"",})
    this.loadComments();
  }

  constructor(props) {
    super(props);
    this.state = INITIAL_STATE;
    this.loadDiscussion = this.loadDiscussion.bind(this);
    this.loadComments = this.loadComments.bind(this);
    this.handleCommentChange = this.handleCommentChange.bind(this);
    this.handleSendCommentPress = this.handleSendCommentPress.bind(this);
    this.schoolId = this.props.navigation.getParam("schoolId", "");
    this.classId = this.props.navigation.getParam("classId", "");
    this.taskId = this.props.navigation.getParam("taskId", "");
    this.discussion = this.props.navigation.getParam("discussion", "");
  
  }

  componentDidMount(){
    this.loadDiscussion();
    this.loadComments();
  }

  render() {  
    const window = Dimensions.get("window");
    let creationDate = "";  
    let creationTime = "";

    if(this.state.discussion.creationTime){
       creationDate = moment(this.state.discussion.creationTime.seconds * 1000).format("DD MMMM YYYY");
       creationTime = moment(this.state.discussion.creationTime.seconds * 1000).format("HH:mm");
    }
    const remainingImageCount = 0;
    if(this.state.discussion.images && this.state.discussion.images.length>4){
      remainingImageCount = this.state.discussion.images.length-4;
    }
    return (  

      <View style={{ flex: 1, backgroundColor: "#E8EEE8", paddingBottom:16 }}>
        <KeyboardAwareScrollView style={{flex:1}}>         

          <Card style={{ elevation: 1, marginTop: 8}}>
            <TouchableOpacity>
              <View style={{ padding: 16, flexDirection: "row", alignItems: "flex-start" }}>
                <SquareAvatar size={40} uri={"https://picsum.photos/200/200/?random"}/>
                <View style={{ marginLeft: 16 }}>
                  <Text style={{ fontWeight: "700" }}>{this.state.posterName}</Text>
                  <Caption style={{ marginTop: 0 }}>{creationDate} | Jam {creationTime} WIB</Caption>
                </View>
              </View>
              <View style={{ paddingHorizontal: 16, paddingBottom: 16 }}>
                <Text style={{ fontWeight: "700" }}>{this.state.discussion.title}</Text>
                <Paragraph>
                  {this.state.discussion.description} 
                </Paragraph>
              </View>

              { (this.state.discussion.images && this.state.discussion.images.length) > 0?(
                <View style={{ flex: 1, flexDirection: "row", marginHorizontal: 8 }}>
                    {this.state.discussion.images.map((item, index) => {
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
              <TouchableOpacity style={{ flexDirection: "row", alignItems: "center" }}>
                <MaterialCommunityIcons name="comment-outline" size={16} style={{ marginRight: 4 }}/>
                <Caption>Komentar</Caption>
              </TouchableOpacity>
              <TouchableOpacity onPress={this.handleSharePress} style={{ flexDirection: "row", alignItems: "center" }}>
                <MaterialCommunityIcons name="share" size={16} style={{ marginRight: 4 }}/>
                <Caption>Bagikan</Caption>
              </TouchableOpacity>
              <TouchableOpacity onPress={this.handleMuteNotifPress} style={{ flexDirection: "row", alignItems: "center" }}>
                <MaterialCommunityIcons name="bell" size={16} style={{ marginRight: 4 }}/>
                <Caption>Matikan</Caption>
              </TouchableOpacity>
            </View>
          </Card>
            <Card style={{marginHorizontal: 8,marginTop:8, padding:8}}>
              <View style={{flexDirection:"row", alignItems:"center"}}>
                <SquareAvatar size={30} uri={"https://picsum.photos/200/200/?random"}/>
                <TextInput
                  style={{ flex:1, marginBottom: 0, marginLeft:8 }}
                  onChangeText={this.handleCommentChange}
                  value={this.state.comment}
                  multiline={true}
                  placeholder="Tuliskan komentar kamu di sini."
                />         
              </View>
              <View style={{flexDirection: 'row', justifyContent: 'flex-end'}}>
                <Text>0/500</Text>
              </View>
              <View style={{flexDirection: 'row', justifyContent: 'flex-end', marginTop:8}}>
                <EvilIcons name="image" size={24} style={{ color: "#5E8864",padding:8 }}/>
                <EvilIcons name="camera" size={24} style={{ color: "#5E8864",padding:8 }}/>
                <EvilIcons name="location" size={24} style={{ color: "#5E8864",padding:8 }}/>
                <Button
                  onPress={this.handleSendCommentPress}
                  isLoading={this.state.isLoading}
                  style={{paddingVertical:8,paddingLeft:8,paddingRight:8,marginBottom:0}}
                  text={"Bagikan"}
                />
              </View>
            </Card>
          <Card style={{marginHorizontal: 8,marginTop:8, padding:8}}>
            <FlatList
              data={this.state.commentList}
              renderItem={({ item, index }) => {
                return (
                  <CommentListItem 
                    key={index} comment={item} />
                )
              }}
            />
          </Card>
        </KeyboardAwareScrollView>
      </View>

    );
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
  },
  subjectContainer:{
    marginTop: 8,
    backgroundColor: "#fff",
    flexDirection: "column",
    padding: 16
  },
  listItemContainer: {
    padding: 16,
    flexDirection: "row",
    justifyContent: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#E8EEE8"
  }
});
