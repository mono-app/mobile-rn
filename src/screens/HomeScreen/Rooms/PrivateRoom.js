import React from "react";
import PropTypes from "prop-types";
import moment from "moment";
import PeopleAPI from "src/api/people";
import { withCurrentUser } from "src/api/people/CurrentUser";
import { StyleSheet } from 'react-native';
import ClassAPI from "modules/Classroom/api/class";
import CircleAvatar from "src/components/Avatar/Circle";
import UnreadCountBadge from "src/screens/HomeScreen/UnreadCountBadge";
import { Text, Caption } from "react-native-paper";
import { View, TouchableOpacity } from 'react-native';

function PrivateRoom(props){
  const { currentUser, room } = props; 
  const _isMounted = React.useRef(true);
  const [ isLoading, setIsLoading ] = React.useState(true);
  const [ people, setPeople ] = React.useState(null);
  const [ class_, setClass ] = React.useState(null);

  const styles = StyleSheet.create({
    chatContainer: {
      display: "flex", flexDirection: "row", backgroundColor: "white", alignItems: "center",
      marginHorizontal: 16, paddingVertical: 16, borderBottomWidth: 1, borderBottomColor: "#E8EEE8"
    }
  })

  const handleRoomPress = () => props.onPress(room);

  React.useEffect(() => {
    if(_isMounted.current) setIsLoading(true);
    const fetchData = async () => {
      const { audiences, type, school } = props.room;
      const realAudience = audiences.filter((audience) => audience !== currentUser.email)[0];
      if(type==="group-chat"){
        const classData = await ClassAPI.getDetail(school.id,school.classId)
        if(_isMounted.current) setClass(classData)
      }else{
        const peopleData = await PeopleAPI.getDetail(realAudience);
        if(_isMounted.current) setPeople(peopleData);
      } 
      if(_isMounted.current) setIsLoading(false);
    }
    fetchData();
    return () => {
      _isMounted.current = false;
    };
  }, [])

  const sentTime = room.lastMessage.sentTime? new moment.unix(room.lastMessage.sentTime.seconds): null;
  let dateTimeString = null;
  if(sentTime){
    const isToday = new moment().diff(sentTime, "days") === 0;
    if(isToday) dateTimeString = sentTime.format("hh:mmA");
    else dateTimeString = sentTime.format("DD MMMM YYYY");
  }

  if(!isLoading){
    try{
      // check blocked User List and Hidden User List
      if(room.type==="chat"){
        if(room.audiences && room.audiences.length >0){
          for(let i=0;i<room.audiences.length;i++){
            if(props.blockedUsers && props.blockedUsers.includes(room.audiences[i])){
              return null
            }
            if(props.hiddenUsers && props.hiddenUsers.includes(room.audiences[i])){
              return null
            }
          }
        }
      }
      // ----------

      return(
        <TouchableOpacity style={[ styles.chatContainer, props.style ]} onPress={handleRoomPress}>
          <View style={{ marginRight: 16 }}>
              {(props.room.type==="group-chat")? 
                <CircleAvatar size={50} uri="https://picsum.photos/200/200/?random"/>
              : 
                <CircleAvatar size={50} uri={people.profilePicture}/>
              }
            </View>
          <View style={{ display: "flex", flexDirection: "column", width: 0, flexGrow: 1 }}>
            <View style={{ display: "flex", flexDirection: "row", justifyContent: "space-between" }}>
            {(props.room.type==="group-chat")? 
              <Text>{class_.room} | Semester {class_.semester} | {class_.subject}</Text>
              :
              <Text>{people.applicationInformation.nickName}</Text>
              }
              <Caption>{dateTimeString}</Caption>
            </View>
            <View style={{ display: "flex", flexDirection: "row" }}>
              <Caption style={{ width: 0, flexGrow: 1, marginRight: 16 }} numberOfLines={1}>
                {room.lastMessage.message}
              </Caption>
              <UnreadCountBadge roomId={room.id}/>
            </View>
          </View>
        </TouchableOpacity>
      )

    }catch{
      return null
    }
  }else{
    return null
  }
}

PrivateRoom.propTypes = { 
  room: PropTypes.shape({
    lastMessage: PropTypes.shape().isRequired,
    id: PropTypes.string.isRequired
  }).isRequired,
  onPress: PropTypes.func, 
  style: PropTypes.shape()
}
PrivateRoom.defaultProps = { onPress: () => {}, style: {} }
export default withCurrentUser(PrivateRoom)