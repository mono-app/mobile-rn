import React from "react";
import PropTypes from "prop-types";
import { StyleSheet } from "react-native";

import { Appbar } from "react-native-paper";

function AppHeader(props){
  const styles = StyleSheet.create({ default: {} })
  const handleBackPress = () => props.navigation.goBack();
  return(
    <Appbar.Header theme={{ colors: {primary: "white"} }} style={[ styles.default, props.style ]}>
      {props.navigation?(
        <Appbar.BackAction onPress={handleBackPress}/>
      ): null}
      <Appbar.Content title={props.title} subtitle={props.subtitle}/>
    </Appbar.Header>
  )
}

AppHeader.propTypes = { 
  title: PropTypes.string,
  navigation: PropTypes.any, 
  style: PropTypes.object,
  subtitle: PropTypes.string
}
AppHeader.defaultProps = { navigation: null, title: null, style: null, subtitle: null }
export default AppHeader;