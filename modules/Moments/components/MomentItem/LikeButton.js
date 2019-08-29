import React from "react";
import PropTypes from "prop-types";
import MomentAPI from "modules/Moments/api/moment";
import { withCurrentUser } from "src/api/people/CurrentUser";

import { TouchableOpacity } from "react-native";
import { Text } from "react-native-paper"
import { default as MaterialCommunityIcons } from "react-native-vector-icons/MaterialCommunityIcons";

function LikeButton(props){
  const { moment, currentUser } = props;
  const totalFans = (moment.fanEmails)? moment.fanEmails.length: 0;

  const handleLikePress = () => MomentAPI.toggleLike(moment.id, currentUser.email);
  
  return(
    <TouchableOpacity style={[ props.style ]} onPress={handleLikePress}>
      <MaterialCommunityIcons name="thumb-up-outline" size={16} style={{ marginRight: 4 }}/>
      <Text>
        Suka {totalFans > 0?`(${totalFans})`: (totalFans > 100)? "(99+)": ""}
      </Text>
    </TouchableOpacity>
  )
}

LikeButton.propTypes = { style: PropTypes.any }
LikeButton.defaultProps = { style: {} }
export default withCurrentUser(LikeButton);