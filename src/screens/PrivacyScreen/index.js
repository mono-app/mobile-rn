import React from "react";

import { withCurrentUser } from "src/api/people/CurrentUser";
import HeadlineTitle from "src/components/HeadlineTitle";
import AppHeader from "src/components/AppHeader";
import { View, StyleSheet, TouchableOpacity } from "react-native";
import { Text } from "react-native-paper";
import { default as EvilIcons } from "react-native-vector-icons/EvilIcons";


function PrivacyScreen(props){
  const { currentUser } = props;
  const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: "#E8EEE8", color: "black" },
    groupContainer: { marginBottom: 16 },
    menu: { 
      padding: 16, backgroundColor: "white",  display: "flex",  justifyContent: "space-between",
      alignItems: "center", flexDirection: "row", borderBottomWidth: 1, borderBottomColor: "#E8EEE8",
    }
  });

  const handleBlockedUserPress = () => {
    props.navigation.navigate('BlockedUsers');
  }

  const handleHiddenUserPress = () => {
    props.navigation.navigate('HiddenUsers');
  }

  React.useEffect(() => {
   
    return function cleanup(){

    }
  }, [])
  
  return(
    <View style={{ flex: 1, backgroundColor: "white" }}>
      <AppHeader style={{ backgroundColor: "transparent" }} navigation={props.navigation}/>
      <HeadlineTitle style={{ marginLeft: 16, marginRight: 16 }}>Privasi Saya</HeadlineTitle>
      <View style={styles.groupContainer}>
          <TouchableOpacity onPress={handleBlockedUserPress}>
            <View style={styles.menu}>
              <Text style={{ fontWeight: "500" }}>Blocked User</Text>
              <View style={{ display: "flex", flexDirection: "row", alignItems: "center" }}>
                <EvilIcons name="chevron-right" size={24} style={{ color: "#5E8864" }}/>
              </View>
            </View>
          </TouchableOpacity>
          <TouchableOpacity onPress={handleHiddenUserPress}>
            <View style={styles.menu}>
              <Text style={{ fontWeight: "500" }}>Hidden User</Text>
              <View style={{ display: "flex", flexDirection: "row", alignItems: "center" }}>
                <EvilIcons name="chevron-right" size={24} style={{ color: "#5E8864" }}/>
              </View>
            </View>
          </TouchableOpacity>
      </View>
    </View>
  )
}
PrivacyScreen.navigationOptions = { header: null }
export default withCurrentUser(PrivacyScreen);