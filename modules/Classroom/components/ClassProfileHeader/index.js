import React from "react";
import PropTypes from "prop-types";
import { View, Image, StyleSheet } from "react-native";
import { Text } from "react-native-paper";

function ClassProfileHeader(props){

  const styles = StyleSheet.create({
    profileDescriptionContainer: { flex:1 },
    profileContainer: { backgroundColor: "white", display: "flex", flexDirection: "row", alignItems:"center"}
  })

  return(
    <View style={[ styles.profileContainer,props.style ]}>
      <Image source={require('assets/logoclassroom.png')} style={{width: 70, height: 70, marginRight: 16}} />
      <View style={styles.profileDescriptionContainer}>
          <Text style={{ fontSize: 18, fontWeight: "500", marginBottom: 4}}>{props.title}</Text>
          {(props.subtitle)?<Text style={{ fontSize: 12, lineHeight: 20}}>{props.subtitle}</Text>:null}
      </View>
    </View>
  )
}

ClassProfileHeader.propTypes = { 
  title: PropTypes.string.isRequired,
  subtitle: PropTypes.string,
  style: PropTypes.object
}
ClassProfileHeader.defaultProps = { title: "", subtitle: "", style: {} }

export default ClassProfileHeader