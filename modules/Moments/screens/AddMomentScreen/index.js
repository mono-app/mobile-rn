import React from "react";
import { View, Dimensions, Image } from "react-native";
import { Text, Avatar, Caption, IconButton, Button } from "react-native-paper";
import { default as MaterialIcons } from "react-native-vector-icons/MaterialIcons";
import { TextInput } from "react-native-gesture-handler";
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'

export default class AddMomentScreen extends React.Component{
  static navigationOptions = { headerTitle: "Menambahkan Moment" };

  render(){
    const window = Dimensions.get("window");

    return(
      <KeyboardAwareScrollView> 
        <View style={{ padding: 16, flexDirection: "row", alignItems: "flex-start" }}>
          <Avatar.Image size={50} source={{ uri: "https://picsum.photos/200/200/?random" }} style={{ marginRight: 16 }}/>
          <View style={{ justifyContent: "center" }}>
            <Text style={{ fontWeight: "700" }}>Frans Huang</Text>
            <Caption><MaterialIcons size={12} name="lock"/> Hanya teman</Caption>
          </View>
        </View>

        <View style={{ paddingHorizontal: 16, paddingBottom: 16 }}>
          <TextInput
            multiline={true}
            textAlignVertical="top"
            numberOfLines={4}
            placeholder="Apa yang sedang Anda pikirkan?"
            fontSize={24}/>
          <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
            <View style={{ flexDirection: "row" }}>
              <IconButton size={24} icon="photo-library" color="rgba(0, 0, 0, .54)"/>
              <IconButton size={24} icon="photo-camera" color="rgba(0, 0, 0, .54)"/>
            </View>
            <Button mode="text">Publikasi</Button>
          </View>
        </View>

        <View style={{ backgroundColor: "gray", flex: 1 }}>
          <Image source={{ uri: "https://picsum.photos/1080/720/?random" }} style={{ height: 200, alignItems: "stretch", resizeMode: "cover" }}/>
          <View style={{ flex: 1, flexDirection: "row", justifyContent: "space-evenly" }}>
            <Image source={{ uri: "https://picsum.photos/1080/720/?random" }} style={{ height: (window.width/4), alignSelf: "stretch", flex: 1, resizeMode: "cover" }}/>
            <Image source={{ uri: "https://picsum.photos/1080/720/?random" }} style={{ height: (window.width/4), alignSelf: "stretch", flex: 1, resizeMode: "cover" }}/>
            <Image source={{ uri: "https://picsum.photos/1080/720/?random" }} style={{ height: (window.width/4), alignSelf: "stretch", flex: 1, resizeMode: "cover" }}/>
            <View style={{ alignSelf: "stretch", flex: 1, height: (window.width/4) }}>
              <Image source={{ uri: "https://picsum.photos/1080/720/?random" }} style={{ alignSelf: "stretch", flex: 1, resizeMode: "cover" }}/>
              <View style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, backgroundColor: "rgba(0, 0, 0, .7)", alignItems: "center", justifyContent: "center" }}>
                <Text style={{ color: "white" }}>+7</Text>
              </View>
            </View>
          </View>
        </View>
      </KeyboardAwareScrollView>
    )
  }
}