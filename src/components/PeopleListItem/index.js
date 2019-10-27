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

function PeopleListItem(props){
  const { id } = props;
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

  const fetchStatus = async () => {
    const status = await StatusAPI.getLatestStatus(id);
    if(status && _isMounted.current) {
      setStatus(status.content)
    }        
    if(_isMounted.current) setFetching(false)
  }

  const fetchData = async () => {
    PeopleAPI.getDetailWithRealTimeUpdate(id, (data)=>{
      if(_isMounted.current) {
        setPeople(data)
        setFetching(false)
      }
    });
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
      <TouchableOpacity  onPress={handlePress}>
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
PeopleListItem.propTypes = { onPress: PropTypes.func.isRequired }
PeopleListItem.defaultProps = { onPress: () => {} }

export default PeopleListItem;