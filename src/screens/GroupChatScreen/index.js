import React from "react";
import { withTheme } from "react-native-paper";
import { withCurrentUser } from "src/api/people/CurrentUser";
import MessagesAPI from "src/api/messages";
import ChatList from "src/components/ChatList";
import ChatBottomTextInput from "src/components/ChatBottomTextInput";
import ChatHeaderGroup from "src/components/ChatHeaderGroup";
import { KeyboardAvoidingView } from "react-native";
import ClassAPI from "modules/Classroom/api/class";

function GroupChatScreen(props){
  const { currentUser } = props;
  const room = props.navigation.getParam("room", null);
  const _isMounted = React.useRef(true);
  const [ headerTitle, setHeaderTitle ] = React.useState("");
  const subtitle = "Classroom Group"

  const handleSendPress = (message) => MessagesAPI.sendMessage(room.id, currentUser.id, message);

  handleGroupHeaderPress = () => {
    const payload = { room: room, title: headerTitle, subtitle }
    props.navigation.navigate("GroupChatDetails", payload)
  }

  const fetchPeople = async () => {   
    const class_ = await ClassAPI.getDetail(room.school.id,room.school.classId)
    setHeaderTitle(class_.room+" | Semester "+ class_.semester +" | "+ class_.subject);
  }
 
  React.useEffect(() => {
    fetchPeople();
    return function cleanup(){
      _isMounted.current = false
    }
  }, []);

  return (
    <KeyboardAvoidingView style={{ flex: 1 }}>
      <ChatHeaderGroup 
        navigation={props.navigation} title={headerTitle} subtitle={subtitle} onPress={handleGroupHeaderPress}
        style={{ elevation: 0, borderBottomWidth: 1, borderColor: "#E8EEE8" }}/>
      <ChatList navigation={props.navigation} room={room}/>
      <ChatBottomTextInput room={room}
        editable={true}
        onSendPress={handleSendPress}/>
    </KeyboardAvoidingView>
  )
}

GroupChatScreen.navigationOptions = { header: null }
export default withCurrentUser(withTheme(GroupChatScreen))