import IOSImagePicker from "react-native-image-crop-picker";
import DocumentPicker from 'react-native-document-picker';
import Permissions from "react-native-permissions";
import firebase from "react-native-firebase";
import RNFS from "react-native-fs"
import uuid from "uuid/v4"
import { Platform } from "react-native";

export default class StorageAPI{

  static async requestGalleryPermission(){
    const permissionString = (Platform.OS === "ios")? "photo": "storage";
    const permissionResponse = await Permissions.request(permissionString);
    return Promise.resolve(permissionResponse);
  }

  static async checkGalleryPermission(){
    const permissionString = (Platform.OS === "ios")? "photo": "storage";
    const permissionResponse = await Permissions.check(permissionString);
    return Promise.resolve(permissionResponse);
  }

  static async openGallery(multiple=true){
    const galleryPermission = await StorageAPI.checkGalleryPermission();
    if(galleryPermission === "denied") return Promise.reject(galleryPermission);
    else if(galleryPermission === "undetermined") {
      await StorageAPI.requestGalleryPermission();
      StorageAPI.openGallery(multiple);
    }

    if(Platform.OS === "ios"){
      const results = await IOSImagePicker.openPicker({ mediaType: "photo", multiple });
      const normalizedResults = results.map((image) => {
        return { uri: image.sourceURL, size: image.size }
      })
      return Promise.resolve(normalizedResults);
    }else if(Platform.OS === "android" && multiple){
      const results = await DocumentPicker.pickMultiple({ type: [DocumentPicker.types.images] });
      return Promise.resolve(results);
    }else if(Platform.OS === "android" && !multiple){
      const results = await DocumentPicker.pick({ type: [DocumentPicker.types.images] });
      return Promise.resolve([results]);
    }
  }

  /**
   * 
   * @param {String} storagePath - Firebase storage path
   * @param {String} filePath - local storage path, it will remove file:// bydefault, so include it
   * @returns {String} - a string of download url
   */
  static async uploadFile(storagePath, filePath){
    const blob = await RNFS.readFile(filePath,"base64")
    const filename = uuid()
    const tempUrl = `${RNFS.CachesDirectoryPath}/${filename}.png`

    await RNFS.writeFile(tempUrl, blob, "base64")

    const storage = firebase.storage();
    const storageRef = storage.ref(storagePath);
    await storageRef.putFile(tempUrl)
    await RNFS.unlink(tempUrl)
    const downloadUrl = await storageRef.getDownloadURL()
    return Promise.resolve(downloadUrl)
  }

  /**
   * @param {String} storagePath - Firebase Storage path
   */
  static getDownloadURL(storagePath){
    const storage = firebase.storage();
    const storageRef = storage.ref(storagePath);
    return storageRef.getDownloadURL();
  }
}