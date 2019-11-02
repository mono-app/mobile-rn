import React from "react";
import PropTypes from "prop-types";
import MomentAPI from "modules/Moments/api/moment";
import { withCurrentUser } from "src/api/people/CurrentUser";
import { withTranslation } from 'react-i18next';
import { TouchableOpacity } from "react-native";
import { Text } from "react-native-paper"
import { default as MaterialCommunityIcons } from "react-native-vector-icons/MaterialCommunityIcons";

function LikeButton(props){
  const { moment, currentUser } = props;
  const totalFans = (moment.totalFans)? moment.totalFans: 0;

  const handleLikePress = () => MomentAPI.toggleLike(moment.id, currentUser.id);
  
  return(
    <TouchableOpacity style={ props.style } onPress={handleLikePress}>
      <MaterialCommunityIcons name="thumb-up-outline" size={16} style={{ marginRight: 4, color:(props.textColor)?props.textColor:"#757575" }}/>
      <Text style={{color:(props.textColor)?props.textColor:"#000000"}}>
        {props.t("like")}  { totalFans > 0?
                (totalFans > 99)? "(99+)":
                `(${totalFans})`
                : ""
              }
      </Text>
    </TouchableOpacity>
  )
}

LikeButton.propTypes = { style: PropTypes.any }
LikeButton.defaultProps = { style: {} }
export default withTranslation()(withCurrentUser(LikeButton))