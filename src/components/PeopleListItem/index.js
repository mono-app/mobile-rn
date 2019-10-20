import React from "react";
import PropTypes from "prop-types";
import Logger from "src/api/logger";
import StatusAPI from "src/api/status";
import PeopleAPI from "src/api/people";
import OfflineDatabase from "src/api/database/offline";
import { StyleSheet } from "react-native";

import CircleAvatar from "src/components/Avatar/Circle";
import ContentLoader from 'rn-content-loader'
import { View, TouchableOpacity } from "react-native";
import { Text, Paragraph } from "react-native-paper";
import { Rect } from 'react-native-svg'

function PeopleListItem(props){
  const { email } = props;
  const [ status, setStatus ] = React.useState("");
  const [ people, setPeople ] = React.useState("");
  const [ isFetching, setFetching ] = React.useState(true);

  const _isMounted = React.useRef(true);
  const peopleListener = React.useRef(null);

  const styles = StyleSheet.create({
    userContainer: {
      height: 75, padding:16, borderBottomWidth:1,
      borderBottomColor: "#E8EEE8", flexDirection: "row", alignItems: "center",
    }
  })
  
  const handlePress = () => props.onPress(people);
  const getPeople = async () => {
    const people = await PeopleAPI.getDetail(email);
    setPeople(people);
  }

  const fetchData = async () => {
    setFetching(true);
    await getPeople();
    peopleListener.current = OfflineDatabase.addEventListener("change", "users", getPeople);
    setFetching(false);
  }

  React.useEffect(() => {
    fetchData();
    return function cleanup(){
      if(peopleListener.current) OfflineDatabase.removeEventListener(peopleListener.current);
    }
  }, [])

  React.useEffect(() => {
    setFetching(true)
    const fetchStatus = async () => {
      const status = await StatusAPI.getLatestStatus(email);
      if(status && _isMounted.current) {
        setStatus(status.content)
      }        
      if(_isMounted.current) setFetching(false)
    }

    if(props.distance===undefined){
      fetchStatus();
    }else{
      if(_isMounted.current) setStatus("jarak < "+props.distance+" meters");
    }
    return () => {
      if(_isMounted.current) _isMounted.current = false
    }
  }, [])

  Logger.log("PeopleListItem", people);
  let profilePicture = "https://picsum.photos/200/200/?random"
  let nickName = ""
  if(people){
    if(people.profilePicture) profilePicture = people.profilePicture
    if(people.applicationInformation&& people.applicationInformation.nickName) nickName = people.applicationInformation.nickName

  }

  if(isFetching){
    return (
      <ContentLoader height={50}>
        <Rect x={86} y={16} rx="4" ry="4" width={150} height={12}/>
      </ContentLoader>
    )
  }else{
    return(
      <TouchableOpacity style={styles.userContainer} onPress={handlePress}>
        <CircleAvatar size={48} uri={profilePicture} style={{ marginRight: 16 }}/>
        <View>
          <Text style={{ fontWeight: "700" }}>{nickName}</Text>
          <Paragraph style={{ color: "#5E8864" }}>{status}</Paragraph>
        </View>
      </TouchableOpacity>
    )
  }


}
PeopleListItem.propTypes = { onPress: PropTypes.func.isRequired }
PeopleListItem.defaultProps = { onPress: () => {} }

export default PeopleListItem;