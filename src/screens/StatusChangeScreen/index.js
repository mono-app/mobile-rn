import React from "react";
import moment from "moment";
import { NavigationEvents } from "react-navigation";
import { View, FlatList, StyleSheet } from "react-native";
import { Text, Caption } from "react-native-paper";

import PeopleAPI from "src/api/people";
import StatusAPI from "src/api/status";

import StatusInputCard from "src/screens/StatusChangeSCreen/StatusInputCard";
import { default as MaterialCommunityIcons } from "react-native-vector-icons/MaterialCommunityIcons";

const INITIAL_STATE = { status: [] }

export default class StatusChangeScreen extends React.Component{
  static navigationOptions = { headerTitle: "Status Change" };

  handleScreenWillBlur = () => { if(this.statusListener) this.statusListener(); }
  handleScreenWillFocus = () => {
    new PeopleAPI().getCurrentUserEmail().then(currentUserEmail => {
      this.listener = StatusAPI.getStatusWithRealTimeUpdate(currentUserEmail, status => {
        const newStatus = JSON.parse(JSON.stringify(status));
        const statusItems = [];

        let currentDateSection = moment("01/01/1990", "DD/MM/YYYY");
        newStatus.forEach(status => {
          if(status.timestamp !== null){
            const statusDate = moment(status.timestamp.seconds * 1000);
            if(!statusDate.isSame(currentDateSection, "date")){
              currentDateSection = moment(statusDate);
              statusItems.push({ timestamp: moment(currentDateSection), type: "dateSeparator" })
            }
            statusItems.push({ ...status, type: "item" })
          }else statusItems.push({ ...status, type: "itemPendingServer" });
        })
        this.setState({ status: statusItems });
      })
    })
  }

  constructor(props){
    super(props);

    this.state = INITIAL_STATE;
    this.statusListener = null;
    this.handleScreenWillBlur = this.handleScreenWillBlur.bind(this);
    this.handleScreenWillFocus = this.handleScreenWillFocus.bind(this);
  }

  render(){
    return(
      <View style={{ flex: 1 }}>
        <NavigationEvents onWillFocus={this.handleScreenWillFocus} onWillBlur={this.handleScreenWillBlur}/>

        <StatusInputCard/>

        <FlatList
          style={{ marginTop: 16 }}
          data={this.state.status}
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
}

const styles = StyleSheet.create({
  statusContainer: {
    borderBottomWidth: 1, borderBottomColor: "#E8EEE8", padding: 16, 
    justifyContent: "space-between", flexDirection: "row" 
  }
})