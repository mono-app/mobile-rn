import React from "react";
import PropTypes from "prop-types";
import Logger from "src/api/logger";
import StatusAPI from "src/api/status";
import PeopleAPI from "src/api/people"
import CircleAvatar from "src/components/Avatar/Circle";
import { View, StyleSheet, TouchableOpacity } from "react-native";
import { Text, Paragraph, Caption } from "react-native-paper";
import ContentLoader from 'rn-content-loader'
import {Rect} from 'react-native-svg'
import HelperAPI from "src/api/helper";

function PeopleListItem(props){
  const { id, user } = props;
  const [ status, setStatus ] = React.useState("");
  const [ people, setPeople ] = React.useState("");
  const [ isFetching, setFetching ] = React.useState(true);
  const _isMounted = React.useRef(true);

  const styles = StyleSheet.create({
    userContainer: {
      height: 75, padding:16, borderBottomWidth:1,
      borderBottomColor: "#E8EEE8", flexDirection: "row", alignItems: "center",
    }
  })
  
  const handlePress = () => props.onPress(people);
  const handleLongPress = () => props.onLongPress(people);

  const fetchStatus = async () => {
    const status = await StatusAPI.getLatestStatus(id);
    if(status && _isMounted.current) setStatus(status.content)
    if(_isMounted.current) setFetching(false)
  }

  const fetchData = async () => {
    if(user && user.applicationInformation && user.applicationInformation.nickName){       
      if(_isMounted.current) setPeople(user)
    }else{
      const data = await PeopleAPI.getDetail(id)
      if(_isMounted.current) setPeople(data)
    }
    if(_isMounted.current) setFetching(false)
  }

  React.useEffect(() => {
    setFetching(true)
    if(props.distance===undefined) fetchStatus();
    else if(_isMounted.current) setStatus("jarak < "+props.distance+" meters");
    fetchData();
    return () => {
      if(_isMounted.current) _isMounted.current = false
    }
  }, [])

  Logger.log("PeopleListItem", people);
  let profilePicture = HelperAPI.getDefaultProfilePic()
  let nickName = ""
  if(people && people.applicationInformation){
    if(people.applicationInformation.profilePicture && people.applicationInformation.profilePicture.downloadUrl) 
      profilePicture = people.applicationInformation.profilePicture.downloadUrl
    if(people.applicationInformation.nickName) nickName = people.applicationInformation.nickName
  }

  if(isFetching){
    return (
      <ContentLoader height={50}>
        <Rect x={86} y={16} rx="4" ry="4" width={150} height={12}/>
      </ContentLoader>
    )
  }else{
    return(
      <TouchableOpacity onPress={handlePress} disabled={!props.onPress} onLongPress={handleLongPress}>
        <View style={styles.userContainer}>
          <CircleAvatar size={48} uri={profilePicture} style={{ marginRight: 16 }}/>
          <View style={{flex:1}}>
            <Text style={{ fontWeight: "700" }} numberOfLines={1}>{nickName}</Text>
            <Paragraph style={{ color: "#5E8864" }} numberOfLines={1}>{status}</Paragraph>
          </View>
        </View>
      </TouchableOpacity>
    )
  }

}
PeopleListItem.propTypes = { }
PeopleListItem.defaultProps = { onLongPress: ()=>{} }

export default PeopleListItem;