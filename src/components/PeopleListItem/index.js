import React from "react";
import PropTypes from "prop-types";
import Logger from "src/api/logger";
import StatusAPI from "src/api/status";

import CircleAvatar from "src/components/Avatar/Circle";
import { View, StyleSheet, TouchableOpacity } from "react-native";
import { Text, Paragraph } from "react-native-paper";

function PeopleListItem(props){
  const { people } = props;
  const [ status, setStatus ] = React.useState("");
  const styles = StyleSheet.create({
    userContainer: {
      height: 75, padding:16, borderBottomWidth:1,
      borderBottomColor: "#E8EEE8", flexDirection: "row", alignItems: "center",
    }
  })
  
  const handlePress = () => props.onPress(people);

  React.useEffect(() => {
    const fetchStatus = async () => {
      const status = await StatusAPI.getLatestStatus(people.email);
      if(status)
        setStatus(status.content);

    }
    if(props.distance===undefined){
      fetchStatus();
    }else{
      setStatus("jarak < "+props.distance+" meters");
    }
  }, [])

  Logger.log("PeopleListItem", people);
  let profilePicture = "https://picsum.photos/200/200/?random"
  if(people && people.profilePicture){
    profilePicture = people.profilePicture
  }

  return(
    <TouchableOpacity style={styles.userContainer} onPress={handlePress}>
      <CircleAvatar size={48} uri={profilePicture} style={{ marginRight: 16 }}/>
      <View>
        <Text style={{ fontWeight: "700" }}>{people.applicationInformation.nickName}</Text>
        <Paragraph style={{ color: "#5E8864" }}>{status}</Paragraph>
      </View>
    </TouchableOpacity>
  )
}
PeopleListItem.propTypes = { onPress: PropTypes.func.isRequired }
PeopleListItem.defaultProps = { onPress: () => {} }

export default PeopleListItem;