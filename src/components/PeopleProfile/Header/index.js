import React from "react";
import PropTypes from "prop-types";

import CircleAvatar from "src/components/Avatar/Circle";
import { View, StyleSheet, TouchableOpacity } from "react-native";
import { Text } from "react-native-paper";
import Tooltip from 'react-native-walkthrough-tooltip';

/**
 * @param {string} nickName
 * @param {string} status
 */
export default function PeopleProfileHeader(props){
  const styles = StyleSheet.create({
    profileDescriptionContainer: { flex:1},
    profileContainer: { backgroundColor: "white", display: "flex", flexDirection: "row",}
  })

  return(
    <View style={[ styles.profileContainer,props.style ]}>
      <Tooltip
          isVisible={props.showTutorialSettingChangeProfilePic}
          placement="bottom"
          showChildInTooltip={true}
          content={<Text>Klik foto profile untuk mengganti foto</Text>}
          onClose={() => props.settingScreenTutorial.end()}>
        {props.onProfilePicturePress?(
          <TouchableOpacity onPress={props.onProfilePicturePress}>
            <CircleAvatar uri={props.profilePicture} style={{ marginRight: 16 }} isLoading={(props.isLoading)?true:false}/>
          </TouchableOpacity>
        ):<CircleAvatar uri={props.profilePicture} style={{ marginRight: 16 }} isLoading={(props.isLoading)?true:false}/>}
      </Tooltip>
      {props.onStatusPress?(
        <View style={styles.profileDescriptionContainer}>
          <TouchableOpacity onPress={props.onStatusPress}>
            <Text style={{ fontSize: 16, fontWeight: "500", marginBottom: 4}}>{props.title}</Text>
            <Text style={{ fontSize: 12, lineHeight: 20}}>{props.subtitle}</Text>
          </TouchableOpacity>
        </View>

      ):(
        <View style={styles.profileDescriptionContainer}>
          <Text style={{ fontSize: 16, fontWeight: "500", marginBottom: 4}}>{props.title}</Text>
          <Text style={{ fontSize: 12, lineHeight: 20}}>{props.subtitle}</Text>
        </View>
      )}

    </View>
  )
}

PeopleProfileHeader.propTypes = { 
  onProfilePicturePress: PropTypes.func,
  onStatusPress: PropTypes.func,
  profilePicture: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  subtitle: PropTypes.string,
  style: PropTypes.object
}
PeopleProfileHeader.defaultProps = { profilePicture: "", title: "", subtitle: "", style: {} }