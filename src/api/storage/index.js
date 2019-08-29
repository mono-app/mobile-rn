import firebase from "react-native-firebase";
import uuid from "uuid/v4"
import RNFS from "react-native-fs"

export default class StorageAPI{

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