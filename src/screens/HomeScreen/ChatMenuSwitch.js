import React from "react";
import PropTypes from "prop-types";

import { View } from "react-native";
import { Button } from "react-native-paper";

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
        <Button 
          mode={selectedMenu === "chat"? "contained": "outlined"} style={{ borderRadius: 50 }}
          onPress={handleMenuChatPress}>
            Percakapan
          </Button>
      </View>
      <View style={{ marginHorizontal: 16, position: "relative" }}>
        <Button 
          mode={selectedMenu === "notification"? "contained": "outlined"} style={{ borderRadius: 50 }}
          onPress={handleMenuNotificationPress}>
          Notifikasi
        </Button>
      </View>
    </View>
  )
}

ChatMenuSwitch.propTypes = { onPress: PropTypes.func }
ChatMenuSwitch.defaultProps = { onPress: () => {} }
export default ChatMenuSwitch;