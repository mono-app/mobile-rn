import React from "react";
import DocumentPicker from 'react-native-document-picker';
import Logger from "src/api/logger";
import MomentAPI from "modules/Moments/api/moment";
import { withCurrentUser } from "src/api/people/CurrentUser";

import Button from "src/components/Button";
import CircleAvatar from "src/components/Avatar/Circle";
import AppHeader from "src/components/AppHeader";
import { View, TextInput, FlatList } from "react-native";
import { IconButton, Text, Caption } from "react-native-paper";
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { MomentImageThumbnail } from "modules/Moments/components/MomentItem";
import { default as MaterialIcons } from "react-native-vector-icons/MaterialIcons";

function AddMomentScreen(props){
  const { currentUser } = props;
  const [ isSubmitting, setIsSubmitting ] = React.useState(false);
  const [ content, setContent ] = React.useState("");
  const [ images, setImages ] = React.useState([]);

  const handleContentChange = (content) => setContent(content);
  const handleSubmitMoment = async () => {
    setIsSubmitting(true);
    const payload = { message: content, images }
    await MomentAPI.publishMoment(currentUser.email, payload);
    setContent("");
    setIsSubmitting(false);
    props.navigation.goBack();
  }

  const handleGalleryPress = async () => {
    try{
      const results = await DocumentPicker.pickMultiple({ type: [DocumentPicker.types.images] });
      const newImages = results.map((result) => result.uri);
      const clonnedImages = Array.from(images);
      clonnedImages.push.apply(clonnedImages, newImages);
      setImages(clonnedImages)
    }catch(err){ Logger.log("AddMomentScreen.handleGalleryPress#err", err)}
  }

  return(
    <KeyboardAwareScrollView>
      <AppHeader navigation={props.navigation} style={{ backgroundColor: "transparent" }}/>

      <View style={{ padding: 16, flexDirection: "row", alignItems: "center" }}>
        <CircleAvatar size={50} style={{ marginRight: 8 }} uri={currentUser.profilePicture}/>
        <View style={{ justifyContent: "center" }}>
          <Text style={{ fontWeight: "bold", margin: 0 }}>{currentUser.applicationInformation.nickName}</Text>
          <Caption style={{ margin: 0 }}><MaterialIcons size={12} name="lock"/> Hanya teman</Caption>
        </View>
      </View>

      <View style={{ paddingHorizontal: 16, paddingBottom: 16 }}>
        <TextInput
          textAlignVertical="top" numberOfLines={4} fontSize={24}
          placeholder="Apa yang sedang Anda pikirkan?"
          value={content} onChangeText={handleContentChange} multiline/>
        <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
          <View style={{ flexDirection: "row" }}>
            <IconButton size={24} icon="photo-library" color="rgba(0, 0, 0, .56)" onPress={handleGalleryPress}/>
            <IconButton size={24} icon="photo-camera" color="rgba(0, 0, 0, .56)"/>
          </View>
          <Button isLoading={isSubmitting} disabled={isSubmitting} onPress={handleSubmitMoment} text="Publikasi"/>
        </View>
      </View>
      
      <FlatList 
        data={images} horizontal
        renderItem={({ item, index }) => {
          const style = (index === 0)? { marginLeft: 16, marginRight: 4 }: { marginLeft: 4, marginRight: 4 }
          return <MomentImageThumbnail source={{ uri: item }} style={style}/>
        }}>

      </FlatList>
    </KeyboardAwareScrollView>
  )
}

AddMomentScreen.navigationOptions = { header: null }
export default withCurrentUser(AddMomentScreen);