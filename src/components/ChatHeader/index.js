import React from "react";
import PropTypes from "prop-types";
import { StyleSheet, TouchableOpacity } from "react-native";

import CircleAvatar from "src/components/Avatar/Circle";
import { View } from "react-native";
import { Appbar, Subheading, Caption, Text } from "react-native-paper";

function ChatHeader(props){
  const { title, subtitle, profilePicture } = props;
  const styles = StyleSheet.create({ default: { elevation: 4 }})
  const handleBackPress = () => props.navigation.goBack();
  return(
    <Appbar.Header theme={{ colors: {primary: "white"} }} style={[ styles.default, props.style ]}>
      {props.navigation?( <Appbar.BackAction onPress={handleBackPress}/> ): null}
      <TouchableOpacity onPress={props.onUserHeaderPress}>
        <View style={{ display: "flex", flexDirection: "row", alignItems: "center", flexGrow: 1 }}>
            <CircleAvatar size={40} uri={profilePicture} style={{ marginRight: 8 }}/>
            <View>
              <Subheading style={{ fontWeight: "bold", marginBottom: 0 }}>{title} </Subheading>
              <View style={{flexDirection:"row"}}>
                <Caption style={{ marginTop: 0 }}>{subtitle}</Caption>
                <Caption style={{ marginTop:0, marginLeft: 4 }}>{(!props.isFriend)?"(Belum berteman denganmu)" : ""}</Caption>
              </View>
            </View>
        </View>
      </TouchableOpacity>
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