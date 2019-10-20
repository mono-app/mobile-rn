import React from "react";
import PropTypes from "prop-types";
import { StyleSheet } from "react-native";

import { View } from "react-native";
import { Appbar, Subheading, Caption } from "react-native-paper";

function AppHeader(props){
  const styles = StyleSheet.create({ default: { elevation: 0 } })

  const handleBackPress = () => {
    if(props.overrideBack === null) props.navigation.goBack();
    else props.overrideBack();
  }

  return(
    <Appbar.Header theme={{ colors: {primary: "white"} }} style={[ styles.default, props.style ]}>
      {props.navigation?(
        <Appbar.BackAction onPress={handleBackPress}/>
      ): null}
      <View style={{ display: "flex", flexDirection: "row", alignItems: "center", flexGrow: 1 }}>
        <Subheading>{props.title}</Subheading>
        <Caption>{props.caption}</Caption>
      </View>
    </Appbar.Header>
  )
}

AppHeader.propTypes = { 
  title: PropTypes.string,
  navigation: PropTypes.any, 
  style: PropTypes.object,
  subtitle: PropTypes.string,
  overrideBack: PropTypes.func
}
AppHeader.defaultProps = { 
  navigation: null, title: null, style: null, subtitle: null,
  overrideBack: null
}
export default AppHeader;