import React from "react";
import PropTypes from "prop-types";
import Tooltip from 'react-native-walkthrough-tooltip';
import { View } from "react-native";
import { Badge, Button, Text } from "react-native-paper";
import { withCurrentUser } from "src/api/people/CurrentUser";
import { withTranslation } from 'react-i18next';
import { withCurrentMessages } from "src/api/messages/CurrentMessages";

function ChatMenuSwitch(props){
  const [ selectedMenu, setSelectedMenu ] = React.useState("");

  const menuChange = (menu) => {
    setSelectedMenu(menu);
    if(props.onChange) props.onChange(menu);
  }

  const handleMenuChatPress = () => menuChange("chat");
  const handleMenuNotificationPress = () => menuChange("notification");

  React.useEffect(() => {
    menuChange("chat")
  }, [])

  return(
    <View style={{ display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "center", marginVertical: 16 }}>
      <View style={{ marginHorizontal: 16, position: "relative" }}>
        <Tooltip
          isVisible={props.showTutorialHomeChatSection}
          placement="bottom"
          showChildInTooltip={false}
          content={<Text>{props.t("chatHistoryHelpLabel")}</Text>}
          onClose={() => props.homeScreenTutorial.show(3)}>
          
            <Button 
              mode={selectedMenu === "chat"? "contained": "outlined"} style={{ borderRadius: 50 }}
              onPress={handleMenuChatPress}>
                {props.t("conversation")}
            </Button>
           
        </Tooltip>
        {(props.unreadChatRoomList.length>0)? 
            <Badge style={{position: "absolute", top: -5, right: -5,backgroundColor:"red" }}></Badge>
            : <View/>}
      </View>
      <View style={{ marginHorizontal: 16, position: "relative" }}>
        <Tooltip
            isVisible={props.showTutorialHomeNotifSection}
            placement="bottom"
            showChildInTooltip={false}
            content={<Text>{props.t("notifHistoryHelpLabel")}</Text>}
            onClose={() => props.homeScreenTutorial.end()}>
         
          <Button 
            mode={selectedMenu === "notification"? "contained": "outlined"} style={{ borderRadius: 50 }}
            onPress={handleMenuNotificationPress}>
            {props.t("notification")}
          </Button>
        
        </Tooltip>
        {(props.unreadBotRoomList.length>0)? 
          <Badge style={{position: "absolute", top: -5, right: -5,backgroundColor:"red" }}></Badge>
          : <View/>}
      </View>
    </View>
  )
}

ChatMenuSwitch.propTypes = { onPress: PropTypes.func }
ChatMenuSwitch.defaultProps = { onPress: () => {} }
export default withTranslation()(withCurrentUser(withCurrentMessages(ChatMenuSwitch)))