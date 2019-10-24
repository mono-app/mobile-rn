import React from "react";
import PropTypes from "prop-types";

import CircleAvatar from "src/components/Avatar/Circle";
import { View, StyleSheet, TouchableOpacity } from "react-native";
import { Text } from "react-native-paper";
import Tooltip from 'react-native-walkthrough-tooltip';
import { withTranslation } from 'react-i18next';

/**
 * @param {string} nickName
 * @param {string} status
 */
function ProfileHeader(props){
  const { showTutorialChangeProfilePic, isLoading, profilePicture, onStatusPress } = props;

  const styles = StyleSheet.create({
    profileDescriptionContainer: { flex:1},
    profileContainer: { backgroundColor: "white", display: "flex", flexDirection: "row", alignItems:"center"}
  })

  return(
    <View style={[ styles.profileContainer,props.style ]}>
      <Tooltip
          isVisible={showTutorialChangeProfilePic}
          placement="bottom"
          showChildInTooltip={true}
          content={<Text>{props.t("tutorialChangeProfile")}</Text>}
          onClose={() => props.tutorial.close()}>
        {props.onProfilePicturePress?(
          <TouchableOpacity onPress={props.onProfilePicturePress}>
            <CircleAvatar uri={profilePicture} size={70} style={{ marginRight: 16 }} isLoading={isLoading}/>
          </TouchableOpacity>
        ):<CircleAvatar uri={profilePicture} size={70} style={{ marginRight: 16 }} isLoading={isLoading}/>}
      </Tooltip>
      <View style={styles.profileDescriptionContainer}>
        <TouchableOpacity onPress={onStatusPress} disabled={!onStatusPress}>
          <Text style={{ fontSize: 18, fontWeight: "500", marginBottom: 4}}>{props.title}</Text>
          {(props.subtitle)?<Text style={{ fontSize: 14, lineHeight: 20}}>{props.subtitle}</Text>:null}
        </TouchableOpacity>
      </View>
    
    </View>
  )
}

ProfileHeader.propTypes = { 
  onProfilePicturePress: PropTypes.func,
  onStatusPress: PropTypes.func,
  profilePicture: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  subtitle: PropTypes.string,
  style: PropTypes.object
}
ProfileHeader.defaultProps = { profilePicture: "", title: "", subtitle: "", style: {}, tutorial: {},  }

export default withTranslation()(ProfileHeader)