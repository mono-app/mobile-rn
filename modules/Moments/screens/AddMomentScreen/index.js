import React from "react";
import DocumentPicker from 'react-native-document-picker';
import Logger from "src/api/logger";
import MomentAPI from "modules/Moments/api/moment";
import { withCurrentUser } from "src/api/people/CurrentUser";
import ImagePickerListItem from "src/components/ImagePickerListItem"
import Button from "src/components/Button";
import CircleAvatar from "src/components/Avatar/Circle";
import AppHeader from "src/components/AppHeader";
import { View, TextInput, FlatList, PermissionsAndroid } from "react-native";
import { IconButton, Text, Caption } from "react-native-paper";
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { MomentImageThumbnail } from "modules/Moments/components/MomentItem";
import { default as MaterialIcons } from "react-native-vector-icons/MaterialIcons";
import uuid from "uuid/v4"
import DeleteDialog from "src/components/DeleteDialog";

function AddMomentScreen(props){
  const { currentUser } = props;
  const [ isSubmitting, setIsSubmitting ] = React.useState(false);
  const [ content, setContent ] = React.useState("");
  const [ images, setImages ] = React.useState([]);
  const [ selectedImageToDelete, setSelectedImageToDelete ] = React.useState(null);
  const [deleteDialog, setDeleteDialog] = React.useState(null);
  const [ initialImage, setinitialImage] = React.useState(props.navigation.getParam("cameraPic",null ));

  const handleContentChange = (content) => setContent(content);
  const handleSubmitMoment = async () => {
    setIsSubmitting(true);
    const payload = { message: content, images }
    await MomentAPI.publishMoment(currentUser.email, payload);
    setContent("");
    setIsSubmitting(false);
    props.navigation.goBack();
  }

  const requestStoragePermission = async () => {
    try {
      await PermissionsAndroid.requestMultiple(
        [PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE]
      );
     
    } catch (err) {
      console.warn(err);
    }
  }

  const handleGalleryPress = async () => {
    if(!(await PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE))){
      await requestStoragePermission()
      return
    }
    try{
      const results = await DocumentPicker.pickMultiple({ type: [DocumentPicker.types.images] });
      const clonnedImages = Array.from(images);
      for (const res of results) {
        clonnedImages.push({id: uuid(), ...res})
      }
      setImages(clonnedImages)
    }catch(err){ Logger.log("AddMomentScreen.handleGalleryPress#err", err)}
  }

  const handleCameraPress = async () => {
    if(!(await PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE))){
      await requestStoragePermission()
      return
    }
    const payload = {
      onRefresh:(image)=> {
          const clonnedImages = Array.from(images);
          clonnedImages.push({id: uuid(), ...image});
          setImages(clonnedImages)

        }
    }
    props.navigation.navigate("CameraMoment",payload)
  }

  const handleDeleteImagePress = (item) => {
    setSelectedImageToDelete(item)
    if(deleteDialog)
      deleteDialog.toggleShow()
  }

  onDeletePress = () => {
    
    const newselectedImageToDelete = images.filter((image) => {
      return image.id!= selectedImageToDelete.id
    })

    setImages([])

    setImages(newselectedImageToDelete)
    if(deleteDialog)
      deleteDialog.toggleShow()
  }  

  React.useEffect(() => {
    if(initialImage){
      const clonnedImages = Array.from(images);
      clonnedImages.push({id: uuid(), ...initialImage});
      setImages(clonnedImages)
      console.log(clonnedImages)
    }
  }, [])

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
            <IconButton size={24} icon="photo-camera" color="rgba(0, 0, 0, .56)" onPress={handleCameraPress}/>
          </View>
          <Button isLoading={isSubmitting} disabled={isSubmitting} onPress={handleSubmitMoment} text="Publikasi"/>
        </View>
      </View>
      
      <FlatList 
        data={images} horizontal
        keyExtractor={(item) => item.id}
        renderItem={({ item, index }) => {
          const style = (index === 0)? { marginLeft: 16, marginRight: 4 }: { marginLeft: 4, marginRight: 4 }
          return <ImagePickerListItem 
                    onPress={() => handleDeleteImagePress(item)}
                    image={item}/>
        }}>

      </FlatList>
      <DeleteDialog 
          ref ={i => setDeleteDialog(i)}
          title= {"Apakah anda ingin menghapus gambar ini?"}
          onDeletePress={this.onDeletePress}/>
    </KeyboardAwareScrollView>
  )
}

AddMomentScreen.navigationOptions = { header: null }
export default withCurrentUser(AddMomentScreen);