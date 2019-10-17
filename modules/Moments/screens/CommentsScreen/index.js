import React from "react";
import { View, FlatList } from "react-native";
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { withCurrentUser } from "src/api/people/CurrentUser"
import CommentsAPI from "modules/Moments/api/comments";
import BottomTextInput from "src/components/BottomTextInput";
import CommentItem from "./CommentItem";
import { ActivityIndicator, Text, Dialog, Caption } from "react-native-paper";

import PeopleAPI from "src/api/people";
import MomentAPI from "modules/Moments/api/moment";

const INITIAL_STATE = { comments: [], moment: {}, people: {} }

class CommentsScreen extends React.PureComponent{
  static navigationOptions = { headerTitle: "Komentar" };

  handleSendPress = async (msg) => {
    const comment = msg.trim()
    if(this.momentId && comment.length>0){
      const copiedComment = JSON.parse(JSON.stringify(comment));
      if(this.txtComment) this.txtComment.clear();
      await CommentsAPI.postComment(this.momentId, copiedComment, this.props.currentUser.email);
      
      setTimeout(() => this.commentFlatList.scrollToEnd(), 200)
    }
  }

  loadData = async () =>{
    const moment = await MomentAPI.getDetail(this.momentId)
    const people = await PeopleAPI.getDetail(moment.posterEmail)
    if(this._isMounted)
      this.setState({moment, people})
  }

  handleSharePress = () => {
    payload = {
      moment: this.state.moment,
      onComplete: ()=>{}
    }
    this.props.navigation.navigate("ShareMoment",payload)
  }
  
  handlePicturePress = (index) => {
    payload = {
      index,
      images: this.state.moment.content.images
    }
    this.props.navigation.navigate("GallerySwiper", payload);
  }

  constructor(props){
    super(props);
    this.state = INITIAL_STATE;
    this._isMounted = null;
    this.txtComment = null;
    this.keyboardAwareScrollView = null;
    this.commentFlatList = null
    this.listener = null;
    this.momentListener = null;
    this.momentId = this.props.navigation.getParam("momentId", null);
    this.handleSendPress = this.handleSendPress.bind(this)
    this.loadData = this.loadData.bind(this)
    this.handleSharePress = this.handleSharePress.bind(this)
    this.handlePicturePress = this.handlePicturePress.bind(this)
  }

  async componentDidMount(){
    this._isMounted = true;
    await this.loadData()
    if(this.keyboardAwareScrollView !== null) this.keyboardAwareScrollView.scrollToEnd(true);
    this.listener = CommentsAPI.getCommentsWithRealTimeUpdate(this.momentId, comments => {
      if(comments.length>0){
        if(this._isMounted)
          this.setState({ comments })
      }else{
        if(this._isMounted)
          this.setState({ comments: [{id: "-1"}] })
      }
    })
    this.momentListener = MomentAPI.getDetailWithRealTimeUpdate(this.momentId, (newMoment) => {
      const clonedComments = JSON.parse(JSON.stringify(this.state.comments))
      if(this._isMounted)
        this.setState({moment:newMoment, comments: clonedComments});
    })

  }

  componentWillUnmount(){ 
    this._isMounted = false;
    if(this.listener) this.listener(); 
    if(this.momentListener) this.momentListener(); 
  }
  
  render(){
    if(!this.state.people.applicationInformation || !this.state.moment.content){
      return (
        <Dialog visible={true}>
          <Dialog.Content style={{ flexDirection: "row", justifyContent: "space-evenly" }}>
            <ActivityIndicator/>
            <View>
              <Text>Sedang memuat data</Text>
              <Caption>Harap tunggu...</Caption>
            </View>
          </Dialog.Content>
        </Dialog>
      )
    }
    return(
      <View style={{ flex: 1, backgroundColor: "#E8EEE8" }}>

        <KeyboardAwareScrollView ref={i => this.keyboardAwareScrollView = i} contentContainerStyle={{ flex: 1 }}>
          
          <FlatList
            ref={i=> this.commentFlatList = i}
            data={this.state.comments}
            keyExtractor={(item) => item.id}
            renderItem={({ item, index }) => {
              return <CommentItem 
                {...item} 
                index={index} 
                people={this.state.people} 
                moment={this.state.moment}
                onSharePress={this.handleSharePress}
                onPicturePress={this.handlePicturePress}
              />
            }}/>

          <BottomTextInput 
            ref={i => this.txtComment = i}
            autoFocus={false}
            onSendPress={this.handleSendPress}
            />
        </KeyboardAwareScrollView>
      </View>
    )
  }
}

export default withCurrentUser(CommentsScreen);