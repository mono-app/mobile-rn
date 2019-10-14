import React from "react";
import PropTypes from "prop-types";
import Tooltip from 'react-native-walkthrough-tooltip';
import { View } from "react-native";
import { Button, Text } from "react-native-paper";
import UnreadCountBadge from "src/screens/HomeScreen/UnreadCountBadge";

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
          content={<Text>Klik disini melihat history chat</Text>}
          onClose={() => props.homeScreenTutorial.show(3)}>
            <Button 
              mode={selectedMenu === "chat"? "contained": "outlined"} style={{ borderRadius: 50 }}
              onPress={handleMenuChatPress}>
                Percakapan
            </Button>
            <UnreadCountBadge style={{position: "absolute", top: -5, right: -5, }} count={0}/>
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
          <UnreadCountBadge style={{position: "absolute", top: -5, right: -5, }} count={0}/>
        </Tooltip>
      </View>
    </View>
  )
}

ChatMenuSwitch.propTypes = { onPress: PropTypes.func }
ChatMenuSwitch.defaultProps = { onPress: () => {} }
export default ChatMenuSwitch;