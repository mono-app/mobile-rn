import React from "react";
import PropTypes from "prop-types";
import Tooltip from 'react-native-walkthrough-tooltip';
import { View } from "react-native";
import { Badge, Button, Text } from "react-native-paper";
import { withCurrentUser } from "src/api/people/CurrentUser";

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
    console.log("props.unreadChatprops.unreadChatprops.unreadChatprops.unreadChatprops.unreadChatprops.unreadChatprops.unreadChatprops.unreadChatprops.unreadChatprops.unreadChatprops.unreadChat")
    console.log(props.unreadChat)
  }, [])

  return(
    <View style={{ display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "center", marginVertical: 16 }}>
      <View style={{ marginHorizontal: 16, position: "relative" }}>
        <Tooltip
          isVisible={props.showTutorialHomeChatSection}
          placement="bottom"
          showChildInTooltip={false}
          content={<Text>Klik disini melihat history chat</Text>}
          onClose={() => props.homeScreenTutorial.show(3)}>
            <Button 
              mode={selectedMenu === "chat"? "contained": "outlined"} style={{ borderRadius: 50 }}
              onPress={handleMenuChatPress}>
                Percakapan
            </Button>
            {/* {(props.unreadChat>0)? 
            <Badge style={{position: "absolute", top: -5, right: -5, }}>{props.unreadChat}</Badge>
            : <View/>} */}
        </Tooltip>
      </View>
      <View style={{ marginHorizontal: 16, position: "relative" }}>
        <Tooltip
            isVisible={props.showTutorialHomeNotifSection}
            placement="bottom"
            showChildInTooltip={false}
            content={<Text>Klik disini melihat history notifikasi</Text>}
            onClose={() => props.homeScreenTutorial.end()}>
          <Button 
            mode={selectedMenu === "notification"? "contained": "outlined"} style={{ borderRadius: 50 }}
            onPress={handleMenuNotificationPress}>
            Notifikasi
          </Button>
          {/* {(props.unreadBot>0)? 
            <Badge style={{position: "absolute", top: -5, right: -5, }}>{props.unreadBot}</Badge>
            : <View/>} */}
        </Tooltip>
      </View>
    </View>
  )
}

ChatMenuSwitch.propTypes = { onPress: PropTypes.func }
ChatMenuSwitch.defaultProps = { onPress: () => {} }
export default withCurrentUser(ChatMenuSwitch)