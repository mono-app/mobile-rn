import React from "react";
import PropTypes from "prop-types";
import PeopleAPI from "src/api/people";
import moment from "moment";
import Logger from "src/api/logger";
import { StyleSheet } from "react-native";

import { View } from "react-native";
import { Text, Avatar, Caption } from "react-native-paper";

function CommentItem(props){
  const { people, comment } = props;
  const [ sender, setSender ] = React.useState({ applicationInformation: {nickName: ""}, profilePicture: "" });
  const timeFromNow = (comment.timestamp)? new moment.unix(comment.timestamp.seconds).fromNow(): null;

  const styles = StyleSheet.create({
    container: { flex: 1, flexDirection: "row", padding: 16, paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: "#E8EEE8", backgroundColor:"#fff" }, 
    content: { paddingHorizontal: 8, flex: 1, marginTop: 4 }
  })

  const fetchPeople = async () => {
    const sender = await PeopleAPI.getDetail(comment.peopleId);
    setSender(sender);
  }

  React.useEffect(() => {
    Logger.log("CommentItem#people", comment);
    fetchPeople();
  }, [comment])

  return(
    <View style={styles.container}>
      <Avatar.Image size={50} source={{ uri: sender.profilePicture, cache: "force-cache" }}/>
      <View style={styles.content}>
        <Text style={{ fontWeight: "700" }}>{sender.applicationInformation.nickName}</Text>
        <Text>{comment.comment}</Text>
      </View>
      <Caption>{timeFromNow}</Caption>
    </View>
  )
}

CommentItem.propTypes = {
  people: PropTypes.shape().isRequired,
  comment: PropTypes.shape().isRequired
}
export default CommentItem;