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
      <View style={{ flex:1,paddingRight:16, display: "flex", flexDirection: "column" }}>
        <Subheading numberOfLines={1}>{props.title}</Subheading>
        {(props.subtitle)? <Caption numberOfLines={1}>{props.subtitle}</Caption>: null}
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