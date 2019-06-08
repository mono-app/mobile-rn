import React from "react";
import ContentLoader from 'rn-content-loader'
import {Circle, Rect} from 'react-native-svg'
import { View, StyleSheet, TouchableOpacity } from "react-native";
import { Text, Paragraph } from "react-native-paper";

import PeopleAPI from "src/api/people";
import CircleAvatar from "src/components/Avatar/Circle";

const INITIAL_STATE = { name: "", status: null, profilePicture: "", isFetching: false }

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
    if(autoFetch && email){
      this.setState({ isFetching: true });
      const api = new PeopleAPI();
      const promises = [ api.getDetail(email), api.getLatestStatus(email) ];
      Promise.all(promises).then(results => {
        const people = results[0];
        const status = results[1]? results[1].content: "";
        const { nickName, profilePicture } = people.applicationInformation  
        this.setState({ isFetching: false, name: nickName, profilePicture, status });
      })
    }
  }

  render(){
    if(this.state.isFetching){
      return (
        <ContentLoader style={styles.userContainer}>
          <Circle cx={46} cy={46} r={28}/>
          <Rect x={86} y={24} rx="4" ry="4" width={150} height={12}/>
          <Rect x={86} y={42} rx="4" ry="4" width={100} height={10}/>
        </ContentLoader>
      )
    }

    let { name, status, profilePicture } = this.props;
    if(this.props.autoFetch){
      name = this.state.name;
      status = this.state.status || "No Status"
      profilePicture = this.state.profilePicture
    }

    return(
      <TouchableOpacity style={styles.userContainer} onPress={this.props.onPress}>
        <CircleAvatar size={48} uri={profilePicture} style={{ marginRight: 16 }}/>
        <View>
          <Text style={{ fontWeight: "700" }}>{name}</Text>
          <Paragraph style={{ color: "#5E8864" }}>{status}</Paragraph>
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
    height: 75,
    padding:16,
    borderBottomWidth:1,
    borderBottomColor: "#E8EEE8",
    flexDirection: "row",
    alignItems: "center",
  }
})