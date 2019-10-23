import React from "react";
import PropTypes from "prop-types";
import Logger from "src/api/logger";
import DiscussionAPI from "modules/Classroom/api/discussion";
import PeopleAPI from "src/api/people";
import moment from "moment";
import { StyleSheet } from "react-native";
import { withCurrentUser } from "src/api/people/CurrentUser";
import { withNavigation } from "react-navigation";
import Utils from "src/api/utils"
import ChatBubble from "src/components/ChatBubble";
import ChatBubbleWithPhoto from "src/components/ChatBubbleWithPhoto";
import { FlatList, View, AsyncStorage } from "react-native";
import { Chip } from "react-native-paper";

function ChatList(props){
  const { messages, currentUser, navigation, room } = props;
  const SelectedBubble = room.audiences.length > 2? ChatBubbleWithPhoto: ChatBubble;
  const [ listHeight, setListHeight ] = React.useState(0);
  const [ bgColor, setBgColor ] = React.useState("#fff");

  const styles = StyleSheet.create({
    container: { flexGrow: 1, paddingLeft: 16, paddingRight: 16, marginVertical: 4 }
  })

  const beforeBirthdaySave = (value) => moment(value, "DD/MM/YYYY").isValid();

  const handleListContentSizeChange = (contentWidth, contentHeight) => {
    Logger.log("ChatList.handleListContentSizeChange#contentHeight", contentHeight);
    setListHeight(contentHeight);
  }

  const handleListScroll = (e) => {
    const currentPosition = e.nativeEvent.contentOffset.y + e.nativeEvent.layoutMeasurement.height;
    const threshold = 100;
    Logger.log("ChatList.handleListScroll#currentPosition", currentPosition);
    if(currentPosition >= (listHeight - threshold)) props.onReachTop();
  }

  const handleDiscussionPress = async (item) => {
    const schoolId = item.details.discussion.schoolId
    const classId = item.details.discussion.classId
    const taskId = item.details.discussion.taskId
    const discussionId = item.details.discussion.id
   
    const discussion = await DiscussionAPI.getDetail(schoolId, classId, taskId, discussionId, currentUser.email)
    
    payload = { isFromNotification: false, schoolId, classId, taskId, discussion }
    props.navigation.navigate("DiscussionComment", payload)
  }

  const handleMomentPress = (item) => {
    const payload = { momentId: item.details.moment.id }
    props.navigation.navigate("MomentComments", payload)
  }

  const handleMomentCommentPress = (item) => {
    const payload = { momentId: item.details.momentId }
    props.navigation.navigate("MomentComments", payload)
  }


  const handleSetupBirthdayPress = async (message) => {
    Logger.log("ChatList.handleSetupBirthdayPress#message", message);

    // if birthday has been setup, go to account screen
    const targetUser = await PeopleAPI.getDetail(message.details.targetEmail);
    if(targetUser.personalInformation.birthday === undefined){
      const payload = {
        databaseCollection: "users", databaseDocumentId: targetUser.email,
        databaseFieldName: "personalInformation.birthday", beforeSave: beforeBirthdaySave,
        caption: "Format tanggal lahir: 22/12/2007",
        placeholder: "DD/MM/YYYY", fieldValue: "", fieldTitle: "Tanggal Lahir",
      }
      navigation.navigate("EditSingleField", payload);
    }else{
      navigation.navigate({ routeName: "Account", key: "SettingsTab" })
    }
  }

  const handleFriendRequestPress = async (message) => {
    Logger.log("ChatList.handleFriendRequestPress#message", message);
    navigation.navigate("PeopleInformation", { 
      peopleEmail: message.details.targetEmail, source: message.details.source
    });
  }
  
  React.useEffect(() => {
    const init = async () => {
      const color = await AsyncStorage.getItem(Utils.KEY_STORAGE_CHAT_BACKGROUND)
      if(color){
        setBgColor(color)
      }
    }

    init()

    return function cleanup(){
    }
  }, [])

  return (
    <FlatList 
      style={[ styles.container, props.style,{backgroundColor: bgColor} ]} keyExtractor={(item) => item.id}
      onScroll={handleListScroll} onContentSizeChange={handleListContentSizeChange}
      data={messages} inverted
      renderItem={({ item }) => {
        Logger.log("ChatList.renderItem#item", item);
        const bubbleStyle = (currentUser.email !== item.senderEmail)? "peopleBubble": "myBubble";
        if(item.type === "text") {
          return <SelectedBubble style={{ marginBottom: 8, marginTop: 4 }} bubbleStyle={bubbleStyle} message={item}/>
        }else if(item.type === "discussion-share"){
          return <SelectedBubble style={{ marginBottom: 8, marginTop: 4 }} bubbleStyle={bubbleStyle} clickable={true} onPress={handleDiscussionPress} message={item} roomId={room.id}/>
        }else if(item.type === "new-discussion"){
          return <SelectedBubble style={{ marginBottom: 8, marginTop: 4 }} bubbleStyle={bubbleStyle} clickable={true} onPress={handleDiscussionPress} message={item} roomId={room.id}/>
        }else if(item.type === "new-discussion-comment"){
          return <SelectedBubble style={{ marginBottom: 8, marginTop: 4 }} bubbleStyle={bubbleStyle} clickable={true} onPress={handleDiscussionPress} message={item} roomId={room.id}/>
        }else if(item.type === "moment-share"){
          return <SelectedBubble style={{ marginBottom: 8, marginTop: 4 }} bubbleStyle={bubbleStyle} clickable={true} onPress={handleMomentPress} message={item} roomId={room.id}/>
        }else if(item.type === "moment-comment"){
          return <SelectedBubble style={{ marginBottom: 8, marginTop: 4 }} bubbleStyle={bubbleStyle} clickable={true} onPress={handleMomentCommentPress} message={item} roomId={room.id}/>
        }else if(item.type === "setup-birthday"){
          return <SelectedBubble style={{ marginBottom: 8, marginTop: 4 }} bubbleStyle={bubbleStyle} clickable={true} onPress={handleSetupBirthdayPress} message={item} roomId={room.id}/>
        }else if(item.type === "friend-request"){
          return <SelectedBubble style={{ marginBottom: 8, marginTop: 4 }} bubbleStyle={bubbleStyle} clickable={true} onPress={handleFriendRequestPress} message={item} roomId={room.id}/>
        }else if(item.type === "date-separator" || item.type === "lets-start-chat"){
          return (
            <View style={{ display: "flex", flexGrow: 1, alignItems: "center", paddingVertical: 8, paddingHorizontal: 16 }}>
              <Chip>{item.details.value}</Chip>
            </View>
          )
        }
      }}/>
  )
}

ChatList.propTypes = { 
  onReachTop: PropTypes.func, 
  style: PropTypes.shape(), room: PropTypes.shape().isRequired,
  messages: PropTypes.arrayOf(PropTypes.shape()).isRequired
};
ChatList.defaultProps = { onReachTop: () => {}, style: {} }
export default withNavigation(withCurrentUser(ChatList));