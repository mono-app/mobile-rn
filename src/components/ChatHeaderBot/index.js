import React from "react";
import PropTypes from "prop-types";
import { StyleSheet, TouchableOpacity } from "react-native";
import CircleAvatar from "src/components/Avatar/Circle";
import { View } from "react-native";
import { Appbar, Subheading, Caption } from "react-native-paper";

function ChatHeaderBot(props){
  const { title, profilePicture, subtitle } = props;

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
              <Caption style={{ marginTop: 0 }}>{subtitle}</Caption>
            </View>
        </View>
      </TouchableOpacity>
    </Appbar.Header>
  )
}

ChatHeaderBot.propTypes = { 
  title: PropTypes.string,
  subtitle: PropTypes.string,
  navigation: PropTypes.any, 
  style: PropTypes.object,
}
ChatHeaderBot.defaultProps = { navigation: null, title: null, subtitle: "",style: null }
export default ChatHeaderBot