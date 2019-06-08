import React from "react";
import { View, StyleSheet, TouchableOpacity } from "react-native";
import { Text, Paragraph } from "react-native-paper";

import PeopleAPI from "src/api/people";
import CircleAvatar from "src/components/Avatar/Circle";

const INITIAL_STATE = { status: "No Status" }

export default class ResultItem extends React.Component{
  loadStatus = () => {
    new PeopleAPI().getLatestStatus(this.props.peopleEmail).then(status => {
      if(status) this.setState({ status: status.content });
    })
  }

  constructor(props){
    super(props);

    this.state = INITIAL_STATE;
    this.loadStatus = this.loadStatus.bind(this);
  }

  componentDidMount(){ this.loadStatus(); }

  render(){
    return(
      <TouchableOpacity onPress={this.props.onPress}>
        <View style={styles.userContainer}>
          <CircleAvatar size={48} uri={this.props.profilePicture} style={{ marginRight: 16 }}/>
          <View>
            <Text style={{ fontWeight: "700" }}>{this.props.name}</Text>
            <Paragraph style={{ color: "#5E8864" }}>{this.state.status}</Paragraph>
          </View>
        </View>
      </TouchableOpacity>
    )
  }
}

const styles = StyleSheet.create({
  userContainer: {
    padding:16,
    borderBottomWidth:1,
    borderBottomColor: "#E8EEE8",
    flexDirection: "row",
    alignItems: "center",
  }
})