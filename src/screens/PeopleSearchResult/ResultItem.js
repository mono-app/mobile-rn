import React from "react";
import StatusAPI from "src/api/status";
import { StyleSheet } from "react-native";

import CircleAvatar from "src/components/Avatar/Circle";
import { View, TouchableOpacity } from "react-native";
import { Text, Paragraph } from "react-native-paper";

function ResultItem(props){
  const [ status, setStatus ] = React.useState("");
  const styles = StyleSheet.create({
    userContainer: {
      padding:16, borderBottomWidth:1, borderBottomColor: "#E8EEE8",
      flexDirection: "row", alignItems: "center",
    }
  })

  const handlePress = () => props.onPress(props.peopleId);

  React.useEffect(() => {
    const fetchStatus = async () => {
      const latestStatus = await StatusAPI.getLatestStatus(props.peopleId);
      setStatus(latestStatus.content);
    }
    fetchStatus();
  }, [status])


  return(
    <TouchableOpacity onPress={handlePress}>
      <View style={styles.userContainer}>
        <CircleAvatar size={48} uri={props.profilePicture} style={{ marginRight: 16 }}/>
        <View>
          <Text style={{ fontWeight: "700" }}>{props.name}</Text>
          <Paragraph style={{ color: "#5E8864" }}>{status}</Paragraph>
        </View>
      </View>
    </TouchableOpacity>
  )
}

export default ResultItem;