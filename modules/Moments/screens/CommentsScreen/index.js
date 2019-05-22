import React from "react";
import { FlatList } from "react-native";
import { NavigationEvents } from "react-navigation";
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'

import PeopleAPI from "src/api/people";
import CommentsAPI from "modules/Moments/api/comments";

import BottomTextInput from "src/components/BottomTextInput";
import CommentItem from "./CommentItem";

const INITIAL_STATE = { comments: [] }

export default class CommentsScreen extends React.Component{
  static navigationOptions = { headerTitle: "Komentar" };

  handleScreenWillBlur = () => { if(this.listener) this.listener(); }
  handleScreenDidFocus = () => {
    if(this.keyboardAwareScrollView !== null) this.keyboardAwareScrollView.scrollToEnd(true);
    this.listener = CommentsAPI.getCommentsWithRealTimeUpdate(this.momentId, comments => {
      console.log(comments);
      this.setState({ comments })
    })
  }

  handleSendPress = comment => {

    new PeopleAPI().getCurrentUserEmail().then(currentUserEmail => {
      return CommentsAPI.postComment(this.momentId, comment, currentUserEmail);
    }).then(() => {
      if(this.txtComment !== null) this.txtComment.clear()
    });
  }

  constructor(props){
    super(props);

    this.txtComment = null;
    this.keyboardAwareScrollView = null;
    this.listener = null;
    this.state = INITIAL_STATE;
    this.momentId = this.props.navigation.getParam("momentId", "yNdT762x95AnbxntkIlb");
    this.handleScreenDidFocus = this.handleScreenDidFocus.bind(this);
    this.handleSendPress = this.handleSendPress.bind(this);
  }
  
  render(){
    return(
      <KeyboardAwareScrollView ref={i => this.keyboardAwareScrollView = i} contentContainerStyle={{ flex: 1 }}>
        <NavigationEvents 
          onDidFocus={this.handleScreenDidFocus}
          onWillBlur={this.handleScreenWillBlur}/>

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