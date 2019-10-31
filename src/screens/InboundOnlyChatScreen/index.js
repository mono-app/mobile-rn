import React from "react";
import { withCurrentUser } from "src/api/people/CurrentUser";
import BotsAPI from "src/api/bots"
import ChatHeaderBot from "src/components/ChatHeaderBot";
import ChatList from "src/components/ChatList";
import { KeyboardAvoidingView } from "react-native";

function InboundOnlyChatScreen(props){
  const { navigation } = props;
  const room = navigation.getParam("room", null);
  const [ bot, setBot ] = React.useState(null);


  const fetchBot = async () => {
    const bot = await BotsAPI.getDetail(room.bot);
    setBot(bot);
  }

  React.useEffect(() => {
    fetchBot();
    return function cleanup(){
    }
  }, []);

  if(bot === null) return null;
  return (
    <KeyboardAvoidingView style={{ flex: 1 }}>
      <ChatHeaderBot
        navigation={navigation} title={bot.displayName} subtitle="Bot"
        profilePicture={bot.profilePicture} style={{ elevation: 0, borderBottomWidth: 1, borderColor: "#E8EEE8" }}/>
      <ChatList room={room} isBot={true}/>
    </KeyboardAvoidingView>
  )
};

InboundOnlyChatScreen.navigationOptions = { header: null }
export default withCurrentUser(InboundOnlyChatScreen)