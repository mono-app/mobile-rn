import React from "react";
import PropTypes from "prop-types";
import Logger from "src/api/logger";
import withObservables from "@nozbe/with-observables";
import { StyleSheet } from "react-native";

import Tooltip from 'react-native-walkthrough-tooltip';
import CircleAvatar from "src/components/Avatar/Circle";
import { View, TouchableOpacity } from "react-native";
import { Text } from "react-native-paper";

function PeopleProfileHeader(props){
  Logger.log("PeopleProfileHeader#props", props);
  const { showTutorialSettingChangeProfilePic, isLoading, people, applicationInformation, profilePicture } = props;
  const profilePictureUrl = (!profilePicture)?"https://picsum.photos/200": profilePicture.downloadUrl;

  const [ status, setStatus ] = React.useState("");
  
  const styles = StyleSheet.create({
    profileDescriptionContainer: { flex:1 },
    profileContainer: { backgroundColor: "white", display: "flex", flexDirection: "row",}
  });

  const handleProfilePicturePress = () => {
    if(props.onProfilePicturePress) props.onProfilePicturePress();
  }

  const handleStatusPress = () => { 
    if(props.onStatusPress) props.onStatusPress();
  }

  const handleTutorialClose = () => {
    if(props.settingScreenTutorial) props.settingScreenTutorial.end()
  }

  const fetchStatus = async () => {
    const status = await people.getLatestStatus();
    Logger.log("PeopleProfileHeader.fetchStatus#status", status);
    if(status) setStatus(status);
  }

  React.useEffect(() => {
    fetchStatus();
  })

  return(
    <View style={[ styles.profileContainer, props.style ]}>
      <Tooltip
        isVisible={showTutorialSettingChangeProfilePic} placement="bottom"
        showChildInTooltip={true} onClose={handleTutorialClose}
        content={<Text>Klik foto profile untuk mengganti foto</Text>}>
        <TouchableOpacity onPress={handleProfilePicturePress}>
          <CircleAvatar size={70} uri={profilePictureUrl} style={{ marginRight: 16 }} isLoading={isLoading}/>
        </TouchableOpacity>
      </Tooltip>
      <View style={styles.profileDescriptionContainer}>
        <TouchableOpacity onPress={handleStatusPress}>
          <Text style={{ fontSize: 16, fontWeight: "500", marginBottom: 4}}>{applicationInformation.nickName}</Text>
          <Text style={{ fontSize: 12, lineHeight: 20}}>{status}</Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}

PeopleProfileHeader.propTypes = { 
  settingScreenTutorial: PropTypes.any,
  onProfilePicturePress: PropTypes.func,
  onStatusPress: PropTypes.func,
  style: PropTypes.object,
  people: PropTypes.any.isRequired
}
PeopleProfileHeader.defaultProps = { profilePicture: "", title: "", subtitle: "", style: {} }

const enhance = withObservables([ "people" ], ({ people }) => ({
  applicationInformation: people.applicationInformation.observe(),
  profilePicture: people.profilePicture.observe(),
  statuses: people.statuses.observeWithColumns([ "created_at" ])
}))

export default enhance(PeopleProfileHeader);