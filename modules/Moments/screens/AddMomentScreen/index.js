import React from "react";
import DocumentPicker from 'react-native-document-picker';
import Logger from "src/api/logger";
import MomentAPI from "modules/Moments/api/moment";
import uuid from "uuid/v4"
import Permissions from "react-native-permissions";
import ImagePicker from 'react-native-image-picker';
import IOSImagePicker from "react-native-image-crop-picker";
import { withCurrentUser } from "src/api/people/CurrentUser";
import { Platform } from "react-native";

import ImageListItem from "src/components/ImageListItem"
import Button from "src/components/Button";
import CircleAvatar from "src/components/Avatar/Circle";
import AppHeader from "src/components/AppHeader";
import DeleteDialog from "src/components/DeleteDialog";
import ImageCompress from "src/api/ImageCompress"
import { View, TextInput, FlatList } from "react-native";
import { IconButton, Text, Caption } from "react-native-paper";
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { default as MaterialIcons } from "react-native-vector-icons/MaterialIcons";

function AddMomentScreen(props){
  const _isMounted = React.useRef(true);

  const { currentUser } = props;
  const [ isSubmitting, setIsSubmitting ] = React.useState(false);
  const [ content, setContent ] = React.useState("");
  const [ images, setImages ] = React.useState([]);
  const [ selectedImageToDelete, setSelectedImageToDelete ] = React.useState(null);
  const [deleteDialog, setDeleteDialog] = React.useState(null);
  const [ initialImage, setinitialImage ] = React.useState(props.navigation.getParam("cameraPic",null ));

  const handleContentChange = (content) => {
    if(_isMounted.current) setContent(content) 
  }
  const handleSubmitMoment = async () => {
    if(_isMounted.current) setIsSubmitting(true);
    const payload = { message: content, images }
    await MomentAPI.publishMoment(currentUser.email, payload);
    if(_isMounted.current){
      setContent("");
      setIsSubmitting(false)
    }
    props.navigation.goBack();
  }

  const handleGalleryPress = async () => {
    const isPermissionGranted = await checkPermission();
    if(!isPermissionGranted){
      await requestStoragePermission();
      return;
    }

    try{
      let results;
      if(Platform.OS === "ios"){
        results = await IOSImagePicker.openPicker({ mediaType: "photo", multiple: true });

        // Normalize image result from ios
        results = results.map((image) => {
          return { uri: image.sourceURL, size: image.size }
        })
      }else if(Platform.OS === "android"){
        results = await DocumentPicker.pickMultiple({ type: [DocumentPicker.types.images] });
      }
      Logger.log("AddMomentScreen.handleGalleryPress:results", results);

      const clonnedImages = Array.from(images);
      for (const res of results) {
        const compressedRes = await ImageCompress.compress(res.uri, res.size)
        clonnedImages.push({id: uuid(), ...compressedRes});
      }
      if(_isMounted.current) setImages(clonnedImages)
    }catch(err){ Logger.log("AddMomentScreen.handleGalleryPress#err", err)}
  }

  const handleCameraPress = async () => {
    const isPermissionGranted = await checkPermission();
    if(!isPermissionGranted){
      await requestStoragePermission();
      return;
    }

    try{
      // IOSImagePicker will work for Android and iOS
      // TODO: test on real device for iOS
      const result = await IOSImagePicker.openCamera({ mediaType: "photo" });
      Logger.log("AddMomentScreen.handleCameraPress#result", result);

      const compressedRes = await ImageCompress.compress(result.path, result.size);
      const clonnedImages = Array.from(images);
      clonnedImages.push({ id: uuid(), ...compressedRes });
      if(_isMounted.current) setImages(clonnedImages)
    }catch(err){ Logger.log("AddMomentScreen.handleCameraPress#err", err) }
  }

  const handleDeleteImagePress = (item) => {
    if(_isMounted.current) setSelectedImageToDelete(item)
    if(deleteDialog) deleteDialog.toggleShow()
  }

  const onDeletePress = () => {
    const newselectedImageToDelete = images.filter((image) => image.id!= selectedImageToDelete.id)
    if(_isMounted.current){
      setImages([])
      setImages(newselectedImageToDelete)
    }
    if(deleteDialog) deleteDialog.toggleShow()
  } 

  const checkPermission = async () => {
    let permissionResponse;
    if(Platform.OS === "android"){
      permissionResponse = await Permissions.check("storage");
    }else if(Platform.OS === "ios"){
      permissionResponse = await Permissions.check("photo");
    }

    Logger.log("AddMommentScreen.checkPermission:permissionResponse", permissionResponse);
    if(permissionResponse === "authorized") return true;
    else return false;
  }
  
  const requestStoragePermission = async () => {
    try{
      Logger.log("AddMomentScreen.requestStoragePermission", "requesting new permission");
      let permissionResponse;
      if(Platform.OS === "android"){
        permissionResponse = await Permissions.request("storage");
      }else if(Platform.OS === "ios"){
        permissionResponse = await Permissions.request("photo");
      }

      // TODO: do something for this permissions please
      Logger.log("AddMommentScreen.requestStoragePermission:permissionResponse", permissionResponse);
      if(permissionResponse === "authorized"){
        // do something if authorized
      }else{
        // do something if unauthorized
      }
    }catch(err){
      Logger.log("AddMomentScreen.requestStoragePermission:err", err);
    }
  }

  React.useEffect(() => {
    const init = async () => {
      if(initialImage){
        const fileSize = (initialImage.size)?initialImage.size : initialImage.fileSize
        
        const compressedRes = await ImageCompress.compress(initialImage.uri, fileSize)
  
        const clonnedImages = Array.from(images);
        clonnedImages.push({id: uuid(), ...compressedRes});
        if(_isMounted.current)
          setImages(clonnedImages)
      }
    }
    init()
    return () => {
      _isMounted.current = false;
    };
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
          placeholder="Apa yang sedang Anda pikirkan?" style={{ minHeight: 180, maxHeight: 240 }}
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
        data={images} style={{ margin: 16 }}
        keyExtractor={(item) => item.id} numColumns={3}
        renderItem={({ item, index }) => <ImageListItem onPress={() => handleDeleteImagePress(item)} image={item}/>}/>
        
      <DeleteDialog 
          ref ={i => setDeleteDialog(i)}
          title= {"Apakah anda ingin menghapus gambar ini?"}
          onDeletePress={onDeletePress}/>
    </KeyboardAwareScrollView>
  )
}

AddMomentScreen.navigationOptions = { header: null }
export default withCurrentUser(AddMomentScreen);