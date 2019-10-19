import React from "react";
import moment from "moment";
import StatusAPI from "src/api/status";
import { useCurrentUser } from "src/api/people/CurrentUser";
import { StyleSheet } from "react-native";
import uuid from "uuid/v4"
import StatusInputCard from "src/screens/StatusChangeScreen/StatusInputCard";
import AppHeader from "src/components/AppHeader";
import { View, FlatList } from "react-native";
import { Text, Caption } from "react-native-paper";
import { default as MaterialCommunityIcons } from "react-native-vector-icons/MaterialCommunityIcons";

function StatusChangeScreen(props){
  const [ status, setStatus ] = React.useState([]);
  const { currentUser } = useCurrentUser();
  const statusListener = React.useRef(null);
  const styles = StyleSheet.create({
    statusContainer: {
      borderBottomWidth: 1, borderBottomColor: "#E8EEE8", padding: 16, 
      justifyContent: "space-between", flexDirection: "row" 
    }
  })

  React.useEffect(() => {
    statusListener.current = StatusAPI.getStatusWithRealTimeUpdate(currentUser.email, (status) => {
      const newStatus = JSON.parse(JSON.stringify(status));
      const statusItems = [];
      let currentDateSection = moment("01/01/1990", "DD/MM/YYYY");
      newStatus.forEach((status) => {
        if(status.timestamp !== null){
          const statusDate = moment(status.timestamp.seconds * 1000);
          if(!statusDate.isSame(currentDateSection, "date")){
            currentDateSection = moment(statusDate);
            statusItems.push({id: uuid(), timestamp: moment(currentDateSection), type: "dateSeparator" })
          }
          statusItems.push({...status, type: "item" })
        }else statusItems.push({...status, type: "itemPendingServer" });
      })
      setStatus(statusItems);
    })

    return function cleanup(){
      if(statusListener.current) statusListener.current();
    }
  }, [])

  return(
    <View style={{ flex: 1 }}>
      <AppHeader navigation={props.navigation} style={{ backgroundColor: "transparent" }}/>
      <StatusInputCard/>
      <FlatList
        style={{ marginTop: 16 }} 
        data={status}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => {
          if(item.type === "dateSeparator"){
            return (
              <View style={{ ...styles.statusContainer, justifyContent: "center" }}>
                <Text style={{ color: "#5E8864" }}>{item.timestamp.format("DD MMMM YYYY")}</Text>
              </View>
            )
          }else if(item.type === "item") {
            return(
              <View style={styles.statusContainer}>
                <Text style={{ marginRight: 16, flex: 1, flexWrap: "wrap" }}>{item.content}</Text>
                <Caption>{moment(item.timestamp.seconds * 1000).format("HH:mm A")}</Caption>
              </View>
            )
          }else if(item.type === "itemPendingServer"){
            return(
              <View style={styles.statusContainer}>
                <Text style={{ marginRight: 16, flex: 1, flexWrap: "wrap" }}>{item.content}</Text>
                <MaterialCommunityIcons name="progress-clock" size={24} style={{ color: "#5E8864" }}/>
              </View>
            )
          }
        }}/>
    </View>
  )
}
StatusChangeScreen.navigationOptions = { header: null };
export default StatusChangeScreen;