import React from "react";
import PropTypes from "prop-types";
import { StyleSheet, TouchableOpacity } from "react-native";
import CircleAvatar from "src/components/Avatar/Circle";
import { View } from "react-native";
import { Appbar, Subheading, Caption } from "react-native-paper";
import PeopleAPI from "src/api/people";
import RoomsAPI from "src/api/rooms"

function ChatHeader(props){
  const { title, profilePicture, room, currentUser } = props;
  const [ audienceStatus, setAudienceStatus ] = React.useState("");
  const [ isInRoom, setInRoom ] = React.useState(false);
  const _isMounted = React.useRef(true);
  const audienceListener = React.useRef(null);
  const inRoomListener = React.useRef(null);

  const styles = StyleSheet.create({ default: { elevation: 4 }})

  const handleBackPress = () => props.navigation.goBack();

  const initUserInRoom = () => {
    inRoomListener.current = RoomsAPI.getInRoomWithRealTimeUpdate(room.id, userInRoomList => {
      const audiences = room.audiences.filter((audience) => audience !== currentUser.id);
   
      if(userInRoomList && userInRoomList.length>0 && userInRoomList.includes(audiences[0])){
        if( _isMounted.current) setInRoom(true)
      }else if( _isMounted.current) setInRoom(false)
    })
  };

  const initAudience = () => {
    const audiences = room.audiences.filter((audience) => audience !== currentUser.id);
    audienceListener.current = PeopleAPI.getDetailWithRealTimeUpdate(audiences[0], (audienceData)=>{
      const tempAudienceStatus = (audienceData && audienceData.lastOnline && audienceData.lastOnline.status)? audienceData.lastOnline.status: "offline";
      if(_isMounted.current) setAudienceStatus(tempAudienceStatus)
    })
  };  
  
  React.useEffect(() => {
    initAudience();
    initUserInRoom()

    return function cleanup(){
      _isMounted.current = false
      if(audienceListener.current) audienceListener.current();
      if(inRoomListener.current) inRoomListener.current();
    }
  }, []);

  return(
    <Appbar.Header theme={{ colors: {primary: "white"} }} style={[ styles.default, props.style ]}>
      {props.navigation?( <Appbar.BackAction onPress={handleBackPress}/> ): null}
      <TouchableOpacity onPress={props.onUserHeaderPress}>
        <View style={{ display: "flex", flexDirection: "row", alignItems: "center", flexGrow: 1 }}>
            <CircleAvatar size={40} uri={profilePicture} style={{ marginRight: 8 }}/>
            <View>
              <Subheading style={{ fontWeight: "bold", marginBottom: 0 }}>{title} </Subheading>
              <View style={{flexDirection:"row"}}>
                <Caption style={{ marginTop: 0 }}>{isInRoom? audienceStatus+" (live)" : audienceStatus}</Caption>
                <Caption style={{ marginTop:0, marginLeft: 4 }}>{(!props.isFriend)?"(Belum berteman denganmu)" : ""}</Caption>
              </View>
            </View>
        </View>
      </TouchableOpacity>
    </Appbar.Header>
  )
}

ChatHeader.propTypes = { 
  room: PropTypes.shape().isRequired,
  title: PropTypes.string,
  navigation: PropTypes.any, 
  style: PropTypes.object,
}
ChatHeader.defaultProps = { navigation: null, title: null, style: null }
export default ChatHeader