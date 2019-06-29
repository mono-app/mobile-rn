import React from "react";
import { FlatList } from "react-native";
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'

import CurrentUserAPI from "src/api/people/CurrentUser";
import CommentsAPI from "modules/Moments/api/comments";

import BottomTextInput from "src/components/BottomTextInput";
import CommentItem from "./CommentItem";

const INITIAL_STATE = { comments: [] }

export default class CommentsScreen extends React.Component{
  static navigationOptions = { headerTitle: "Komentar" };

  handleSendPress = async (comment) => {
    if(this.momentId){
      const copiedComment = JSON.parse(JSON.stringify(comment));
      const currentUserEmail = await CurrentUserAPI.getCurrentUserEmail();
      if(this.txtComment) this.txtComment.clear();
      await CommentsAPI.postComment(this.momentId, copiedComment, currentUserEmail);
    }
  }

  constructor(props){
    super(props);

    this.state = INITIAL_STATE;
    this.txtComment = null;
    this.keyboardAwareScrollView = null;
    this.listener = null;
    this.momentId = this.props.navigation.getParam("momentId", null);
  }

  componentDidMount(){
    if(this.keyboardAwareScrollView !== null) this.keyboardAwareScrollView.scrollToEnd(true);
    this.listener = CommentsAPI.getCommentsWithRealTimeUpdate(this.momentId, comments => {
      this.setState({ comments })
    })
  }

  componentWillUnmount(){ if(this.listener) this.listener(); }
  
  render(){
    return(
      <KeyboardAwareScrollView ref={i => this.keyboardAwareScrollView = i} contentContainerStyle={{ flex: 1 }}>
        
        <FlatList
          data={this.state.comments}
          renderItem={({ item }) => {
            return <CommentItem {...item}/>
          }}/>

        <BottomTextInput 
          ref={i => this.txtComment = i}
          onSendPress={this.handleSendPress}/>
      </KeyboardAwareScrollView>
    )
  }
}