import React from "react";
import withObservables from "@nozbe/with-observables";
import Logger from "src/api/logger";
import { StyleSheet } from "react-native";

import CircleAvatar from "src/components/Avatar/Circle";
import { TouchableOpacity, View } from "react-native";
import { Text, Paragraph } from "react-native-paper";

function EnhancedPeopleListItem(props){
  Logger.log("EnhancedPeopleListItem#props", props);
  
  const { applicationInformation, profilePicture } = props;
  const profilePictureUrl = (!profilePicture)? "https://picsum.photos/200": profilePicture.downloadUrl

  const styles = StyleSheet.create({
    userContainer: {
      height: 75, padding:16, borderBottomWidth:1,
      borderBottomColor: "#E8EEE8", flexDirection: "row", alignItems: "center",
    }
  });  

  return (
    <TouchableOpacity>
      <View style={styles.userContainer}>
        <CircleAvatar size={48} uri={profilePictureUrl} style={{ marginRight: 16 }}/>
        <View style={{flex:1}}>
          <Text style={{ fontWeight: "700" }} numberOfLines={1}>{applicationInformation.nickName}</Text>
          <Paragraph style={{ color: "#5E8864" }} numberOfLines={1}></Paragraph>
        </View>
      </View>
    </TouchableOpacity>
  )
}

const enhance = withObservables([ "people" ], ({ people }) => ({
  applicationInformation: people.applicationInformation.observe(),
  profilePicture: people.profilePicture.observe()
}))

export default enhance(EnhancedPeopleListItem);