import React from "react";
import { StyleSheet } from "react-native";
import { withNavigation } from "react-navigation";

import CircleAvatar from "src/components/Avatar/Circle";
import { View, TouchableOpacity, FlatList } from "react-native";
import { Caption, Text } from "react-native-paper";

function NotificationSection(props){
  const styles = StyleSheet.create({
    chatContainer: {
      display: "flex", flexDirection: "row", backgroundColor: "white", alignItems: "center",
      margin: 16, paddingVertical: 16, borderBottomWidth: 1, borderBottomColor: "#E8EEE8"
    }
  });

  const handleRoomPress = () => props.navigation.navigate("NotificationBot");

  return (
    <FlatList 
      data={[1, 2, 3]}
      renderItem={({ item ,index}) => {
        return (
          <TouchableOpacity style={styles.chatContainer} onPress={handleRoomPress}>
            <View style={{ marginRight: 16 }}>
              <CircleAvatar size={50} uri={"https://picsum.photos/200"}/>
            </View>
            <View style={{ display: "flex", flexDirection: "column", width: 0, flexGrow: 1 }}>
              <View style={{ display: "flex", flexDirection: "row", justifyContent: "space-between" }}>
                <Text>Permintaan Pertemanan</Text>
                <Caption>10:15 PM</Caption>
              </View>
              <View style={{ display: "flex", flexDirection: "row" }}>
                <Caption style={{ width: 0, flexGrow: 1, marginRight: 16 }} numberOfLines={2} style={{ minHeight: 24 }}>
                  Frans mengirimkan perminataan pertemanan dari Kontak Telpon
                </Caption>
              </View>
            </View>
          </TouchableOpacity>
        )
      }}/>
  );
}
export default withNavigation(NotificationSection);