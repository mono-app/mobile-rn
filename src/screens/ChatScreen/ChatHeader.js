import React from "react";
import PropTypes from "prop-types";
import { StyleSheet } from "react-native";

import CircleAvatar from "src/components/Avatar/Circle";
import { View } from "react-native";
import { Appbar, Subheading, Caption } from "react-native-paper";

function ChatHeader(props){
  const { title, subtitle, profilePicture } = props;
  const styles = StyleSheet.create({ default: { elevation: 16 }})
  const handleBackPress = () => props.navigation.goBack();
  return(
    <Appbar.Header theme={{ colors: {primary: "white"} }} style={[ styles.default, props.style ]}>
      {props.navigation?(
        <Appbar.BackAction onPress={handleBackPress}/>
      ): null}
      <View style={{ display: "flex", flexDirection: "row", alignItems: "center", flexGrow: 1 }}>
        <CircleAvatar size={40} uri={profilePicture} style={{ marginRight: 8 }}/>
        <View>
          <Subheading style={{ fontWeight: "bold", marginBottom: 0 }}>{title}</Subheading>
          <Caption style={{ marginTop: 0 }}>{subtitle}</Caption>
        </View>
      </View>
    </Appbar.Header>
  )
}

ChatHeader.propTypes = { 
  title: PropTypes.string,
  navigation: PropTypes.any, 
  style: PropTypes.object,
  subtitle: PropTypes.string
}
ChatHeader.defaultProps = { navigation: null, title: null, style: null, subtitle: null }
export default ChatHeader;