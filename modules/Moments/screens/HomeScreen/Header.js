import React from "react";
import { StyleSheet } from "react-native";
import { withCurrentUser } from "src/api/people/CurrentUser";
import { withNavigation } from "react-navigation";

import ImagePicker from 'react-native-image-picker';
import CircleAvatar from "src/components/Avatar/Circle";
import { TouchableOpacity } from "react-native";
import { Text, Surface, IconButton } from "react-native-paper";
import { SafeAreaView } from "react-navigation";

function Header(props){
  const { currentUser } = props;
  const styles = StyleSheet.create({
    addToMomentContainer: {
      paddingLeft: 16, paddingRight: 16, alignItems: "center", justifyContent: "center", 
      backgroundColor: "#E8EEE8", borderRadius: 8, marginLeft: 16, marginRight: 16, flex: 1
    }
  });
  
  const handleAddMomentPress = () => props.navigation.navigate("AddMoment");
  const handleQuickCameraPress = () => {
    const options = { mediaType: 'photo' };
    ImagePicker.launchCamera(options, (response) => {
      if(response.uri){
        const payload = { cameraPic: response }
        props.navigation.navigate("AddMoment", payload)
      }
    });
  }

  return (
    <Surface style={{ elevation: 4 }}>
      <SafeAreaView style={{ padding: 16, flexDirection: "row", justifyContent: "space-between" }}>
        <CircleAvatar size={50} uri={currentUser.profilePicture}/>
        <TouchableOpacity style={styles.addToMomentContainer} onPress={handleAddMomentPress}>
          <Text>Tambahkan moment</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={handleQuickCameraPress}>
          <IconButton icon="add-a-photo"  size={24}/>
        </TouchableOpacity>
      </SafeAreaView>
    </Surface>
  )
}
export default withNavigation(withCurrentUser(Header));