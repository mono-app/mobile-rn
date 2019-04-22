import React from "react";
import { View, StyleSheet, TouchableOpacity } from "react-native";
import { Avatar, Text, Paragraph } from "react-native-paper";

import PeopleAPI from "../../api/people";

const INITIAL_STATE = { name: "", status: null }

/**
 * @param {string} name 
 * @param {string} status
 * @param {boolean} autoFetch - by default is `false`
 * @param {string} email - required when `autoFetch` is `true`
 */
export default class PeopleListItem extends React.Component{
  constructor(props){
    super(props);

    this.state = INITIAL_STATE;
  }

  componentDidMount(){
    const { email, autoFetch } = this.props;
    console.log(email, autoFetch);
    if(autoFetch && email){
      const api = new PeopleAPI();
      api.getDetail(email).then(people => {
        this.setState({ name: people.applicationInformation.nickName, status: null });
      })
    }
  }

  render(){    
    let { name, status } = this.props;
    if(this.props.autoFetch){
      name = this.state.name;
      status = this.state.status || "No Status"
    }

    return(
      <TouchableOpacity onPress={this.props.onPress}>
        <View style={styles.userContainer}>
          <Avatar.Text size={48} label="FH" style={{ marginRight: 16 }}/>
          <View>
            <Text style={{ fontWeight: "700" }}>{name}</Text>
            <Paragraph style={{ color: "#5E8864" }}>{status}</Paragraph>
          </View>
        </View>
      </TouchableOpacity>
    )
  }
}

PeopleListItem.defaultProps = {
  onPress: () => {}, name: "", status: "No Status",
  autoFetch: false, email: ""
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