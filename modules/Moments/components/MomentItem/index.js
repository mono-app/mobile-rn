import React from "react";
import PropTypes from "prop-types";
import PeopleAPI from "src/api/people";
import MomentAPI from "modules/Moments/api/moment";
import Logger from "src/api/logger";
import { StyleSheet } from "react-native";
import { withCurrentUser } from "src/api/people/CurrentUser";
import { default as momentDate } from "moment"
import { withTranslation } from 'react-i18next';
import SquareAvatar from "src/components/Avatar/Square";
import LikeButton from "modules/Moments/components/MomentItem/LikeButton";
import VerticalMenu from "modules/Moments/components/MomentItem/VerticalMenu";
import ImageList from "modules/Moments/components/MomentItem/ImageList";
import { View, TouchableOpacity } from "react-native";
import { Text, Surface, Caption } from "react-native-paper";
import { default as MaterialCommunityIcons } from "react-native-vector-icons/MaterialCommunityIcons";

function MomentItem(props){
  const { currentUser, canComment, canLike, canShare } = props;

  const [ moment, setMoment ] = React.useState(props.moment);
  const [ createdDate, setCreatedDate ] = React.useState("-");
  const [ people, setPeople ] = React.useState(null);
  
  const momentListener = React.useRef(null);
  const _isMounted = React.useRef(true);

  const styles = StyleSheet.create({
    surface: { elevation: 16, padding: 16, display: "flex", flexDirection: "column", borderRadius: 4 },
    profile: { display: "flex", flexDirection: "row", alignItems: "center", marginBottom: 8 },
    textContainer: { borderBottomColor: "#E8EEE8", borderBottomWidth: 1, paddingBottom: 8 }, 
    actionContainer: { display: "flex", flexDirection: "row", justifyContent: "space-around", alignItems: "center", paddingTop: 8 },
    actionItem: { display: "flex", flexDirection: "row", alignItems: "center", padding: 4 },
  });
  
  const handleDeleteMomentPress = () => props.onDeleteMomentPress(moment);
  const handleCommentPress = () => props.onCommentPress(moment);
  const handleSharePress = () => props.onSharePress(moment);
  const handleProfilePress = () => props.onProfilePress(people)
  
  const fetchPeople = () => {
    PeopleAPI.getDetail(moment.posterEmail).then(peopleData=>{
      if(_isMounted.current) setPeople(peopleData);
    })
  }

  const fetchMoment = () => {
    momentListener.current = MomentAPI.getDetailWithRealTimeUpdate(moment.id, currentUser.email, (newMoment) => {
      if(newMoment && newMoment.postTime){
       const creationDate = momentDate(newMoment.postTime.seconds * 1000).format("DD MMMM YYYY")
       const creationTime = momentDate(newMoment.postTime.seconds * 1000).format("HH:mm")
       if(_isMounted.current) setCreatedDate(creationDate+" | Jam "+ creationTime + " WIB");
      }
      if(_isMounted.current) setMoment(newMoment);
    })
  }

  React.useEffect(() => {
    fetchPeople();
    fetchMoment();
    return function cleanup(){
      _isMounted.current = false;
      Logger.log("MomentItem.cleanup", `cleanup: ${moment.content.message}`);
      if(momentListener.current) momentListener.current();
    }
  }, [])

  
  let totalComments = ""
  if(moment && moment.totalComments){
    if(moment.totalComments >= 99) totalComments = "99+"
    else totalComments = moment.totalComments
  }

  Logger.log("MomentItem", "re-render");
  if(people === null || !moment || !moment.content) return null;
  return (
    <Surface style={[ styles.surface, props.style ]}>
      <View style={{ justifyContent: "space-between", flexDirection:"row" }}>
        <TouchableOpacity onPress={handleProfilePress}>
          <View style={styles.profile}>
            <SquareAvatar size={50} uri={people.profilePicture}/>
            <View style={{ marginLeft: 8 }}>
              <Text style={{ margin: 0, fontWeight: "bold" }}>{people.applicationInformation.nickName}</Text>
              <Caption style={{ margin: 0 }}>{createdDate}</Caption>
            </View>
          </View>
        </TouchableOpacity>
        {(people.email === currentUser.email)? <VerticalMenu onDeleteMomentPress={handleDeleteMomentPress}/>:null}
      </View>
      <View style={styles.textContainer}>
        <Text style={{ textAlign: "justify", lineHeight: 20 }}>{moment.content.message}</Text>
        <ImageList images={moment.content.images}/>
      </View>
      <View style={styles.actionContainer}>
        {canLike?<LikeButton style={[ styles.actionItem ]} moment={moment} textColor={(moment.isLiked)? "#0ead69" : ""}/>:null}
        {canComment?(
          <TouchableOpacity style={styles.actionItem} onPress={handleCommentPress}>
            <MaterialCommunityIcons name="comment-outline" size={16} style={{ marginRight: 4, color:(moment.isCommented)? "#0ead69" : "#000000" }}/>
            <Text style={{ color:(moment.isCommented)? "#0ead69" : "#000000" }}>{totalComments?`(${totalComments})`: ""} {props.t("comments")}</Text>
          </TouchableOpacity>
        ): null}
        {canShare?(
          <TouchableOpacity style={styles.actionItem} onPress={handleSharePress}>
            <MaterialCommunityIcons name="share-variant" size={16} style={{ marginRight: 4 }}/>
            <Text>{props.t("share")}</Text>
          </TouchableOpacity>
        ):null}
      </View>
    </Surface>
  );
}
MomentItem.propTypes = {
  onDeleteMomentPress: PropTypes.func,
  onCommentPress: PropTypes.func,
  onSharePress: PropTypes.func,
  canLike: PropTypes.bool,
  canShare: PropTypes.bool,
  canComment: PropTypes.bool,
  style: PropTypes.any
}
MomentItem.defaultProps = { 
  style: {}, canLike: true, canComment: true, canShare: true,
  onDeleteMomentPress: () => {},
  onCommentPress: () => {},
  onSharePress: () => {}
};
export default withTranslation()(withCurrentUser(MomentItem))