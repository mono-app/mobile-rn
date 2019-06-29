import React from "react";
import { AppState, FlatList, KeyboardAvoidingView } from "react-native";
import { withTheme } from "react-native-paper";
import { Header  } from "react-navigation";

import MessagesAPI from "src/api/messages";
import PeopleAPI from "src/api/people";
import CurrentUserAPI from "src/api/people/CurrentUser";

import ChatBubble from "src/screens/ChatScreen/ChatBubble";
import BottomTextInput from "src/components/BottomTextInput";

const INITIAL_STATE = { 
  messages: [], message: "", appState: AppState.currentState,
  currentUserEmail: null, bubbleListHeight: 0, isLoadingNewData: false
}

// NOTE: Assuming this `ChatScreen` is a private room
//       For other than private room, you can create another component

/**
 * Navigation parameters
 * @params {string} roomId
 */
 class ChatScreen extends React.PureComponent{
  static navigationOptions = ({ navigation }) => {
    return { headerTitle: navigation.getParam("peopleName", "Chat") }
  }

  listenNewMessages = () => {
    this.messagesApi = new MessagesAPI(this.roomId);
    this.messageListener = this.messagesApi.getMessagesWithRealTimeUpdate(this.roomId, messages => {
      messages.forEach(message => {
        if(!message.read.isRead && message.senderEmail !== this.state.currentUserEmail){
          MessagesAPI.markAsRead(this.roomId, message.id, this.state.currentUserEmail)
        }
      });
      this.setState({ messages });
    })
  }

  handleSendPress = async message => {
    if(message !== null || message !== "" || message !== undefined){
      const copiedMessage = JSON.parse(JSON.stringify(message));
      const currentUserEmail = await CurrentUserAPI.getCurrentUserEmail();
      this.txtMessage.clear();
      await MessagesAPI.sendMessage(this.roomId, currentUserEmail, copiedMessage);
    }
  }

  handleBubbleListContentSizeChange = (contentWidth, contentHeight) => {
    if(this.state.bubbleListHeight < contentHeight){
      this.setState({ bubbleListHeight: contentHeight });
    }
  }

  handleBubbleListScroll = e => {
    const currentPosition = e.nativeEvent.contentOffset.y + e.nativeEvent.layoutMeasurement.height;
    const threshold = 100;
    const { isLoadingNewData } = this.state;
    
    if(currentPosition >= (this.state.bubbleListHeight - threshold) && !isLoadingNewData){
      this.setState({ isLoadingNewData: true });
      this.messagesApi.getNext().then(messages => {
        const newMessages = JSON.parse(JSON.stringify(messages));
        const oldMessages = JSON.parse(JSON.stringify(this.state.messages));
        const combinedMessages = oldMessages.concat(newMessages);
        this.setState({ messages: combinedMessages, isLoadingNewData: false });
      })
    }
  }

  handleAppStateChange = (nextAppState) => {
    if(nextAppState === "inactive" || nextAppState === "background"){
      if(this.messageListener) this.messageListener();
      this.messageListener = null;
    }else if(nextAppState === "active" && this.state.currentUserEmail && this.messageListener === null){
      this.listenNewMessages();
    }
    this.setState({ appState: nextAppState });
  }

  constructor(props){
    super(props);

    this.state = INITIAL_STATE;
    this.roomId = this.props.navigation.getParam("roomId", null);
    this.peopleEmail = this.props.navigation.getParam("peopleEmail", null);
    this.txtMessage = null;
    this.messagesApi = null;
    this.messageListener = null;
    this.listenNewMessages = this.listenNewMessages.bind(this);
    this.handleSendPress = this.handleSendPress.bind(this);
    this.handleBubbleListContentSizeChange = this.handleBubbleListContentSizeChange.bind(this);
    this.handleBubbleListScroll = this.handleBubbleListScroll.bind(this);
    this.handleAppStateChange = this.handleAppStateChange.bind(this);
  }

  componentDidMount(){
    new PeopleAPI().getDetail(this.peopleEmail).then(peopleData => {
      const { nickName } = peopleData.applicationInformation;
      this.props.navigation.setParams({ peopleName: nickName });
    })
    CurrentUserAPI.getCurrentUserEmail().then(currentUserEmail => this.setState({ currentUserEmail }));
    AppState.addEventListener("change", this.handleAppStateChange);
  }

  componentDidUpdate(){
    if(this.state.currentUserEmail && this.messageListener === null && this.state.appState === "active"){
      this.listenNewMessages();
    }
  }

  componentWillUnmount(){ 
    AppState.removeEventListener("change", this.handleAppStateChange);
    if(this.messageListener) this.messageListener();
  }

  render(){
    return(
      <KeyboardAvoidingView 
        style={{ flex: 1 }}
        keyboardVerticalOffset = {Header.HEIGHT + 20}>
          <FlatList
            inverted={true}
            style={{ paddingHorizontal: 16, marginVertical: 4 }}
            data={this.state.messages}
            onScroll={this.handleBubbleListScroll}
            oonContentSizeChange={this.handleBubbleListContentSizeChange}
            renderItem={({ item, index }) => {
              const bubbleStyle = (this.peopleEmail === item.senderEmail)? "peopleBubble": "myBubble";
              return <ChatBubble bubbleStyle={bubbleStyle} messageItem={item}/>
            }}/>

          <BottomTextInput ref={i => this.txtMessage = i } onSendPress={this.handleSendPress}/>
      </KeyboardAvoidingView>
    )
  }
}

export default withTheme(ChatScreen);