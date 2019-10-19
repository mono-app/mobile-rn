import React from "react";
import PeopleAPI from "src/api/people";
import MomentAPI from "modules/Moments/api/moment";
import CommentsAPI from "modules/Moments/api/comments";
import Logger from "src/api/logger";
import { withCurrentUser } from "src/api/people/CurrentUser"

import BottomTextInput from "src/components/BottomTextInput";
import LoadingDialog from "src/components/LoadingDialog";
import Container from "src/components/Container";
import AppHeader from "src/components/AppHeader";
import CommentItem from "./CommentItem";
import MomentItem from "modules/Moments/components/MomentItem";
import { FlatList } from "react-native";
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'

function CommentsScreen(props){
  const { navigation, currentUser } = props;
  
  const momentId = navigation.getParam("momentId", null);

  const [ moment, setMoment ] = React.useState(null);
  const [ people, setPeople ] = React.useState(null);
  const [ comments, setComments ] = React.useState([]);

  const _isMounted = React.useRef(false);
  const listener = React.useRef(null);
  const momentListener = React.useRef(null);
  const commentFlatList = React.useRef(null);
  const txtComment = React.useRef(null);

  const handleContentSizeChange = () => { 
    if(commentFlatList.current) {
      setTimeout(() => commentFlatList.current.scrollToEnd(), 200);
    }
  }
  const handleSendPress = async (msg) => {
    const comment = msg.trim()
    if(momentId && comment.length>0){
      const copiedComment = JSON.parse(JSON.stringify(comment));
      if(txtComment.current) txtComment.current.clear();
      await CommentsAPI.postComment(momentId, copiedComment, currentUser.email);
    }
  }

  const handleSharePress = () => {
    payload = { moment, onComplete: () => {} }
    navigation.navigate("ShareMoment", payload)
  }
  
  const handlePicturePress = (index) => {
    payload = { index, images: moment.content.images }
    navigation.navigate("GallerySwiper", payload);
  };

  const loadData = async () =>{
    const moment = await MomentAPI.getDetail(momentId)
    const people = await PeopleAPI.getDetail(moment.posterEmail)
    if(_isMounted.current){
      setMoment(moment);
      setPeople(people);
    }
  }

  const listenForComments = () => {
    listener.current = CommentsAPI.getCommentsWithRealTimeUpdate(momentId, (comments) => {
      if(_isMounted.current) setComments(comments);
    });
  }

  const listenForMoment = () => {
    momentListener.current = MomentAPI.getDetailWithRealTimeUpdate(momentId, currentUser.email, (newMoment) => {
      Logger.log("CommentsScreen.listenForMoment#newMoment", newMoment);
      if(_isMounted.current) setMoment(newMoment);
    });
  }

  React.useEffect(() => {
    Logger.log("CommentsScreen#momentId", momentId);
    _isMounted.current = true;

    loadData();
    listenForComments();
    listenForMoment();

    return function cleanup(){
      _isMounted.current = false;
      if(listener.current) listener.current()
      if(momentListener.current) momentListener.current();
    }
  }, []);
  
  if(!people || !moment) return <LoadingDialog visible={true}/>
  return(
    <Container style={{ backgroundColor: "#E8EEE8" }}>
      <AppHeader navigation={navigation} style={{ backgroundColor: "white", elevation: 0 }}/>
      <KeyboardAwareScrollView contentContainerStyle={{ flex: 1 }}>
        <MomentItem moment={moment} canComment={false} onSharePress={handleSharePress} style={{ borderRadius: 0, elevation: 0 }}/>
        <FlatList
          ref={commentFlatList} data={comments} keyExtractor={(item) => item.id}
          onContentSizeChange={handleContentSizeChange}
          renderItem={({ item, index }) => {
            return <CommentItem comment={item} people={people} onSharePress={handleSharePress} onPicturePress={handlePicturePress}/>
          }}/>
        <BottomTextInput ref={txtComment} autoFocus={false} onSendPress={handleSendPress}/>
      </KeyboardAwareScrollView>
    </Container>
  )
}

CommentsScreen.navigationOptions = { header: null }
export default withCurrentUser(CommentsScreen);